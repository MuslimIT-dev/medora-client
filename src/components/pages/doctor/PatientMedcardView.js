import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPatientMedcardForDoctor } from '../../../api/DoctorCabinet';
import DocProtocolForm from '../../widgets/DocProtocolForm';
import { API } from '../../../constants/API';

const TABS = [
    { id: 'diagnoses', name: "🧬 Диагнозы", color: "border-blue-500 text-blue-600" },
    { id: 'analyses', name: "🧪 Анализы", color: "border-red-500 text-red-600" },
    { id: 'medications', name: "💊 Лекарства", color: "border-purple-500 text-purple-600" },
    { id: 'visits', name: "📅 Визиты", color: "border-amber-500 text-amber-600" },
    { id: 'documents', name: "📄 Документы", color: "border-indigo-500 text-indigo-600" },
    { id: 'allergies', name: "🌿 Аллергии", color: "border-green-500 text-green-600" }
];

export default function PatientMedcardView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('diagnoses');
    const [medcard, setMedcard] = useState(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({ diseases: [], medications: [], directions: [] });

    useEffect(() => {
        if (id) {
            loadPatientData();
        }
    }, [id]);

    const loadPatientData = async () => {
        try {
            const data = await fetchPatientMedcardForDoctor(id);
            setMedcard(data);
        } catch (e) {
            console.error(e);
            alert("Ошибка при загрузке данных пациента");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteOfflineVisit = async (e) => {
        e.preventDefault();
        
        const todayApt = medcard?.visits?.find(v => v.status?.toLowerCase() === "active");
        const aptId = todayApt ? todayApt.id : 1; 

        try {
            const res = await fetch(`${API}/cabinet/doctor/appointments/${aptId}/complete`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    ...form,
                    diseases: form.diseases.map(d => d.id)
                })
            });

            const result = await res.json();

            if (res.ok) {
                alert("Офлайн-прием успешно завершен! Медкарта обновлена.");
                setIsFormOpen(false);
                loadPatientData(); 
            } else {
                alert(`Ошибка: ${result.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("Ошибка сети при сохранении протокола.");
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-pistachio-dark">Загрузка медицинской карты...</div>;
    if (!medcard) return <div className="p-10 text-center text-gray-500">Пациент не найден</div>;

    const { patient_info, diagnoses, analyses, medications, visits, documents, allergies } = medcard;

    const getAge = (birthDateStr) => {
        if (!birthDateStr || birthDateStr === '—') return '—';
        const birth = new Date(birthDateStr);
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} лет`;
    };

    const renderTabContent = () => {
        const dataMap = { diagnoses, analyses, medications, visits, documents, allergies };
        const currentItems = dataMap[activeTab] || [];

        if (currentItems.length === 0) {
            return <div className="text-center py-10 text-gray-400 italic">Нет записей в данном разделе</div>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                {currentItems.map((item) => {
                    if (activeTab === 'analyses') {
                        const isHigh = item.status === 'high';
                        const isLow = item.status === 'low';
                        return (
                            <div key={item.id} className={`p-4 rounded-xl border bg-white shadow-sm flex justify-between items-center ${isHigh ? 'border-red-200 bg-red-50/20' : isLow ? 'border-blue-200 bg-blue-50/20' : 'border-gray-100'}`}>
                                <div>
                                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className={`text-xl font-bold ${isHigh ? 'text-red-600' : isLow ? 'text-blue-600' : 'text-gray-900'}`}>
                                            {item.value}
                                        </span>
                                        <span className="text-xs text-gray-400">(Реф: {item.min} - {item.max})</span>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${isHigh ? 'bg-red-100 text-red-700' : isLow ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                    {isHigh ? 'Высокий' : isLow ? 'Низкий' : 'Норма'}
                                </span>
                            </div>
                        );
                    }

                    if (activeTab === 'documents') {
                        const fileUrl = `http://10.192.6.193:8080${item.description}`;
                        return (
                            <a 
                                key={item.id} href={fileUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                                className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center hover:border-pistachio-light hover:bg-white transition shadow-sm no-underline text-current"
                            >
                                <div>
                                    <h4 className="font-semibold text-gray-800">📄 {item.title}</h4>
                                    <span className="text-xs text-gray-400">📅 {new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <span className="text-xs bg-pistachio-light text-white font-bold px-3 py-1 rounded-lg">Открыть 📥</span>
                            </a>
                        );
                    }

                    return (
                        <div key={item.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl shadow-sm flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-gray-800 text-base">{item.title}</h4>
                                <span className="text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-100">
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex gap-4 max-w-7xl mx-auto relative text-sm items-start">
            <div className="flex-1 flex flex-col gap-6">
                <button 
                    onClick={() => navigate('/doctor/patients')}
                    className="w-fit text-xs font-bold text-gray-400 hover:text-pistachio-dark flex items-center gap-1 transition"
                >
                    ← Вернуться к списку пациентов
                </button>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between gap-4 items-center">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            👤 {patient_info.fullname}
                            <span className="text-xs bg-pistachio-light/10 text-pistachio-dark font-bold px-2 py-0.5 rounded-md">
                                {getAge(patient_info.birth_date)}
                            </span>
                        </h1>
                        <p className="text-xs text-gray-500">
                            Пол: <strong className="text-gray-700">{patient_info.gender === 'male' ? 'Мужской' : 'Женский'}</strong> | 
                            Рождение: <strong className="text-gray-700">{patient_info.birth_date !== '—' ? new Date(patient_info.birth_date).toLocaleDateString() : '—'}</strong>
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <div className="text-left md:text-right bg-gray-50 p-3 rounded-xl border md:min-w-[180px] flex flex-col justify-center">
                            <span className="text-[10px] text-gray-400 block">Контактный телефон</span>
                            <strong className="text-gray-700 text-xs">{patient_info.phone}</strong>
                        </div>
                        <button 
                            onClick={() => setIsFormOpen(true)}
                            className="px-4 py-3 bg-pistachio-dark text-white font-bold rounded-xl text-xs hover:bg-pistachio-light transition shadow-md whitespace-nowrap h-fit"
                        >
                            ➕ Начать очный осмотр
                        </button>
                    </div>
                </div>

                <div className="flex border-b border-gray-200 overflow-x-auto gap-2 scrollbar-none shrink-0">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2.5 px-4 font-bold text-sm whitespace-nowrap border-b-2 transition-all ${
                                activeTab === tab.id ? `${tab.color} border-current` : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
                    <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide mb-4">
                        {TABS.find(t => t.id === activeTab)?.name} пациента
                    </h2>
                    {renderTabContent()}
                </div>
            </div>

            {isFormOpen && (
                <div className="sticky top-5 h-[85vh] animate-slideLeft shrink-0">
                    <DocProtocolForm 
                        form={form} 
                        setForm={setForm} 
                        onClose={() => setIsFormOpen(false)} 
                        onSubmit={handleCompleteOfflineVisit} 
                    />
                </div>
            )}
        </div>
    );
}
