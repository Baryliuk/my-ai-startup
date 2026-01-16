import { Bot, webhookCallback } from "grammy";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

// Створюємо функцію-ініціалізатор, щоб не валити збірку Next.js
const initBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!token || !apiKey) {
    // Під час збірки просто повертаємо null, не викидаючи помилку
    return null;
  }

  const bot = new Bot(token);
  const genAI = new GoogleGenerativeAI(apiKey);

  bot.on("message:text", async (ctx) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Ти LeadMate. Відповідай коротко: ${ctx.message.text}`);
      await ctx.reply(result.response.text());
    } catch (e) {
      console.error("Gemini Error:", e);
    }
  });

  return bot;
};

export async function POST(req: Request) {
  const bot = initBot();
  if (!bot) return new Response("Bot initialization failed", { status: 500 });
  
  // Обробка запиту від Telegram
  return await webhookCallback(bot, "std/http")(req);
}

export async function GET() {
  return new Response("Webhook is ready!");
}