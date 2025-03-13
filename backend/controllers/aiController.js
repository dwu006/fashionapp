import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import WardrobeItem from "../models/WardrobeItem.js";
import getWeather from "../api/weather.js";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("ERROR: Gemini API key is missing");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper function to convert Buffer to base64
const bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    try {
        return Buffer.from(buffer).toString('base64');
    } catch (error) {
        console.error("Error converting buffer to base64:", error);
        return null;
    }
};

// Helper function to get weather-appropriate clothing suggestions
const getWeatherSuggestions = (weatherData) => {
    if (!weatherData || !weatherData.main || !weatherData.weather) {
        return {
            outerwear: [],
            general: []
        };
    }

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

// Function to analyze a single wardrobe item and get its description
async function analyzeWardrobeItem(item) {
    try {
        if (!item.image || !item.image.data) {
            console.log(`Item ${item._id} has no image data`);
            return null;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const base64Image = bufferToBase64(item.image.data);
        
        if (!base64Image) {
            console.log(`Failed to convert image data for item ${item._id}`);
            return null;
        }

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,
                    mimeType: item.image.contentType || "image/jpeg"
                }
            },
            `Describe this clothing item in a brief phrase (5-10 words max). Include color, style, type (e.g., "blue button-up dress shirt", "black slim-fit jeans", "brown leather boots"). Only describe what you see.`
        ]);

        return {
            id: item._id.toString(),
            category: item.category,
            description: result.response.text().trim(),
            analyzed: true
        };
    } catch (error) {
        console.error(`Error analyzing wardrobe item ${item._id}:`, error);
        return {
            id: item._id.toString(),
            category: item.category,
            description: getDefaultDescription(item.category),
            analyzed: false
        };
    }
}

// Helper function to get a default description if image analysis fails
function getDefaultDescription(category) {
    const descriptions = {
        top: ["casual t-shirt", "button-up shirt", "polo shirt", "long-sleeve shirt"],
        bottom: ["jeans", "dress pants", "chinos", "shorts"],
        outerwear: ["jacket", "coat", "hoodie", "sweater"],
        shoes: ["sneakers", "dress shoes", "boots", "casual shoes"],
        accessories: ["watch", "belt", "hat", "scarf"],
        other: ["casual item", "formal item", "specialty item"]
    };
    
    const options = descriptions[category] || descriptions.other;
    return options[Math.floor(Math.random() * options.length)];
}

// Function to analyze user's entire wardrobe
async function analyzeWardrobe(userId) {
    try {
        console.log(`Analyzing wardrobe for user ${userId}`);
        
        // Fetch wardrobe items
        const wardrobeItems = await WardrobeItem.find({ user: userId });
        
        if (!wardrobeItems || wardrobeItems.length === 0) {
            console.log("No wardrobe items found");
            return [];
        }
        
        console.log(`Found ${wardrobeItems.length} wardrobe items`);
        
        // Process items one by one to avoid overwhelming the API
        const analyzedItems = [];
        
        for (const item of wardrobeItems) {
            try {
                console.log(`Analyzing item ${item._id} (${item.category})`);
                const analyzedItem = await analyzeWardrobeItem(item);
                
                if (analyzedItem) {
                    analyzedItems.push(analyzedItem);
                    console.log(`Successfully analyzed: ${analyzedItem.description}`);
                }
                
                // Small delay to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (itemError) {
                console.error(`Error processing item ${item._id}:`, itemError);
                // Continue with next item even if one fails
            }
        }
        
        console.log(`Successfully analyzed ${analyzedItems.length} of ${wardrobeItems.length} items`);
        return analyzedItems;
    } catch (error) {
        console.error("Error analyzing wardrobe:", error);
        throw error;
    }
}

