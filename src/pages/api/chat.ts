import type { APIRoute } from "astro";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,   // ← set this in .env
});

export const POST: APIRoute = async ({ request }) => {
  const { messages } = await request.json();   // [{role:"user",content:"…"}, …]

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",                      // pick your model
    messages,
  });

  return new Response(
    JSON.stringify(completion.choices[0].message),
    { headers: { "Content-Type": "application/json" } }
  );
};
