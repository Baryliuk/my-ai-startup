import { Bot, webhookCallback } from "grammy";

export const dynamic = 'force-dynamic';

const token = process.env.TELEGRAM_BOT_TOKEN || "";
const bot = new Bot(token);

// Тимчасово прибираємо Gemini, щоб перевірити тільки Telegram
bot.on("message", async (ctx) => {
  await ctx.reply("Я працюю! Зв'язок із сервером є. Зараз підключимо мізки (AI).");
});

export async function POST(req: Request) {
  if (!token) return new Response("Token missing", { status: 500 });
  return await webhookCallback(bot, "std/http")(req);
}

export async function GET() {
  return new Response("Бот онлайн");
}