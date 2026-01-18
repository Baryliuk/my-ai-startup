import { Bot, webhookCallback } from "grammy";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

// Ініціалізація токенів
const token = process.env.TELEGRAM_BOT_TOKEN || "";
const geminiKey = process.env.GEMINI_API_KEY || "";
const adminId = process.env.ADMIN_ID || "";

const bot = new Bot(token);
const genAI = new GoogleGenerativeAI(geminiKey);

// --- НАЛАШТУВАННЯ БОТА ---
const KNOWLEDGE_BASE = `
КАТАЛОГ ТОВАРІВ МАГАЗИНУ:
1. Кросівки "Air Max" — Розміри: 40, 41, 42, 43, 44, 45. Ціна: 3000 грн. Наявність: В наявності.
2. Худі "Oversize" — Розміри: S, M, L. Колір: Чорний, Сірий. Ціна: 1200 грн. Наявність: Тільки розмір L.
3. Кепка "Classic" — Колір: Синій. Ціна: 500 грн. Наявність: Тимчасово відсутня.
`;

const SYSTEM_PROMPT = `
Ти — професійний AI-консультант компанії LeadMate. 
Твоє завдання: допомагати клієнтам, відповідаючи на питання про товари з каталогу.

ПРАВИЛА:
1. Використовуй ТІЛЬКИ дані з каталогу нижче.
2. Якщо товару немає в списку, ввічливо скажи, що зараз його немає.
3. Якщо клієнт запитує про розмір, наявність або ціну — давай чітку відповідь.
4. Якщо клієнт хоче замовити або купити — попроси його написати свій номер телефону, щоб менеджер зв'язався для оформлення.
5. Відповідай коротко і ввічливо.

${KNOWLEDGE_BASE}
`;

// --- ОБРОБКА ПОВІДОМЛЕНЬ ---
bot.on("message:text", async (ctx) => {
  try {
    const userMessage = ctx.message.text;
    const userId = ctx.from.id;
    const username = ctx.from.username || "Без юзернейму";

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `${SYSTEM_PROMPT}\n\nПитання клієнта: ${userMessage}`;

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const aiResponse = response.text();

    if (!aiResponse) {
      await ctx.reply(
        "Я не зміг знайти відповідь на це питання. Спробуйте ще раз.",
      );
      return;
    }

    await ctx.reply(aiResponse);

    const phoneRegex = /(?:\+?\d{1,3})?(?:[\s\-\(\)]?\d{2,4}){3,}/g;
    const hasPhone = phoneRegex.test(userMessage);

    if (
      hasPhone ||
      userMessage.toLowerCase().includes("замов") ||
      userMessage.toLowerCase().includes("купити")
    ) {
      const notification = `
      🔔 **Нова заявка!**
      👤 Від: @${username} (ID: ${userId})
      💬 Повідомлення: ${userMessage}
      `;

      // Надсилаємо сповіщення адміну
      if (adminId) {
        await bot.api.sendMessage(adminId, notification, {
          parse_mode: "Markdown",
        });
      }
    }
  } catch (error: any) {
    console.error("Повна помилка Gemini:", error);

    // Виводимо конкретну помилку в чат (тільки для тестування!)
    await ctx.reply(`Помилка: ${error.message}`);
  }
});

// --- ВЕБХУК ---
export async function POST(req: Request) {
  if (!token) return new Response("Telegram Token missing", { status: 500 });
  if (!geminiKey)
    return new Response("Gemini API Key missing", { status: 500 });

  try {
    return await webhookCallback(bot, "std/http")(req);
  } catch (e) {
    console.error("Webhook Error:", e);
    return new Response("Error", { status: 500 });
  }
}

export async function GET() {
  return new Response("Бот LeadMate онлайн і готовий до роботи!");
}
