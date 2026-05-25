import React, { useEffect, useState } from 'react';
import { getMedcardData, getAnalysisHistory } from '../../../../api/medcard.js';

const CATEGORIES = [
    { id: 'blood', name: "🩸 Кровь (Blood)", desc: "Атомарные показатели состава крови" },
    { id: 'urine', name: "🧪 Моча (Urine)", desc: "Физико-химические показатели" },
    { id: 'cardio', name: "🫀 Сердце и пульс (Cardio)", desc: "Давление и ЧСС в покое" },
    { id: 'body', name: "⚖️ Показатели тела (Body)", desc: "Индекс массы тела и антропометрия" }
];

const STATUS_THEMES = {
    normal: "bg-green-100 text-green-700 border-green-200",
    high: "bg-red-100 text-red-700 border-red-200 animate-pulse",
    low: "bg-blue-100 text-blue-700 border-blue-200",
    no_data: "bg-gray-100 text-gray-400 border-gray-200 text-xs italic"
};

const STATUS_LABELS = {
    normal: "Норма",
    high: "Высокий",
    low: "Низкий",
    no_data: "No data"
};

export default function Analyses() {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHistory, setSelectedHistory] = useState(null);

    useEffect(() => {
        getMedcardData('analyses').then(res => {
            setAnalyses(res.data || []);
            setLoading(false);
        });
    }, []);

    const handleOpenHistory = async (typeId, name) => {
        const history = await getAnalysisHistory(typeId);
        setSelectedHistory({ name, list: history });
    };

    if (loading) return <div className="p-10 text-center font-bold text-pistachio-dark">Загрузка медицинских разделов...</div>;

    return (
        <div className="flex flex-col gap-6 relative pb-10">
            <h1 className="text-2xl font-bold text-gray-800">🧪 Анализы и биомаркеры</h1>

            <div className="space-y-6">
                {CATEGORIES.map(cat => {
                    const catItems = analyses.filter(item => item.category === cat.id);

                    return (
                        <section key={cat.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="mb-4 border-b pb-2">
                                <h2 className="text-lg font-bold text-gray-800">{cat.name}</h2>
                                <p className="text-xs text-gray-400">{cat.desc}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {catItems.map(item => {
                                    const hasData = item.status !== 'no_data';

                                    return (
                                        <div 
                                            key={item.id}
                                            title={hasData ? `Обновлено: ${item.date}` : "Нет замеров"}
                                            onClick={() => hasData && handleOpenHistory(item.id, item.title)}
                                            className={`p-4 rounded-xl border flex justify-between items-center transition ${
                                                hasData ? "bg-gray-50/50 hover:bg-gray-50 cursor-pointer border-gray-100 shadow-sm" : "bg-white border-dashed border-gray-200 opacity-60"
                                            }`}
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <span className={`text-xl font-bold ${hasData ? "text-gray-900" : "text-gray-300 text-sm font-normal"}`}>
                                                        {hasData ? item.result : "No data"}
                                                    </span>
                                                    {hasData && (
                                                        <span className="text-[10px] text-gray-400">
                                                            (Реф: {item.min} - {item.max})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${STATUS_THEMES[item.status]}`}>
                                                {STATUS_LABELS[item.status]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>

            {selectedHistory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative flex flex-col max-h-[80vh]">
                        <button onClick={() => setSelectedHistory(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
                        <h2 className="text-base font-bold mb-4 border-b pb-2 text-pistachio-dark">📊 Динамика изменений: {selectedHistory.name}</h2>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                            {selectedHistory.list.map((h, i) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100">
                                    <span className="text-base font-bold text-gray-900">{h.description}</span>
                                    <span className="text-xs text-gray-400">📅 {h.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
