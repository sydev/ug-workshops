import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { maxTokens, prompt, seed, temperature, topP } = await req.json();

  const options: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
    {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a concise assistant for developers.",
        },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: maxTokens || 200,
      temperature: temperature || 0.7,
      top_p: topP || 0.9,
    };

  if (seed) options.seed = seed;

  try {
    const res = await openai.chat.completions.create(options);

    return Response.json({ text: res.choices[0].message.content });
  } catch (error) {
    console.error("Error generating text:", error);
    return Response.json(
      { error: "Fehler beim Generieren der Antwort" },
      { status: 500 }
    );
  }
}
