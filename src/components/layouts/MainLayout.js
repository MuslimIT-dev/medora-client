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
        <div className="flex flex-col min-h-screen text-pistachio-dark text-lg p-2 sm:p-4 max-w-full overflow-x-hidden">
            {/* Адаптивная шапка: на мобильных в стек/ряд, на md: в сетку */}
            <header className="flex flex-col gap-3 md:grid md:grid-cols-5 md:gap-4 rounded-lg shadow-md p-4 shrink-0 sticky top-2 z-[100] bg-white">
                <div className="flex items-center justify-between md:col-span-1">
                    <Link to={roleKey === 'user' ? "/" : `/${roleKey}`} className="flex items-center font-bold break-all">
                        MEDORA {isPro && <span className="ml-2 text-[10px] bg-pistachio-light text-white px-2 py-0.5 rounded uppercase tracking-tighter">{roleKey}</span>}
                    </Link>
                    
                    {/* Кнопки уведомлений и профиля для мобильных (дублируются в разметке для сохранения порядка на десктопе) */}
                    <div className="flex items-center gap-4 md:hidden">
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
                </div>
                
                {/* Зона поиска занимает всю ширину на мобилках */}
                <div className="w-full md:col-span-3">
                    <SearchArea />
                </div>

                {/* Блок действий для десктопа (скрыт на мобильных) */}
                <div className="hidden md:col-span-1 md:flex justify-end gap-4 py-2">
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

            {/* Основной контент: на мобильных в одну колонку, на md: боковая панель + контент */}
            <section className="flex flex-col md:grid md:grid-cols-5 py-4 flex-1 gap-4">
                {/* Навигация: на мобильных горизонтальная прокрутка, на md: вертикальный сайдбар */}
                <aside className="w-full md:col-span-1 py-2 md:py-4 md:sticky md:top-28 h-fit overflow-x-auto md:overflow-x-visible">
                    <nav className="flex flex-row md:flex-col gap-2 md:gap-4 whitespace-nowrap md:whitespace-normal pb-2 md:pb-0">
                    {menuItems.map((item, index) => {
                        const active = item.link === "/" || item.link === "/doctor" 
                            ? location.pathname === item.link 
                            : location.pathname.startsWith(item.link);

                        return (
                            <div key={index} className="shrink-0 md:shrink">
                                <AsideBtn 
                                    BtnLink={item.link} 
                                    Name={item.name} 
                                    isActive={active} 
                                />
                            </div>
                        );
                    })}
                    </nav>
                </aside>
                
                {/* Основной контент динамически адаптируется под оставшуюся ширину экрана */}
                <main className="w-full md:col-span-4 py-2 md:py-4 px-2 md:px-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </section>
            
            <footer className="w-full rounded-lg shadow-md p-4 shrink-0 mt-auto text-center md:text-left">
                Made by MuhammadMustafa
            </footer>
        </div>
    );
}
