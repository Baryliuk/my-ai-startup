import { Bot, webhookCallback } from "grammy";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

// Не викидаємо помилку одразу, щоб не "валити" збірку Vercel
const token = process.env.TELEGRAM_BOT_TOKEN || "";
const bot = new Bot(token);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

bot.on("message:text", async (ctx) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Ти LeadMate. Відповідай коротко: ${ctx.message.text}`);
    await ctx.reply(result.response.text());
  } catch (e) {
    console.error("AI Error:", e);
  }
});

// Використовуємо чіткий async function — це стандарт для App Router
export async function POST(req: Request) {
  if (!token) return new Response("Token missing", { status: 500 });
  return await webhookCallback(bot, "std/http")(req);
}

export async function GET() {
  return new Response("Бот працює!");
}