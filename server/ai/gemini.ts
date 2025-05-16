import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import fs from 'fs';

// Initialize the Gemini API with the key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');
const modelName = 'gemini-pro-vision'; // For image-based identification
const textModelName = 'gemini-pro'; // For text-based Q&A

// Helper function to convert image to base64
function fileToGenerativePart(path: string) {
  // Check if the file exists
  if (!fs.existsSync(path)) {
    throw new Error(`File ${path} does not exist`);
  }

  const mimeType = path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const imageData = fs.readFileSync(path);
  return {
    inlineData: {
      data: imageData.toString('base64'),
      mimeType
    },
  };
}

/**
 * Use Gemini Vision API to identify species in an image
 * @param imagePath - The file path to the image for analysis
 * @returns Array of identification results with species, scientific name, and confidence
 */
export async function identifySpeciesWithGemini(imagePath: string): Promise<any[]> {
  try {
    // Load and process the image
    const imagePart = fileToGenerativePart(imagePath);
    
    // Configure the model
    const model = genAI.getGenerativeModel({
      model: modelName,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Create the prompt for species identification
    const prompt = `Analyze this image and identify the species (plant, animal, bird, insect, etc.) shown. 
    Focus on wildlife species found in Islamabad, Pakistan and Margalla Hills National Park area.
    Provide exactly 3 possible matches with the following information for each:
    - Common name
    - Scientific name
    - Confidence level (a number between 0.0 and 1.0)
    
    Return the results in valid JSON format with this exact structure:
    [
      {"species": "Common Name 1", "scientificName": "Scientific Name 1", "confidence": 0.95},
      {"species": "Common Name 2", "scientificName": "Scientific Name 2", "confidence": 0.85},
      {"species": "Common Name 3", "scientificName": "Scientific Name 3", "confidence": 0.65}
    ]
    
    Only provide the JSON output, no additional text before or after.`;

    // Generate content with the image
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr);
      } else {
        // If no JSON is found, create a structured fallback
        console.warn("No valid JSON found in Gemini response. Using fallback.");
        return [
          { 
            species: "Unknown Species", 
            scientificName: "Species incognita", 
            confidence: 0.5,
            note: "Gemini didn't return valid JSON. Original response: " + text.substring(0, 100) + "..."
          }
        ];
      }
    } catch (jsonError) {
      console.error("Error parsing JSON from Gemini response:", jsonError);
      return [
        { 
          species: "Parsing Error", 
          scientificName: "Error in analysis", 
          confidence: 0.1,
          note: "Could not parse Gemini response"
        }
      ];
    }
  } catch (error) {
    console.error("Error identifying species with Gemini:", error);
    throw error;
  }
}

/**
 * Use Gemini to answer biodiversity questions using the RAG approach
 * @param question The user's question
 * @param context Relevant documents from the knowledge base
 * @returns Generated answer based on the provided context
 */
export async function askWithGemini(question: string, context: string[]): Promise<string> {
  try {
    // Combine context documents
    const combinedContext = context.join('\n\n');
    
    // Configure the text model
    const model = genAI.getGenerativeModel({
      model: textModelName,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Create a prompt that uses the RAG approach
    const prompt = `You are a biodiversity expert for the Islamabad region of Pakistan, including Margalla Hills National Park.
    Use the following context information to answer the user's question.
    If the information needed isn't in the context, say so honestly and suggest what information might help.
    
    CONTEXT:
    ${combinedContext}
    
    USER QUESTION: ${question}
    
    Please provide a helpful, educational response about the biodiversity of this region.`;

    // Generate the answer
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error with Gemini Q&A:", error);
    throw error;
  }
}

/**
 * Process an image submitted through the chat interface
 * @param imagePath Path to the uploaded image
 * @param question Optional text context or question about the image
 * @returns AI response about the image
 */
export async function processChatImage(imagePath: string, question?: string): Promise<string> {
  try {
    // Load and process the image
    const imagePart = fileToGenerativePart(imagePath);
    
    // Configure the model
    const model = genAI.getGenerativeModel({
      model: modelName,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Create the prompt for the chat image
    const defaultQuestion = "What is shown in this image? If it's a plant or animal, can you identify it and provide information about it?";
    const prompt = question || defaultQuestion;

    // Generate content with the image
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error processing chat image with Gemini:", error);
    throw error;
  }
}