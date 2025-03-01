import { GoogleGenerativeAI } from "@google/generative-ai";
import WardrobeItem from "../models/WardrobeItem.js";
import getWeather from "./weather.js";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API key not found in environment variables");
        }

        // 1. Get weather data
        const weatherData = await getWeather(lat, lon);
        const weatherSuggestions = getWeatherSuggestions(weatherData);

        // 2. Fetch user's wardrobe items
        const wardrobeItems = await WardrobeItem.find({ user: userId });
        
        if (!wardrobeItems || wardrobeItems.length === 0) {
            throw new Error("No wardrobe items found for user");
        }

        // 3. Prepare wardrobe data for Gemini
        const wardrobeData = wardrobeItems
            .filter(item => item.image && item.image.data)
            .map(item => ({
                category: item.category,
                description: item.description || '',
                color: item.color || '',
                imageBase64: bufferToBase64(item.image.data)
            }));

        if (wardrobeData.length === 0) {
            throw new Error("No valid wardrobe items with images found");
        }

        console.log(`Found ${wardrobeData.length} wardrobe items with images`);
        console.log('Categories:', wardrobeData.map(item => item.category).join(', '));

        // 4. Initialize Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 5. Prepare the prompt for Gemini
        const systemPrompt = `As a fashion stylist, create an outfit from these wardrobe items considering:
        
        Weather: ${weatherData.main.temp}°F, ${weatherData.weather[0].main}
        Weather Suggestions: ${JSON.stringify(weatherSuggestions)}
        User Request: ${prompt}

        Available Items:
        ${wardrobeData.map(item => 
            `- ${item.category}: ${item.description} (${item.color})`
        ).join('\n')}

        If there are no items in a category, just return N/A for that category.

        Return a JSON object with this structure:
        {
            "top": "selected top item description",
            "bottom": "selected bottom item description",
            "outerwear": "selected outerwear item (if needed)",
            "shoes": "selected shoes",
            "accessories": "selected accessories (if any)",
            "explanation": "brief explanation of why these items work together"
        }`;

        // 6. Generate outfit recommendation
        const result = await model.generateContent({
            contents: [{
                parts: [
                    { text: systemPrompt },
                    ...wardrobeData.map(item => ({
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: item.imageBase64
                        }
                    }))
                ]
            }]
        });

        if (!result || !result.response) {
            throw new Error("No response received from Gemini API");
        }

        const response = result.response;
        let outfit;

        try {
            // Parse the response to get structured outfit data
            const responseText = response.text();
            // Find the JSON object in the response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("No JSON found in response");
            }
            outfit = JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error("Error parsing Gemini response:", error);
            throw new Error("Failed to parse outfit recommendation");
        }

        // Validate outfit structure
        const requiredFields = ['top', 'bottom', 'shoes', 'explanation'];
        for (const field of requiredFields) {
            if (!outfit[field]) {
                throw new Error(`Missing required field in outfit: ${field}`);
            }
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
        throw error;
    }
}

export async function createClothing(req, res) {
    try {
        const { prompt } = req.body;
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });
        const result = await model.generateContent([`${prompt}`]);
        const generatedTexts = result.response.text();

        return res.json({
            message: 'Clothing generated successfully',
            data: generatedTexts
        });
    }
    catch (error) {
        console.error("Error generating clothing:", error);
        throw new Error("Failed to generate clothing.");
    }
}