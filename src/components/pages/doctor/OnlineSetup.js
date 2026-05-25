import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { createIndShedule, getIndShedule, deleteIndShedule } from '../../../api/DoctorCabinet';

const WEEKDAYS = [
    { id: 1, name: "Понедельник" }, { id: 2, name: "Вторник" }, { id: 3, name: "Среда" },
    { id: 4, name: "Четверг" }, { id: 5, name: "Пятница" }, { id: 6, name: "Суббота" }, { id: 0, name: "Воскресенье" },
];

export default function OnlineSetup() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);

    const [generalInfo, setGeneralInfo] = useState({
        price: 150,
        duration: 30,
        startDate: new Date().toISOString().split('T')[0],
        endDate: "2026-12-31"
    });

    const [selectedDays, setSelectedDays] = useState([]);

    useEffect(() => {
        if (user?.id) {
            loadCurrentSchedule();
        }
    }, [user]);

    const loadCurrentSchedule = async () => {
        try {
            const data = await getIndShedule(user.id);
            if (data) {
                setGeneralInfo({
                    price: data.price,
                    duration: data.duration,
                    startDate: data.startDate.split('T')[0],
                    endDate: data.endDate.split('T')[0]
                });
                setSelectedDays(data.days || []);
                setIsEdit(true);
            }
        } catch (e) {
            console.log("No existing schedule found");
        } finally {
            setLoading(false);
        }
    };

    const toggleDay = (dayId) => {
        if (selectedDays.find(d => d.weekDay === dayId)) {
            setSelectedDays(selectedDays.filter(d => d.weekDay !== dayId));
        } else {
            setSelectedDays([...selectedDays, { weekDay: dayId, start: "09:00", end: "17:00" }]);
        }
    };

    const updateDayTime = (dayId, key, value) => {
        setSelectedDays(selectedDays.map(d => d.weekDay === dayId ? { ...d, [key]: value } : d));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (selectedDays.length === 0) return alert("Выберите хотя бы один рабочий день");
        setLoading(true);
        try {
            const payload = {
                id: Number(user.id),
                price: Number(generalInfo.price),
                duration: Number(generalInfo.duration),
                startDate: generalInfo.startDate,
                endDate: generalInfo.endDate,
                days: selectedDays
            };
            await createIndShedule(payload);
            alert("График сохранен!");
            navigate('/doctor/schedule');
        } catch (err) { alert(err.message); } finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if (!window.confirm("Полностью удалить онлайн-график?")) return;
        try {
            await deleteIndShedule(user.id);
            alert("График удален");
            navigate('/doctor/schedule');
        } catch (err) { alert(err.message); }
    };

    if (loading) return <div className="p-20 text-center font-bold">Загрузка настроек...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-6 border border-gray-100">
            <h1 className="text-2xl font-bold text-pistachio-dark mb-6">⚙️ Настройка онлайн-приема</h1>
            <form onSubmit={handleSave} className="space-y-8">
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl">
                    <div>
                        <label className="text-xs font-bold text-gray-400">Цена (смн)</label>
                        <input type="number" className="w-full p-2 border rounded mt-1" value={generalInfo.price} onChange={e => setGeneralInfo({...generalInfo, price: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400">Длительность (мин)</label>
                        <input type="number" className="w-full p-2 border rounded mt-1" value={generalInfo.duration} onChange={e => setGeneralInfo({...generalInfo, duration: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400">Начало</label>
                        <input type="date" className="w-full p-2 border rounded mt-1" value={generalInfo.startDate} onChange={e => setGeneralInfo({...generalInfo, startDate: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400">Конец</label>
                        <input type="date" className="w-full p-2 border rounded mt-1" value={generalInfo.endDate} onChange={e => setGeneralInfo({...generalInfo, endDate: e.target.value})} />
                    </div>
                </section>

                <section className="space-y-3">
                    {WEEKDAYS.map(day => {
                        const config = selectedDays.find(d => d.weekDay === day.id);
                        return (
                            <div key={day.id} className={`flex items-center justify-between p-3 border rounded-xl ${config ? "border-pistachio-light bg-pistachio-light/5" : "border-gray-100"}`}>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={!!config} onChange={() => toggleDay(day.id)} className="w-5 h-5 accent-pistachio-dark" />
                                    <span className={config ? "text-pistachio-dark font-bold" : "text-gray-400"}>{day.name}</span>
                                </label>
                                {config && (
                                    <div className="flex gap-2">
                                        <input type="time" value={config.start} onChange={e => updateDayTime(day.id, 'start', e.target.value)} className="p-1 border rounded" />
                                        <input type="time" value={config.end} onChange={e => updateDayTime(day.id, 'end', e.target.value)} className="p-1 border rounded" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>

                <div className="flex gap-4">
                    <button type="submit" className="flex-1 py-4 bg-pistachio-dark text-white font-bold rounded-2xl">Сохранить</button>
                    {isEdit && <button type="button" onClick={handleDelete} className="flex-1 py-4 border-2 border-red-500 text-red-500 font-bold rounded-2xl">Удалить график</button>}
                </div>
            </form>
        </div>
    );
}
