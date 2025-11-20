import { GoogleGenAI } from "@google/genai";
import { Restaurant, GeoLocation, PriceLevel, DistanceRange } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchRecommendations = async (
  location: GeoLocation,
  category: string,
  price: PriceLevel,
  distance: DistanceRange
): Promise<Restaurant[]> => {
  
  const modelId = "gemini-2.5-flash";
  
  // Construct a prompt that encourages structured output compatible with our parsing logic
  // Note: We cannot use responseMimeType: "application/json" with googleMaps tool.
  const prompt = `
    I am at Latitude: ${location.lat}, Longitude: ${location.lng}.
    Please recommend exactly 5 restaurants nearby.
    
    Filters:
    - Cuisine/Category: ${category === 'anything' ? 'Any popular food' : category}
    - Budget/Price Level: ${price}
    - Max Distance: ${distance}
    
    Instructions:
    1. Use Google Maps to find real places.
    2. Return the response as a list of 5 items.
    3. **The response content MUST be in Traditional Chinese (Taiwan).**
    4. For each item, strictly follow this text format on a new line:
       "NAME | CUISINE | PRICE_ESTIMATE | RATING | ONE_SENTENCE_DESCRIPTION"
    5. Example line: "鼎泰豐 | 麵食點心 | $$ | 4.5 | 小籠包皮薄餡多，是台灣必吃的排隊美食。"
    6. Ensure the places are currently operating or suitable for dining now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        }
      },
    });

    const text = response.text || "";
    
    // Extract grounding chunks to get real Map URLs
    // The grounding chunks usually correspond to the entities mentioned in the text.
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Parse the text response
    const lines = text.split('\n').filter(line => line.includes('|'));
    
    const restaurants: Restaurant[] = lines.slice(0, 5).map((line, index) => {
      const parts = line.split('|').map(s => s.trim());
      // Fallback parsing
      const name = parts[0]?.replace(/^\d+\.\s*/, '').replace(/\*/g, '') || "未知餐廳";
      const cuisine = parts[1] || "美食";
      const priceLevel = parts[2] || "$";
      const rating = parts[3] || "N/A";
      const description = parts[4] || "暫無描述。";

      // Try to find a matching grounding chunk for the map Link
      // We search for the restaurant name in the chunk title
      const matchedChunk = chunks.find(c => 
        c.web?.title?.toLowerCase().includes(name.toLowerCase()) || 
        c.maps?.title?.toLowerCase().includes(name.toLowerCase())
      );

      let mapUri = "";
      if (matchedChunk) {
        if (matchedChunk.maps?.uri) mapUri = matchedChunk.maps.uri;
        else if (matchedChunk.web?.uri) mapUri = matchedChunk.web.uri;
      }
      
      // Fallback Map URI if grounding fails
      if (!mapUri) {
        mapUri = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + location.lat + "," + location.lng)}`;
      }

      return {
        id: `rest-${index}-${Date.now()}`,
        name,
        cuisine,
        priceLevel,
        rating,
        description,
        mapUri
      };
    });

    return restaurants;

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};