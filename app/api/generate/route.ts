import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;
    const {time} = body;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ 
      text: `Сервер отримав ім'я: ${name} і час: ${time}. Зв'язок встановлено успішно!` 
    });
  } catch (error) {
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}