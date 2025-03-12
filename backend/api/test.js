import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import { createCanvas, loadImage } from "canvas";
import path from "path";
dotenv.config();

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

const imagePath = path.resolve("backend/api/image.png"); // Adjust if the image is inside a subfolder
const uploadResult = await fileManager.uploadFile(imagePath, {
  mimeType: "image/png",
  displayName: "fit",
});

console.log(
  `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
);

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
      outfit = JSON.parse(response.text());
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      // Fallback to raw response if parsing fails
      outfit = {
        error: "Failed to parse outfit data",
        rawResponse: response.text()
      };
    }

    // 7. Create an image based on the outfit data
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    // Load images for each clothing item
    const topImage = outfit.top ? await loadImage(outfit.top) : null;
    const bottomImage = outfit.bottom ? await loadImage(outfit.bottom) : null;
    const outerwearImage = outfit.outerwear ? await loadImage(outfit.outerwear) : null;
    const shoesImage = outfit.shoes ? await loadImage(outfit.shoes) : null;
    const accessoriesImage = outfit.accessories ? await loadImage(outfit.accessories) : null;

    // Draw images on the canvas
    if (topImage) ctx.drawImage(topImage, 50, 50, 200, 200);
    if (bottomImage) ctx.drawImage(bottomImage, 50, 300, 200, 200);
    if (outerwearImage) ctx.drawImage(outerwearImage, 300, 50, 200, 200);
    if (shoesImage) ctx.drawImage(shoesImage, 300, 300, 200, 200);
    if (accessoriesImage) ctx.drawImage(accessoriesImage, 550, 50, 200, 200);

    // Save the image as image.jpg
    const buffer = canvas.toBuffer("image/jpeg");
    fs.writeFileSync("image.jpg", buffer);

    return {
      outfit,
      weather: {
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].main,
        suggestions: weatherSuggestions
      },
      image: "image.jpg"
    };

  } catch (error) {
    console.error("Error in generateOutfit:", error);
    throw new Error("Failed to generate outfit recommendation");
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent([
  "tell me what clothing he is wearing. keep this 1-2 words such as blue shirt. if you can find the brand include that, such as nike shoes or nike air forces. find out his top and bottom clothes as well as any accessories. you can just list the items. then prompt one word of the person's clothing style",
  {
    fileData: {
      fileUri: uploadResult.file.uri,
      mimeType: uploadResult.file.mimeType,
    },
  },
]);
console.log(result.response.text());