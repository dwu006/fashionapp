import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import WardrobeItem from "../models/WardrobeItem.js";
import getWeather from "./weather.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const genAI = new GoogleGenerativeAI(process.env.MAIN_GEMINI_API_KEY);

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
        console.log("user id: ", userId)
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
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

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
            outfit = JSON.parse(response.text());
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