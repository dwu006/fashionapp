import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import WardrobeItem from "../models/WardrobeItem.js";
import getWeather from "../api/weather.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const genAI = new GoogleGenerativeAI(process.env.MAIN_GEMINI_API_KEY);
const GEMINI_API_KEY = process.env.MAIN_GEMINI_API_KEY;

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

export async function createClothing(req, res) {
    try {
        const { userId, prompt, latitude, longitude } = req.body;
        const result = await generateOutfit(userId, prompt, latitude, longitude);
        const outfitData = result.outfit;
        const cleanedOutfit = outfitData.replace(/```json\n|```/g, '');
        const weather = result.weather;
        const parsedOutfit = JSON.parse(cleanedOutfit);

        return res.json({
            message: 'Clothing generated successfully',
            data: parsedOutfit,
            weather: weather
        });
    }
    catch (error) {
        console.error("Error generating clothing:", error);
        throw new Error("Failed to generate clothing.");
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
    analyzeClothing: async (imagePath) => {
        try {
            const uploadResult = await fileManager.uploadFile(imagePath, {
                mimeType: "image/jpg",
                displayName: "fit",
            });

            console.log(`Uploaded file as: ${uploadResult.file.uri}`);
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        description: "Wardrobe items detected in the image",
                        type: SchemaType.OBJECT,
                        properties: {
                            wardrobeItems: {
                                type: SchemaType.ARRAY,
                                description: "List of detected wardrobe items",
                                items: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                        itemName: {
                                            type: SchemaType.STRING,
                                            description: "Name of the clothing item",
                                        },
                                        description: {
                                            type: SchemaType.STRING,
                                            description: "A short description of the clothing item",
                                        },
                                        color: {
                                            type: SchemaType.STRING,
                                            description: "Primary color of the clothing item",
                                        },
                                        imageURL: {
                                            type: SchemaType.STRING,
                                            description: "URL of the detected clothing item image",
                                        },
                                        category: {
                                            type: SchemaType.STRING,
                                            description: "Category of the clothing item (e.g., shirt, pants, shoes)",
                                        },
                                        style: {
                                            type: SchemaType.STRING,
                                            description: "One-two word summary of the item's style (e.g., casual, formal)",
                                        },
                                    },
                                    required: ["itemName", "description", "color", "category", "style"],
                                },
                            },
                        },
                        required: [],
                    },
                },
            });

            const result = await model.generateContent([
                "Analyze the clothing in the image and provide structured output. Identify individual pieces (e.g., 'blue shirt', 'Nike shoes') and summarize the style in one word.",
                {
                    fileData: {
                        fileUri: uploadResult.file.uri,
                        mimeType: uploadResult.file.mimeType,
                    },
                },
            ]);

            return result.response.json();
        } catch (error) {
            console.error("Error analyzing clothing:", error);
            throw new Error("Failed to analyze clothing.");
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

            return res.json({
                message: 'Clothing generated successfully',
                data: parsedOutfit,
                weather: weather
            });
        }
        catch (error) {
            console.error("Error generating clothing:", error);
            throw new Error("Failed to generate clothing.");
        }
    },
}

export default aiController;