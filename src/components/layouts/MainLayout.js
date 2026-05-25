import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AsideBtn from '../UI/AsideBtn.js';
import SearchArea from '../UI/SearchArea.js';
import ProfileActions from './ProfileActions.js';
import { useAuth } from '../../context/AuthContext';
import { fetchNotifications } from '../../api/notifications';

const MENU_CONFIG = {
    user: [
        { link: "/", name: "🏠 Главная" },
        { link: "/appointment", name: "📅 Запись" },
        { link: "/medcard", name: "📋 Медкарта" },
        { link: "/chats", name: "💬 Чаты" },
        { link: "/AI", name: "🤖 ИИ Ассистент" },
    ],
    doctor: [
        { link: "/doctor", name: "🏠 Главная" },
        { link: "/doctor/patients", name: "👥 Мои пациенты" },
        { link: "/doctor/schedule", name: "📅 График" },
        { link: "/doctor/chats", name: "💬 Чаты" },
        { link: "/doctor/AI", name: "🤖 ИИ Ассистент" },
    ],
    director: [
        { link: "/director", name: "🏠 Дашборд" },
        { link: "/director/branches", name: "🏢 Филиалы" },
        { link: "/director/staff", name: "👨‍⚕️ Персонал" },
    ],
    admin: [
        { link: "/admin", name: "🏠 Филиал" },
        { link: "/admin/queue", name: "🚶 Очередь" },
    ]
};

export default function MainLayout() {
    const { currentRole, user } = useAuth();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);

    const roleKey = currentRole?.toLowerCase() || 'user';
    const menuItems = MENU_CONFIG[roleKey] || MENU_CONFIG.user;
    const isPro = roleKey !== 'user';

    const updateCount = async () => {
        if (!user?.id) return;
        try {
            const data = await fetchNotifications();
            const unread = data.filter(n => n.is_read === 0).length;
            setUnreadCount(unread);
        } catch (e) {
            console.error("Ошибка обновления счетчика уведомлений:", e);
        }
    };

    useEffect(() => {
        updateCount();

        window.addEventListener("notificationRead", updateCount);

        const interval = setInterval(updateCount, 30000);

        return () => {
            window.removeEventListener("notificationRead", updateCount);
            clearInterval(interval);
        };
    }, [user?.id]);

    return (
        <div className="flex flex-col min-h-screen text-pistachio-dark text-lg p-4">
            <header className="grid grid-cols-5 gap-4 rounded-lg shadow-md p-4 shrink-0 sticky top-4 z-[100] bg-white">
                <Link to={roleKey === 'user' ? "/" : `/${roleKey}`} className="flex items-center font-bold col-span-1">
                    MEDORA {isPro && <span className="ml-2 text-[10px] bg-pistachio-light text-white px-2 py-0.5 rounded uppercase tracking-tighter">{roleKey}</span>}
                </Link>
                
                <SearchArea />

                <div className="col-span-1 flex justify-end gap-4 py-2">
                    <Link to={roleKey === 'user' ? "/notifications" : `/${roleKey}/notifications`} className="relative flex items-center justify-center">
                        <button className="text-xl hover:scale-110 transition-transform">{"\u{1F514}"}</button>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </Link>
                    
                    <div className="group relative cursor-pointer px-2 flex items-center">
                        {"\u{1F464}"}
                        <div className="hidden group-hover:block transition-all">
                            <ProfileActions />
                        </div>
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-5 py-4 flex-1">
                <aside className="col-span-1 py-4 sticky top-24 h-fit">
                    <nav className="flex flex-col gap-4">
                    {menuItems.map((item, index) => {
                        const active = item.link === "/" || item.link === "/doctor" 
                            ? location.pathname === item.link 
                            : location.pathname.startsWith(item.link);

                        return (
                            <AsideBtn 
                                key={index} 
                                BtnLink={item.link} 
                                Name={item.name} 
                                isActive={active} 
                            />
                        );
                    })}
                    </nav>
                </aside>
                <main className="col-span-4 py-4 px-6">
                    <Outlet />
                </main>
            </section>
            
            <footer className="w-full rounded-lg shadow-md p-4 shrink-0 mt-auto">
                Made by MuhammadMustafa
            </footer>
        </div>
    );
}
