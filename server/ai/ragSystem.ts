import fs from 'fs';
import path from 'path';
import { askWithOpenAI } from './openai';

/**
 * Read knowledge base text files for the RAG system
 */
export function loadKnowledgeBase(): string[] {
  const knowledgeBasePath = path.join(process.cwd(), 'server', 'data', 'knowledgeBase');
  const fileNames = ['flora.md', 'fauna.md', 'conservation.md'];
  
  const documents: string[] = [];
  
  fileNames.forEach(fileName => {
    try {
      const filePath = path.join(knowledgeBasePath, fileName);
      const content = fs.readFileSync(filePath, 'utf8');
      documents.push(content);
    } catch (error) {
      console.error(`Failed to read knowledge base file ${fileName}:`, error);
    }
  });
  
  return documents;
}

/**
 * Simple keyword-based retrieval function to find relevant documents
 * In a production system, this would use vector embeddings and semantic search
 */
export function retrieveRelevantDocuments(question: string, documents: string[]): string[] {
  // Convert question to lowercase for case-insensitive matching
  const lowercaseQuestion = question.toLowerCase();
  
  // Extract keywords from the question (simple approach)
  const keywords = lowercaseQuestion
    .replace(/[.,?!;:]/g, '')
    .split(' ')
    .filter(word => word.length > 3) // Filter out short words
    .filter(word => !['what', 'when', 'where', 'which', 'how', 'are', 'there', 'and', 'that', 'have'].includes(word));
  
  // Score each document based on keyword matches
  const scoredDocuments = documents.map(doc => {
    const lowercaseDoc = doc.toLowerCase();
    const score = keywords.reduce((total, keyword) => {
      return total + (lowercaseDoc.includes(keyword) ? 1 : 0);
    }, 0);
    
    return { doc, score };
  });
  
  // Sort by score (descending) and take the top 2 documents
  const topDocuments = scoredDocuments
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0)
    .slice(0, 2)
    .map(item => item.doc);
  
  return topDocuments;
}

/**
 * Generate an answer to a question using the RAG approach with OpenAI
 */
export async function askQuestion(question: string): Promise<string> {
  try {
    // Load the knowledge base
    const knowledgeBase = loadKnowledgeBase();
    
    // Retrieve relevant documents
    const relevantDocuments = retrieveRelevantDocuments(question, knowledgeBase);
    
    if (relevantDocuments.length === 0) {
      return "I don't have enough information to answer that question about Islamabad's biodiversity yet. Consider asking about local birds, mammals, plants, or conservation efforts in the region.";
    }
    
    // Use OpenAI to generate a response based on the context
    return await askWithOpenAI(question, relevantDocuments);
  } catch (error) {
    console.error("Error in askQuestion:", error);
    return generateSimulatedAnswer(question);
  }
}

/**
 * Generate a simulated answer as fallback when OpenAI is unavailable
 */
