import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, userMessage } = body;

    // ВИКОРИСТОВУЄМО ТУ САМУ НАЗВУ З ТЕРМІНАЛУ:
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Ти — професійний менеджер з продажів для онлайн-школи програмування. 
Твоя мета: ввічливо відповісти на питання клієнта та переконати його залишити свій телефон для безкоштовної консультації.

Дані про школу:
- Курс: "Full-stack розробник з нуля".
- Ціна: 1500$.
- Тривалість: 6 місяців.

Контекст розмови: Клієнт на ім'я ${name} запитує: "${userMessage}".

Відповідай коротко, в стилі месенджерів (без довгих абзаців), використовуй емодзі, але будь професійним. 
Якщо клієнт вагається, нагадай про можливість розтермінування. 
В кінці кожного повідомлення обов'язково став відкрите запитання.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Помилка:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}