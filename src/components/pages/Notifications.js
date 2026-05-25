import React, { useEffect, useState } from 'react';
import { fetchNotifications, markAsRead } from '../../api/notifications';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await fetchNotifications();
            setNotifications(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id, isRead) => {
        if (isRead === 1) return;
        try {
            await markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
            // Триггерим кастомное событие для обновления счетчика на хэдере
            window.dispatchEvent(new Event("notificationRead"));
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold">Загрузка уведомлений...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6 border border-gray-100">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">🔔 Центр уведомлений</h1>
            
            <div className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div 
                            key={n.id} 
                            onClick={() => handleRead(n.id, n.is_read)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                n.is_read === 0 
                                    ? "bg-pistachio-light/10 border-pistachio-light shadow-sm" 
                                    : "bg-gray-50 border-gray-100 opacity-70"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`font-bold ${n.is_read === 0 ? "text-pistachio-dark" : "text-gray-700"}`}>
                                    {n.Title || n.title}
                                </h3>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(n.created_at).toLocaleDateString()} {new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{n.Message || n.message}</p>
                        </div>
                    ))
                ) : (
					<div className="text-center py-20 text-gray-400">Уведомлений пока нет</div>
                )}
            </div>
        </div>
    );
}
