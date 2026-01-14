'use client';
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState(""); 
  function validator() {
    if (name.length === 0) {
      alert("Введіть ваше ім'я");
      return false;
    }
    alert(`Привіт, ${name}!`)
  }
  return (
    <div>
      <Header></Header>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="centered-content flex flex-col items-center justify-center flex-1 p-8 gap-5">
          <h1 className="text-2xl font-bold">Мій AI Стартап 🚀</h1>
         <input  type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введіть ваше ім'я"></input>
          <Button size="lg" onClick={validator}>
            Почати зараз
          </Button>
        </div>
      </div>

    </div>

  )
}