// Format wardrobe items for the outfit generator
function formatWardrobeForOutfitGenerator(analyzedItems) {
    // Group by category
    const categorized = {};
    
    analyzedItems.forEach(item => {
        if (!categorized[item.category]) {
            categorized[item.category] = [];
        }
        categorized[item.category].push(item);
    });
    
    // Format as text
    let inventoryText = "WARDROBE INVENTORY:\n\n";
    
    for (const [category, items] of Object.entries(categorized)) {
        if (items.length > 0) {
            inventoryText += `${category.toUpperCase()} (${items.length} items):\n`;
            items.forEach((item, index) => {
                inventoryText += `- ${category.toUpperCase()} #${index + 1}: ${item.description}\n`;
            });
            inventoryText += "\n";
        }
    }
    
    return { categorized, inventoryText };
}

// Generate outfit based on analyzed wardrobe
async function generateOutfitWithAnalyzedWardrobe(userId, analyzedWardrobe, prompt, weatherData) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const weatherSuggestions = getWeatherSuggestions(weatherData);
        
        // Format wardrobe for prompt
        const { inventoryText, categorized } = formatWardrobeForOutfitGenerator(analyzedWardrobe);
        
        // Check if we have necessary categories for an outfit
        const hasTop = (categorized.top && categorized.top.length > 0);
        const hasBottom = (categorized.bottom && categorized.bottom.length > 0);
        const hasShoes = (categorized.shoes && categorized.shoes.length > 0);
        
        if (!hasTop && !hasBottom && !hasShoes) {
            return {
                error: true,
                message: "Your wardrobe doesn't have enough items for a complete outfit. Please add more items.",
                outfit: {
                    top: "",
                    bottom: "",
                    outerwear: "",
                    shoes: "",
                    accessories: "",
                    explanation: "Unable to create outfit: Your wardrobe needs more items."
                }
            };
        }
        
        // Create prompt for Gemini
        const systemPrompt = `You are a professional fashion stylist. Create an outfit based on:
        
        Weather: ${weatherData.main.temp}°F, ${weatherData.weather[0].main}
        Weather Suggestions: ${JSON.stringify(weatherSuggestions)}
        User Request: ${prompt}
        
        ${inventoryText}
        
        IMPORTANT RULES:
        1. You must ONLY suggest items that are actually in the user's wardrobe from the inventory above.
        2. Refer to each item exactly as it appears in the inventory (e.g., "TOP #1: blue t-shirt").
        3. If the user doesn't have appropriate items for the occasion or weather, clearly state this.
        4. If a category is missing (e.g., no shoes), mention that in your explanation.
        5. Provide detailed styling advice explaining why the pieces work well together.
        
        Format your response as a JSON object with the following structure:
        {
            "top": "the exact description of a top from their wardrobe (e.g., 'TOP #1: blue t-shirt')",
            "bottom": "the exact description of a bottom from their wardrobe",
            "outerwear": "the exact description of outerwear from their wardrobe if needed and available",
            "shoes": "the exact description of shoes from their wardrobe",
            "accessories": "the exact description of accessories from their wardrobe if appropriate",
            "explanation": "detailed explanation of why these items work for the occasion and weather"
        }`;

        const result = await model.generateContent(systemPrompt);
        const response = result.response.text();
        
        try {
            // Clean the response to handle potential markdown code blocks
            const cleanedResponse = response.replace(/```json\n|```/g, '');
            const outfitData = JSON.parse(cleanedResponse);
            return { error: false, outfit: outfitData };
        } catch (error) {
            console.error("Error parsing Gemini response:", error);
            
            return {
                error: true,
                message: "Error generating outfit. Please try again.",
                outfit: {
                    explanation: "Error parsing the AI response. Please try again with a different prompt."
                }
            };
        }
    } catch (error) {
        console.error("Error in outfit generation:", error);
        throw error;
    }
}

