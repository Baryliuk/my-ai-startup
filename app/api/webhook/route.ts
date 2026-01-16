import { Bot, webhookCallback } from "grammy";

export const dynamic = 'force-dynamic';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is unset");
}

const bot = new Bot(token);

bot.on("message", async (ctx) => {
  await ctx.reply("Привіт! Я отримав твоє повідомлення.");
});

// Використовуємо стандартний експорт для App Router
export async function POST(req: Request) {
  return await webhookCallback(bot, "std/http")(req);
}

export async function GET() {
  return new Response("Webhook is alive!");
}