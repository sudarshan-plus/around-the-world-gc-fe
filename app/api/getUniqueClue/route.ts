import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store securely in .env.local
});

export async function GET(req: any) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
  
    let selectedCity = city;
  
    // if (!selectedCity) {
    //   // If no city is provided, generate a new one
    //   const cities = ["Paris", "Tokyo", "New York", "London", "Cairo"];
    //   selectedCity = cities[Math.floor(Math.random() * cities.length)];
    // }
  
    // Generate a clue using OpenAI
    const prompt = `Provide a unique clue for the city: ${selectedCity}`;
    
    try {
      const completion: any = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: prompt }],
      });
  
      const clue = completion.choices[0].message.content.trim();
  
      return Response.json({ city: selectedCity, clue });
    } catch (error) {
      return Response.json({ error: "Failed to generate clue" }, { status: 500 });
    }
  }