export async function generateOutfit(userId, prompt, lat, lon) {
    try {
        // 1. Get weather data
        console.log("Fetching weather data for coordinates:", lat, lon);
        const weatherData = await getWeather(lat, lon);
        
        if (weatherData.error) {
            console.warn("Weather data error:", weatherData.error);
            // Continue with default weather
        }
        
        // 2. Analyze the user's wardrobe
        console.log("Starting wardrobe analysis for user:", userId);
        const analyzedWardrobe = await analyzeWardrobe(userId);
        
        if (analyzedWardrobe.length === 0) {
            console.log("No wardrobe items could be analyzed");
            return {
                outfit: JSON.stringify({
                    top: "",
                    bottom: "",
                    outerwear: "",
                    shoes: "",
                    accessories: "",
                    explanation: "Unable to create outfit: Please add items to your wardrobe first."
                }, null, 2),
                weather: {
                    temperature: weatherData.main?.temp || 70,
                    condition: weatherData.weather?.[0]?.main || "Clear"
                }
            };
        }
        
        // 3. Generate outfit based on analyzed wardrobe
        console.log("Generating outfit with analyzed wardrobe");
        const outfitResult = await generateOutfitWithAnalyzedWardrobe(userId, analyzedWardrobe, prompt, weatherData);
        
        // 4. Return the result
        return {
            outfit: JSON.stringify(outfitResult.outfit, null, 2),
            weather: {
                temperature: weatherData.main?.temp || 70,
                condition: weatherData.weather?.[0]?.main || "Clear"
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
            if (!prompt) {
                return res.status(400).json({ message: 'Prompt is required' });
            }
            
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
            });
            
            const result = await model.generateContent([`${prompt}`]);
            const generatedTexts = result.response.text();

            return res.json({
                message: 'Response generated successfully',
                data: generatedTexts
            });
        }
        catch (error) {
            console.error("Error responding:", error);
            return res.status(500).json({ 
                message: "Failed to generate response",
                error: error.message
            });
        }
    },
    
    analyzeClothing: async (req, res) => {
        try {
            let imagePath = null;
            let base64Image = null;
            
            // Handle image from file upload
            if (req.file) {
                imagePath = req.file.path;
                base64Image = bufferToBase64(fs.readFileSync(imagePath));
            } 
            // Handle image from base64 string
            else if (req.body.image) {
                base64Image = req.body.image.replace(/^data:image\/\w+;base64,/, '');
            } else {
                return res.status(400).json({ message: 'No image uploaded' });
            }

            const { userId, category, prompt, latitude, longitude } = req.body;

            // Fetch weather data
            const weatherData = await getWeather(latitude, longitude);
            const weatherSuggestions = getWeatherSuggestions(weatherData);

            // Initialize Gemini Model
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Format the prompt
            const formattedPrompt = `
                Given this prompt: ${prompt},
                considering the weather: ${weatherData.main?.temp || 70}°F, ${weatherData.weather?.[0]?.main || "Clear"},
                and Weather Suggestions: ${JSON.stringify(weatherSuggestions)}
                please analyze the clothing in the image and provide a recommendation.
            `;

            // Generate outfit suggestion
            const result = await model.generateContent([
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: "image/jpeg"
                    }
                },
                formattedPrompt
            ]);

            return res.json({
                message: 'Clothing analyzed successfully',
                matchingItems: matchingItems.map(item => item.category),  // Return categories of matched items
                images: matchingItems.map(item => item.imageBase64),  // Return matching images
                data: responseText,
            });

        } catch (error) {
            console.error("Error analyzing clothing:", error);
            res.status(500).json({ 
                message: "Failed to analyze clothing", 
                error: error.message 
            });
        }
    },


    createClothing: async (req, res) => {
        try {
            const { userId, prompt, latitude, longitude } = req.body;
            
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            
            if (!prompt) {
                return res.status(400).json({ message: 'Prompt is required' });
            }
            
            console.log(`Generating outfit for user ${userId} with prompt: "${prompt}"`);
            const result = await generateOutfit(userId, prompt, latitude, longitude);
            
            // Parse the outfit data if it's a string
            let parsedOutfit;
            try {
                parsedOutfit = typeof result.outfit === 'string' ? JSON.parse(result.outfit) : result.outfit;
            } catch (error) {
                console.warn("Could not parse outfit data as JSON:", error.message);
                // Create a simple object with the raw text
                parsedOutfit = {
                    explanation: result.outfit,
                };
            }

            return res.json({
                message: 'Outfit generated successfully',
                data: parsedOutfit,
                weather: result.weather
            });
        }
        catch (error) {
            console.error("Error generating clothing:", error);
            return res.status(500).json({ 
                message: "Failed to generate clothing", 
                error: error.message 
            });
        }
    },
};

export default aiController;