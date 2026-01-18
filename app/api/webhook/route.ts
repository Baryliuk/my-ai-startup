import { Bot, webhookCallback } from "grammy";

export const dynamic = "force-dynamic";

// Ініціалізація змінних
const token = process.env.TELEGRAM_BOT_TOKEN || "";
const geminiKey = process.env.GEMINI_API_KEY || "";
// Перетворюємо adminId у число для надійності
const adminId = Number(process.env.ADMIN_ID);

const bot = new Bot(token);

// --- БАЗА ЗНАНЬ ---
const KNOWLEDGE_BASE = `
КАТАЛОГ ТОВАРІВ МАГАЗИНУ:
1. Кросівки "Air Max" — Розміри: 40, 41, 42, 43, 44, 45. Ціна: 3000 грн. Наявність: В наявності.
2. Худі "Oversize" — Розміри: S, M, L. Колір: Чорний, Сірий. Ціна: 1200 грн. Наявність: Тільки розмір L.
3. Кепка "Classic" — Колір: Синій. Ціна: 500 грн. Наявність: Тимчасово відсутня.
`;

const SYSTEM_PROMPT = `
Ти — професійний AI-консультант компанії LeadMate. 
Використовуй ТІЛЬКИ дані з каталогу нижче. Якщо клієнт хоче замовити — запитай номер телефону.
Відповідай коротко і ввічливо.

${KNOWLEDGE_BASE}
`;

bot.on("message:text", async (ctx) => {
  try {
    const userMessage = ctx.message.text;
    const userId = ctx.from.id;
    const username = ctx.from.username || "Без юзернейму";

    // Запит до Gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

    const aiRequest = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nПитання клієнта: ${userMessage}` }] }],
      }),
    });

    const data = await aiRequest.json();
    if (!aiRequest.ok) throw new Error(data.error?.message || "Google API Error");

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Вибачте, я не можу зараз відповісти.";

    // 1. Відповідь КЛІЄНТУ
    await ctx.reply(aiResponse);

    // 2. ЛОГІКА ДЛЯ МЕНЕДЖЕРА
    const phoneRegex = /(?:\+?\d{1,3})?(?:[\s\-\(\)]?\d{2,4}){3,}/g;
    const hasPhone = phoneRegex.test(userMessage);
    const isOrder = userMessage.toLowerCase().includes("замов") || userMessage.toLowerCase().includes("купити");

    // Перевіряємо, чи є адмін і чи це НЕ сам адмін пише боту (щоб не було дублів при тестах)
    if ((hasPhone || isOrder) && adminId) {
      const notification = `🚀 **НОВЕ ЗАМОВЛЕННЯ!**\n\n👤 Клієнт: @${username}\n🆔 ID: ${userId}\n💬 Текст: ${userMessage}`;
      
      // Надсилаємо в окремий чат адміну
      await bot.api.sendMessage(adminId, notification, { parse_mode: "Markdown" });
    }

  } catch (error: any) {
    console.error("Помилка:", error);
    // Якщо помилка квоти, відповідаємо спокійніше
    if (error.message.includes("quota")) {
        await ctx.reply("Дякую! Менеджер отримав ваше повідомлення і скоро зв'яжеться з вами.");
    } else {
        await ctx.reply(`Тимчасова помилка: ${error.message}`);
    }
  }
});

export async function POST(req: Request) {
  if (!token) return new Response("Token missing", { status: 500 });
  try {
    return await webhookCallback(bot, "std/http")(req);
  } catch (e) {
    return new Response("Error", { status: 500 });
  }
}

export async function GET() {
  return new Response("LeadMate Bot is Active");
}