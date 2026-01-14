export default function Sidebar() {
    return (
        <div className=" h-[calc(100vh-68px)] left-0 top-0 w-64 bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold mb-4">Бічна Панель</h2>
            <ul>
                <li className="mb-2"><a href="#" className="hover:underline">Головна</a></li>
                <li className="mb-2"><a href="#" className="hover:underline">Про Нас</a></li>
                <li className="mb-2"><a href="#" className="hover:underline">Послуги</a></li>
                <li className="mb-2"><a href="#" className="hover:underline">Контакти</a></li>
            </ul>
        </div>
    )
}