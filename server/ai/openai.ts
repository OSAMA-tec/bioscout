import OpenAI from "openai";
import fs from 'fs';

// Check if OpenAI API key is valid
const apiKey = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;

try {
  if (apiKey) {
    openai = new OpenAI({ apiKey });
    console.log("OpenAI client initialized successfully");
  } else {
    console.warn("No OpenAI API key found. Fallback identification will be used.");
  }
} catch (error) {
  console.error("Error initializing OpenAI client:", error);
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Use OpenAI's Vision API to identify species in an image
 * @param imagePath - Path to the image file to analyze
 * @returns Array of identification results with species, scientific name, and confidence
 */
export async function identifySpeciesWithAI(imagePath: string): Promise<any[]> {
  try {
    // Convert image path to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Create the API request
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are a biodiversity expert specializing in fauna and flora of Islamabad and Margalla Hills National Park, Pakistan. 
            Analyze the provided image and identify the species. Focus only on wildlife (animals, birds, plants, insects, etc.). 
            Provide the common name, scientific name, and confidence level. Return exactly 3 most likely matches.
            Return the results in valid JSON format with this structure:
            [
              {"species": "Common Name", "scientificName": "Scientific Name", "confidence": 0.99},
              {"species": "Common Name 2", "scientificName": "Scientific Name 2", "confidence": 0.85},
              {"species": "Common Name 3", "scientificName": "Scientific Name 3", "confidence": 0.65}
            ]
            Confidence should be a number between 0 and 1.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify the species in this image from Islamabad region. Provide exactly 3 possible matches with confidence levels."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || "{}";
    // Parse and return the results
    const result = JSON.parse(content);
    return Array.isArray(result) ? result : (result.results || []);
  } catch (error) {
    console.error("Error identifying species with OpenAI:", error);
    // Fall back to simulated identification if OpenAI API fails
    const backupIdentifier = await import('./speciesIdentification');
    return backupIdentifier.identifySpecies(imagePath);
  }
}

/**
 * Enhanced RAG system using OpenAI
 * @param question User's question about biodiversity
 * @param context Retrieved documents from the knowledge base
 * @returns Generated answer based on the context
 */
export async function askWithOpenAI(question: string, context: string[]): Promise<string> {
  try {
    // Join all context documents
    const combinedContext = context.join("\n\n");
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are a biodiversity information assistant for the BioScout Islamabad platform. 
            Your role is to provide accurate, helpful information about the biodiversity of Islamabad and 
            surrounding areas like Margalla Hills National Park based on the context provided.
            
            If the context doesn't contain relevant information to answer a question, acknowledge that 
            and suggest what information might be helpful or how the user could find out more.
            
            Focus on being educational, concise, and factual. Use a friendly, engaging tone that encourages 
            conservation awareness without being preachy.`
        },
        {
          role: "user",
          content: `Context information to help answer the question:\n\n${combinedContext}\n\nQuestion: ${question}`
        }
      ],
    });

    return response.choices[0].message.content || "No response generated. Please try again later.";
  } catch (error) {
    console.error("Error with OpenAI RAG:", error);
    // Fall back to simulated answers if OpenAI API fails
    const backupRag = await import('./ragSystem');
    return backupRag.askQuestion(question);
  }
}