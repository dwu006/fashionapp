import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);


export const analyzeClothing = async (imagePath) => {
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
};

export const createClothing = async (req, res) => {
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
        console.error("Error generating clothing:", error);
        throw new Error("Failed to generate clothing.");
    }
}