import { Bot, webhookCallback } from "grammy";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

const token = process.env.TELEGRAM_BOT_TOKEN;
const apiKey = process.env.GEMINI_API_KEY;

if (!token) throw new Error("TELEGRAM_BOT_TOKEN is missing");
if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

const bot = new Bot(token);
const genAI = new GoogleGenerativeAI(apiKey);

bot.on("message:text", async (ctx) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Ти LeadMate. Відповідай коротко: ${ctx.message.text}`);
    await ctx.reply(result.response.text());
  } catch (error) {
    console.error("Error:", error);
  }
});

// Цей формат експорту є обов'язковим для Next.js 15/16
export async function POST(request: Request) {
  return await webhookCallback(bot, "std/http")(request);
}

// Додаємо GET, щоб ти міг ПЕРЕВІРИТИ посилання в браузері
export async function GET() {
  return new Response(JSON.stringify({ status: "Webhook is active" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}