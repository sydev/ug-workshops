import { Message } from "@/types/message.type";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import z from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const messageSchema = z.object({
  content: z.string(),
  role: z.enum(["user", "assistant"]),
});

export const POST = async (request: Request) => {
  const body = (await request.json()) as { messages: Message[] };
  const { messages } = body;

  const resp = await openai.responses.create({
    model: "gpt-4o-mini",
    input: messages.map((m) => ({ role: m.role, content: m.content })),
    text: {
      format: zodTextFormat(messageSchema, "message"),
    },
    temperature: 0,
    top_p: 0,
  });

  const message: Message = {
    ...JSON.parse(resp.output_text),
    id: Date.now().toString(),
    timestamp: new Date(),
  };

  return new Response(JSON.stringify({ message }), {
    headers: { "content-type": "application/json" },
  });
};
