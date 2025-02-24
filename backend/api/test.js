import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const fileManager = new GoogleAIFileManager('AIzaSyDxNbeQxgqx3pEVmQ9-cWcd5D67gbOE1Pk');

const uploadResult = await fileManager.uploadFile(
  `image.png`,
  {
    mimeType: "image/png",
    displayName: "fit",
  },
);
console.log(
  `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
);it 


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent([
  "tell me what clothing he is wearing. keep this 1-2 words such as blue shirt. if you can find the brand include that, such as nike shoes or nike air forces. find out his top and bottom clothes as well as any accesories. you can just list the items. then prompt one word of the persons clothing style",
  {
    fileData: {
      fileUri: uploadResult.file.uri,
      mimeType: uploadResult.file.mimeType,
    },
  },
]);
console.log(result.response.text());