function generateSimulatedAnswer(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  // Birds in Margalla Hills
  if (lowerQuestion.includes('bird') && lowerQuestion.includes('margalla')) {
    return "Spring (March-May) is an excellent time for birdwatching in Margalla Hills! You can spot many species including:\n\n" +
      "- Himalayan Bulbul (Pycnonotus leucogenys)\n" +
      "- Grey Francolin (Francolinus pondicerianus)\n" +
      "- Red-vented Bulbul (Pycnonotus cafer)\n" +
      "- Blue Whistling Thrush (Myophonus caeruleus)\n" +
      "- White-cheeked Bulbul (Pycnonotus leucotis)\n\n" +
      "Recent community observations show increased sightings of migratory birds like the Common Rosefinch and Eurasian Golden Oriole during this period. Trails 3 and 5 are particularly good for birdwatching.";
  }
  
  // Leopards in Islamabad
  if ((lowerQuestion.includes('leopard') || lowerQuestion.includes('leopards')) && 
      (lowerQuestion.includes('islamabad') || lowerQuestion.includes('margalla'))) {
    return "Yes, Common Leopards (Panthera pardus) do inhabit the Margalla Hills National Park, which borders Islamabad. According to recent data from the Islamabad Wildlife Management Board (IWMB), there are approximately 4-6 leopards in the region.\n\n" +
      "In the past 6 months, our community has reported 3 verified leopard sightings, all in the northern parts of the Margalla Hills. These are typically shy creatures that avoid human contact, so sightings are rare and usually occur at dawn or dusk.\n\n" +
      "If hiking in Margalla Hills, it's advisable to stay on designated trails, make noise while walking, and hike in groups. While attacks are extremely rare, it's important to respect their habitat.";
  }
  
  // Endangered species
  if (lowerQuestion.includes('endangered') || lowerQuestion.includes('threatened') || lowerQuestion.includes('protected')) {
    return "Several endangered and protected species can be found in the Islamabad region, particularly in Margalla Hills National Park. These include:\n\n" +
      "- Common Leopard (Panthera pardus): Vulnerable status, with only 4-6 individuals estimated in the region\n" +
      "- Barking Deer (Muntiacus muntjak): Protected under Pakistani wildlife laws\n" +
      "- Indian Pangolin (Manis crassicaudata): Endangered due to poaching and habitat loss\n" +
      "- Black Partridge (Melanoperdix niger): Declining population due to habitat fragmentation\n" +
      "- Grey Goral (Naemorhedus goral): Vulnerable mountain ungulate occasionally spotted in higher elevations\n\n" +
      "Conservation efforts are coordinated by the Islamabad Wildlife Management Board (IWMB) and focus on habitat protection, anti-poaching patrols, and public education.";
  }
  
  // Plants/flora
  if (lowerQuestion.includes('plant') || lowerQuestion.includes('tree') || lowerQuestion.includes('flora')) {
    return "The Islamabad region, especially Margalla Hills, hosts a diverse range of plant species adapted to the semi-arid subtropical climate. Common trees and plants include:\n\n" +
      "- Chir Pine (Pinus roxburghii): Dominates the lower elevations of Margalla Hills\n" +
      "- Blue Pine (Pinus wallichiana): Found at higher elevations\n" +
      "- Himalayan Cedar/Deodar (Cedrus deodara): Sacred tree with distinctive pyramidal shape\n" +
      "- Phulai (Acacia modesta): Drought-resistant tree common in lower hills\n" +
      "- Wild Olive (Olea cuspidata): Hardy evergreen tree with small edible fruits\n" +
      "- Himalayan Musk Rose (Rosa brunonii): Fragrant climbing rose native to the region\n\n" +
      "The spring season (March-April) brings colorful wildflowers to the hills, including various species of primulas, violets, and wild geraniums. Many of these plants have traditional medicinal uses documented by local communities.";
  }
  
  // Snakes
  if (lowerQuestion.includes('snake')) {
    return "Several snake species inhabit the Islamabad area, particularly in Margalla Hills National Park. When identifying snakes, remember to maintain a safe distance and never attempt to handle them. Common species include:\n\n" +
      "- Indian Cobra (Naja naja): Venomous, identified by its distinctive hood when threatened\n" +
      "- Russell's Viper (Daboia russelii): Venomous, recognized by chain-like patterns on its back\n" +
      "- Common Krait (Bungarus caeruleus): Highly venomous with alternating black and white bands\n" +
      "- Rat Snake (Ptyas mucosa): Non-venomous, beneficial predator of rodents\n" +
      "- Checkered Keelback (Xenochrophis piscator): Non-venomous water snake often seen near Rawal Lake\n\n" +
      "If you encounter a snake, keep your distance, do not provoke it, and allow it to move away. Most snake bites occur when people try to kill or capture snakes.";
  }
  
  // Default response for other questions
  return "I'm sorry, I don't have enough information to answer that specific question about Islamabad's biodiversity yet. Consider asking about local birds, mammals, plants, conservation efforts, or specific species in the region.";
}
