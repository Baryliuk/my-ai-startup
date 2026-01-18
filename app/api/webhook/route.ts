import { Bot, webhookCallback } from "grammy";

export const dynamic = "force-dynamic";

const token = process.env.TELEGRAM_BOT_TOKEN || "";
const geminiKey = process.env.GEMINI_API_KEY || "";
const adminId = Number(process.env.ADMIN_ID);
const sheetUrl = process.env.GOOGLE_SHEET_URL || "";

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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

    const aiRequest = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nПитання клієнта: ${userMessage}` }] }],
      }),
    });

    const data = await aiRequest.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Помилка відповіді.";

    // 1. Відповідь клієнту
    await ctx.reply(aiResponse);

    // 2. ЗАПИС В GOOGLE ТАБЛИЦЮ (ІСТОРІЯ)
    if (sheetUrl) {
      fetch(sheetUrl, {
        method: "POST",
        body: JSON.stringify({
          userId,
          username,
          message: userMessage,
          aiResponse
        }),
      }).catch(e => console.error("Sheet error:", e));
    }

    // 3. СПОВІЩЕННЯ АДМІНУ (ЗАМОВЛЕННЯ)
    const phoneRegex = /(?:\+?\d{1,3})?(?:[\s\-\(\)]?\d{2,4}){3,}/g;
    if ((phoneRegex.test(userMessage) || userMessage.toLowerCase().includes("замов")) && adminId) {
      const notification = `🚀 **НОВА ЗАЯВКА!**\n\n👤 Клієнт: @${username}\n🆔 ID: ${userId}\n💬 Текст: ${userMessage}`;
      await bot.api.sendMessage(adminId, notification, { parse_mode: "Markdown" });
    }

  } catch (error: any) {
    console.error(error);
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