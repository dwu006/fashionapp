import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import WardrobeItem from "../models/WardrobeItem.js";
import getWeather from "../api/weather.js";
import { createCanvas } from 'canvas';
import fs from 'fs';
import { SchemaType } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper function to convert Buffer to base64
const bufferToBase64 = (buffer) => {
    return buffer.toString('base64');
};

// Helper function to get weather-appropriate clothing suggestions
const getWeatherSuggestions = (weatherData) => {
    const temp = weatherData.main.temp;
    const weather = weatherData.weather[0].main.toLowerCase();


    let suggestions = {
        outerwear: [],
        general: []
    };

    // Temperature-based suggestions
    if (temp < 50) {
        suggestions.outerwear.push('heavy coat', 'winter jacket');
        suggestions.general.push('warm layers', 'thermal wear');
    } else if (temp < 65) {
        suggestions.outerwear.push('light jacket', 'sweater');
        suggestions.general.push('layered clothing');
    } else if (temp < 75) {
        suggestions.outerwear.push('light cardigan', 'light sweater');
    } else {
        suggestions.general.push('light, breathable clothing');
    }

    // Weather condition-based suggestions
    if (weather.includes('rain')) {
        suggestions.outerwear.push('raincoat', 'waterproof jacket');
        suggestions.general.push('water-resistant clothing');
    } else if (weather.includes('snow')) {
        suggestions.outerwear.push('snow jacket', 'winter coat');
        suggestions.general.push('waterproof, insulated clothing');
    } else if (weather.includes('wind')) {
        suggestions.outerwear.push('windbreaker');
    }

    return suggestions;
};

export async function generateOutfit(userId, prompt, lat, lon) {
    try {
        // 1. Get weather data
        const weatherData = await getWeather(lat, lon);
        const weatherSuggestions = getWeatherSuggestions(weatherData);

        // 2. Fetch user's wardrobe items
        const wardrobeItems = await WardrobeItem.find({ user: userId });
        // 3. Prepare wardrobe data for Gemini
        const wardrobeData = wardrobeItems.map(item => ({
            category: item.category,
            imageBase64: item.image ? bufferToBase64(item.image.data) : null
        }));

        // 4. Initialize Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 5. Prepare the prompt for Gemini
        const systemPrompt = `You are a professional fashion stylist. Analyze the following wardrobe items and create an outfit based on:
        
        Weather: ${weatherData.main.temp}°F, ${weatherData.weather[0].main}
        Weather Suggestions: ${JSON.stringify(weatherSuggestions)}
        User Request: ${prompt}

        Select one item from each required category (top, bottom, shoes) and optionally from outerwear and accessories.
        Consider both style and weather appropriateness.
        
        Format your response as a JSON object with the following structure:
        {
            "top": "description or empty string",
            "bottom": "description or empty string",
            "outerwear": "description or empty string",
            "shoes": "description or empty string",
            "accessories": "description or empty string",
            "explanation": "brief explanation of choices"
        }`;

        // 6. Generate outfit recommendation
        const result = await model.generateContent([
            systemPrompt,
            ...wardrobeData.map(item => ({
                inlineData: {
                    mimeType: "image/jpeg",
                    data: item.imageBase64
                }
            }))
        ]);

        const response = result.response;
        let outfit;

        try {
            // Parse the response to get structured outfit data
            outfit = response.text();
        } catch (error) {
            console.error("Error parsing Gemini response:", error);
            // Fallback to raw response if parsing fails
            outfit = {
                error: "Failed to parse outfit data",
                rawResponse: response.text()
            };
        }
        return {
            outfit,
            weather: {
                temperature: weatherData.main.temp,
                condition: weatherData.weather[0].main,
                suggestions: weatherSuggestions
            }
        };

    } catch (error) {
        console.error("Error in generateOutfit:", error);
        throw new Error("Failed to generate outfit recommendation");
    }
}

const aiController = {
    respondToPrompt: async (req, res) => {
        try {
            const { prompt } = req.body;
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
            });
            const result = await model.generateContent([`${prompt}`]);
            const generatedTexts = result.response.text();

            return res.json({
                message: 'Clothing generated successfully',
                data: generatedTexts
            })
        }
        catch (error) {
            console.error("Error responding:", error);
            throw new Error("Failed to respond.");
        }
    },
    analyzeClothing: async (req, res) => {
        try {
            var path;
            if (req.file) {
                path = req.file?.path; // Ensure file exists
            }

            if (!req.file && !req.body.image) {
                return res.status(400).json({ message: 'No image uploaded' });
            }

            // Extract request data
            const { userId, category, prompt, latitude, longitude } = req.body;

            // Fetch weather data & wardrobe items in parallel
            const weatherData = await getWeather(latitude, longitude);
            let wardrobeItems = await WardrobeItem.find({ user: userId });

            if (!wardrobeItems || wardrobeItems.length === 0) {
                return res.status(400).json({ message: 'No wardrobe items found' });
            }

            // Get weather suggestions
            const weatherSuggestions = getWeatherSuggestions(weatherData);

            // Convert uploaded image to Base64
            const base64Image = path
                ? bufferToBase64(fs.readFileSync(path))
                : req.body.image.replace(/^data:image\/\w+;base64,/, '');

            // Prepare wardrobe data (limit to 9 images)
            const wardrobeData = wardrobeItems
                .map(item => ({
                    category: item.category,
                    imageBase64: item.image && item.image.data ? bufferToBase64(item.image.data) : null
                }))
                .filter(item => item.imageBase64 !== null)  // Remove null images
                .slice(0, 9); // Take only 9 images max

            // Format the prompt
            const formattedPrompt = `
                Given this prompt: ${prompt},
                considering the weather: ${weatherData.main.temp}°F, ${weatherData.weather[0].main},
                and the following wardrobe items, analyze the uploaded clothing image
                and determine if any wardrobe items match or complement the outfit.
                Return the categories of matching items.
            `;

            // Initialize Gemini Model
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Generate outfit suggestion
            const result = await model.generateContent([
                { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
                formattedPrompt,
                ...wardrobeData.map(item => ({
                    inlineData: { mimeType: "image/jpeg", data: item.imageBase64 }
                }))
            ]);

            // Extract matching items from Gemini response
            const responseText = await result.response.text();
            const matchingItems = wardrobeData.filter(item =>
                responseText.includes(item.category)  // Match based on category names in response
            );

            return res.json({
                message: 'Clothing analyzed successfully',
                matchingItems: matchingItems.map(item => item.category),  // Return categories of matched items
                images: matchingItems.map(item => item.imageBase64),  // Return matching images
                data: responseText,
            });

        } catch (error) {
            console.error("Error analyzing clothing:", error);
            res.status(500).json({ message: "Failed to analyze clothing", error: error.message });
        }
    },


    createClothing: async (req, res) => {
        try {
            const { userId, prompt, latitude, longitude } = req.body;
            const result = await generateOutfit(userId, prompt, latitude, longitude);
            const outfitData = result.outfit;
            const cleanedOutfit = outfitData.replace(/```json\n|```/g, '');
            const weather = result.weather;
            const parsedOutfit = JSON.parse(cleanedOutfit);
            const image = result.image;

            return res.json({
                message: 'Clothing generated successfully',
                data: parsedOutfit,
                weather: weather,
                image: image,
            });
        }
        catch (error) {
            console.error("Error generating clothing:", error);
            throw new Error("Failed to generate clothing.");
        }
    },
}

export default aiController;