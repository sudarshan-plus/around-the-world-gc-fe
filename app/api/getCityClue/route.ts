import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store securely in .env.local
});

export async function GET() {
  try {
    const prompt = `
      Pick a random city from any part of the world and generate a clue for it.
      Format the response as JSON: {"clue": "Clue text here", "answer": "City name here"}.
      Example:
      {"clue": "This city has a famous opera house shaped like sails.", "answer": "Sydney"}
      Generate a new clue:
    `;

    const response: any = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 50,
    });

    const result = JSON.parse(response.choices[0].message.content.trim());

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: "Failed to generate city clue" }, { status: 500 });
  }
}
