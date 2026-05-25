import React, { useEffect, useState } from 'react';
import { API } from '../../constants/API';

export default function TodayMedicationsWidget() {
    const [meds, setMeds] = useState([]);

    useEffect(() => {
        fetch(`${API}/medcard/medications/today`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(res => setMeds(res.data || []));
    }, []);

    const handleToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        try {
            await fetch(`${API}/medcard/medications/today/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ taken: newStatus })
            });
            setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: newStatus } : m));
        } catch (e) { console.error(e); }
    };

    return (
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 mt-4">
            <h2 className="text-lg font-bold mb-4 text-gray-800">💊 Прием лекарств на сегодня</h2>
            {meds.length > 0 ? (
                <div className="space-y-3">
                    {meds.map(med => (
                        <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border">
                            <div>
                                <span className="text-xs text-gray-400 block">⏰ {med.time}</span>
                                <span className={`font-semibold text-sm ${med.taken === 1 ? "line-through text-gray-400" : "text-gray-700"}`}>
                                    {med.name} ({med.dosage})
                                </span>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={med.taken === 1} 
                                onChange={() => handleToggle(med.id, med.taken)}
                                className="w-5 h-5 accent-pistachio-dark cursor-pointer" 
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 italic text-center py-4">Нет запланированных лекарств на сегодня. Активируйте курс в Медкарте.</p>
            )}
        </div>
    );
}
