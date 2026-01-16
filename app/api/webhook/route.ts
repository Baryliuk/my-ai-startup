import { Bot, webhookCallback } from "grammy";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

const token = process.env.TELEGRAM_BOT_TOKEN || "";
const bot = new Bot(token);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

bot.on("message:text", async (ctx) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    const prompt = `Ти LeadMate. Клієнт: "${ctx.message.text}". Відповідай коротко.`;
    const result = await model.generateContent(prompt);
    await ctx.reply(result.response.text());
  } catch (error) {
    console.error("AI Error:", error);
  }
});

export async function POST(req: Request) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return new Response("No Token", { status: 500 });
  return await webhookCallback(bot, "std/http")(req);
}

export async function GET() {
  return new Response("Бот активний", { status: 200 });
}