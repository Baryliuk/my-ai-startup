import { Bot, webhookCallback } from "grammy";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

// Створюємо бота поза межами функцій
const token = process.env.TELEGRAM_BOT_TOKEN || "";
const bot = new Bot(token);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

bot.on("message:text", async (ctx) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Ти LeadMate. Клієнт пише: "${ctx.message.text}". Відповідай коротко.`;
    const result = await model.generateContent(prompt);
    await ctx.reply(result.response.text());
  } catch (e) {
    console.error(e);
  }
});

// Чітко визначені експорти для Next.js App Router
export async function POST(req: Request) {
  return await webhookCallback(bot, "std/http")(req);
}

export async function GET() {
  return new Response("Webhook is active and waiting for POST");
}