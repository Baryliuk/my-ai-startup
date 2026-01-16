export const dynamic = 'force-dynamic';
import { Bot, webhookCallback } from "grammy";
import { GoogleGenerativeAI } from "@google/generative-ai";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is unset");
const bot = new Bot(token);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Логіка відповіді бота
bot.on("message:text", async (ctx) => {
  const userText = ctx.message.text;
  const userName = ctx.from?.first_name || "клієнт";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Промпт, як ми домовлялися для LeadMate
    const prompt = `Ти — LeadMate, AI-менеджер. Клієнт ${userName} пише: "${userText}". 
    Відповідай коротко, ввічливо, українською мовою. Твоя мета — допомогти бізнесу закрити угоду.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    await ctx.reply(response.text());
  } catch (error) {
    console.error("AI Error:", error);
    await ctx.reply("Вибачте, я зараз на перерві. Спробуйте пізніше!");
  }
});

export const POST = webhookCallback(bot, "std/http");
