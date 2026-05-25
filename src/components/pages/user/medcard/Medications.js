import React from 'react';
import List from '../../../widgets/List.js';
import { getMedcardData } from '../../../../api/medcard.js';
import { API } from '../../../../constants/API.js';

export default function Medications() {
    const handleStartCourse = async (itemId) => {
        try {
            const res = await fetch(`${API}/medcard/medications/${itemId}/start`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        
            const result = await res.json();
            if (!res.ok) {
                alert(result.error || "Не удалось активировать курс");
                return;
            }
        
            alert("График построен успешно!");
            window.location.reload();
        } catch (e) { alert(e.message); }
    };

    const translateInterval = (type, count) => {
        if (type === 'day') return `${count > 1 ? count + ' раза' : '1 раз'} в день`;
        if (type === 'week') return "1 раз в неделю";
        if (type === 'month') return "1 раз в месяц";
        if (type === 'year') return "1 раз в год";
        return "По инструкции";
    };

    const MedicationCardCustom = ({ Data }) => {
        return (
            <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-800">💊 {Data.title}</h3>
                        <span className="bg-pistachio-light/10 text-pistachio-dark text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                            {Data.dosage || "1 таб."}
                        </span>
                    </div>

                    <p className="text-xs text-gray-500 font-medium">
                        ⏱️ График: <span className="text-gray-700">{translateInterval(Data.interval_type, Data.frequency_count)}</span> 
                        {Data.time_hours && ` в [ ${Data.time_hours} ]`} — курс {Data.duration_days || 7} дней.
                    </p>

                    <p className="text-gray-600 text-sm">{Data.description}</p>
                </div>
                
                <button 
                    onClick={() => handleStartCourse(Data.id)}
                    className="w-full md:w-auto px-4 py-2.5 bg-pistachio-light text-white font-bold rounded-xl text-xs hover:bg-pistachio-dark transition shadow-sm shrink-0"
                >
                    ▶ Активировать курс
                </button>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">💊 Назначенные лекарства</h1>
            <List 
                getList={(page, count) => getMedcardData('medications', page, count)} 
                Card={MedicationCardCustom} 
                filters={{}} 
            />
        </div>
    );
}
