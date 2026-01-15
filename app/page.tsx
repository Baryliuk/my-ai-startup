'use client';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { useState } from "react";

export default function Home() {
  const [responce, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [userMessage, setUserMessage] = useState("")

  async function handleSabmit() {
    if (name.length === 0) {
      alert("Введіть ваше ім'я");
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, userMessage }),
      });

      const data = await res.json();
      setResponse(data.text);
    } catch (error) {
      console.error("Помилка:", error);
    } finally {
      setIsLoading(false);
    }
  }



  return (
  <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
  <Header />
  
  <main className="max-w-4xl mx-auto px-4 py-16">
    {/* Заголовок секції */}
    <div className="text-center mb-10">
      <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
        Керуй лідами з <span className="text-emerald-600">LeadMate</span>
      </h2>
      <p className="text-slate-500 text-lg">Введіть дані клієнта, щоб згенерувати ідеальну відповідь</p>
    </div>

    {/* Основна картка */}
    <div className="bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-emerald-100/50">
      
      {/* Ліва частина: Форма введення */}
      <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-slate-100">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Ім'я клієнта</label>
            <Input 
              className="bg-slate-50 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Наприклад: Олександр"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Запит від клієнта</label>
            <textarea 
              className="w-full min-h-[150px] p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm resize-none" 
              value={userMessage} 
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Скопіюйте сюди повідомлення з месенджера..."
            />
          </div>

          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-emerald-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleSabmit}
            disabled={isLoading}
          >
            {isLoading ? "LeadMate думає..." : "Згенерувати відповідь"}
          </Button>
        </div>
      </div>

      {/* Права частина: Результат */}
      <div className="flex-1 bg-slate-50/50 p-8 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Результат генерації</h3>
          {responce && (
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase font-bold tracking-wider">
              AI Ready
            </span>
          )}
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-inner relative min-h-[200px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="text-slate-400 text-sm italic">Аналізую запит...</p>
            </div>
          ) : responce ? (
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {responce}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-300 text-center italic">
              Тут з'явиться відповідь, яка допоможе вам закрити угоду
            </div>
          )}
        </div>
      </div>
    </div>
  </main>
</div>
  )
}