'use client';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";

export default function Home() {
  const [responce, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  async function handleSabmit() {
    if (name.length === 0) {
      alert("Введіть ваше ім'я");
      return;
    }

    setIsLoading(true);
    const time = new Date().toLocaleTimeString();
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, time: time }),
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
    <div>
      <Header></Header>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex flex-col max-w-[320px] mx-auto items-center justify-center flex-1 p-8 gap-5">
          <h1 className="text-2xl font-bold">Мій AI Стартап 🚀</h1>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введіть ваше ім'я"></Input>
          <Button size="lg" onClick={handleSabmit}>
            Почати зараз
          </Button>
          {isLoading ? <p>Завантаження...</p> : <p>{responce}</p>}
        </div>
      </div>

    </div>

  )
}