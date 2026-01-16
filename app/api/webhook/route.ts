import { Bot, webhookCallback } from "grammy";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. ПРИМУСОВИЙ ДИНАМІЧНИЙ РЕЖИМ (важливо для Vercel)
export const dynamic = 'force-dynamic';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is unset");

const bot = new Bot(token);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

bot.on("message:text", async (ctx) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Ти — LeadMate, AI-менеджер. Клієнт пише: "${ctx.message.text}". 
    Відповідай коротко, ввічливо, українською мовою.`;

    const result = await model.generateContent(prompt);
    await ctx.reply(result.response.text());
  } catch (error) {
    console.error("AI Error:", error);
    // Не відповідаємо помилкою в Telegram, щоб не зациклити бота
  }
});

// 2. ЯВНО ЕКСПОРТУЄМО POST
export const POST = async (req: Request) => {
  return await webhookCallback(bot, "std/http")(req);
};

// Додамо GET на випадок, якщо ти захочеш перевірити посилання в браузері
export const GET = async () => {
  return new Response("Бот працює! Надсилай POST запити від Telegram.");
};