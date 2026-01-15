export default function Header() {
    return (
        <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    
    {/* Логотип */}
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="bg-emerald-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
        <span className="text-xl">🚀</span>
      </div>
      <h1 className="text-2xl font-black tracking-tight">
        LeadMate<span className="text-emerald-600">.ai</span>
      </h1>
    </div>

    {/* Навігація (для майбутнього) */}
    <nav className="hidden md:flex items-center gap-8">
      <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Як це працює</a>
      <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Тарифи</a>
      <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Підтримка</a>
    </nav>

    {/* Права частина: Статус та Кнопка */}
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-[12px] font-bold text-emerald-700 uppercase tracking-wider">System Online</span>
      </div>
      
      <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95">
        Увійти
      </button>
    </div>

  </div>
</header>
    )
}