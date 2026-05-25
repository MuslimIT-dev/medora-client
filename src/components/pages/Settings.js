import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDoctorProfile, updateDocProfile } from '../../api/DoctorCabinet';
import { getAllDiseases } from '../../api/Diseases';

export default function Settings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [allDiseases, setAllDiseases] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user?.id) loadData();
    }, [user]);

    const loadData = async () => {
        try {
            const [profData, diseaseList] = await Promise.all([
                getDoctorProfile(user.id),
                getAllDiseases()
            ]);

            if (profData) {
                const parsedDesc = profData.description ? JSON.parse(profData.description) : {
                    about: { title: "", text: "" },
                    education: [],
                    experience: [],
                    specializations: []
                };
                setProfile({ ...profData, fullDesc: parsedDesc });
            }
            setAllDiseases(diseaseList || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                userID: Number(user.id),
                stuff: profile.stuff,
                experience: Number(profile.experience),
                description: JSON.stringify(profile.fullDesc),
                phone: profile.phone,
                email: profile.email,
                image: profile.image || "",
                diseases: profile.diseases?.map(d => d.id) || []
            };

            await updateDocProfile(payload);
            alert("Данные сохранены!");
            setIsEditing(false);
            loadData();
        } catch (err) {
            alert("Ошибка: " + err.message);
        }
    };

    const updateDesc = (key, value) => {
        setProfile({ ...profile, fullDesc: { ...profile.fullDesc, about: { ...profile.fullDesc.about, [key]: value } } });
    };

    if (loading) return <div className="p-10 text-center font-bold text-pistachio-dark">Загрузка настроек...</div>;

    return (
        <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-6 border border-gray-100">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div className="flex items-center gap-4">
                    <img src={profile.image || "https://placeholder.com"} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-pistachio-light" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{profile.name || "Имя не указано"}</h1>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className={`px-6 py-2 rounded-xl font-bold transition ${isEditing ? "bg-gray-100 text-gray-600" : "bg-pistachio-light text-white"}`}>
                    {isEditing ? "Отмена" : "Редактировать"}
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <section>
                    <h3 className="font-bold text-lg mb-4 text-gray-700 border-l-4 border-pistachio-light pl-3">Личная информация</h3>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="text-xs text-gray-400 uppercase font-bold">Пол</label>
                            <p className="p-2 bg-gray-50 rounded mt-1">{profile.gender || "—"}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 uppercase font-bold">Дата рождения</label>
                            <p className="p-2 bg-gray-50 rounded mt-1">{profile.birthDate}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 uppercase font-bold">Телефон</label>
                            <input disabled={!isEditing} value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full p-2 border rounded mt-1 disabled:bg-gray-50" />
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="font-bold text-lg mb-4 text-gray-700 border-l-4 border-pistachio-light pl-3">Профессиональные данные</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-gray-400 uppercase font-bold">Специализация</label>
                            <input disabled={!isEditing} value={profile.stuff} onChange={e => setProfile({ ...profile, stuff: e.target.value })} className="w-full p-2 border rounded mt-1 disabled:bg-gray-50" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 uppercase font-bold">Стаж (лет)</label>
                            <input disabled={!isEditing} type="number" value={profile.experience} onChange={e => setProfile({ ...profile, experience: e.target.value })} className="w-full p-2 border rounded mt-1 disabled:bg-gray-50" />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-700 border-l-4 border-pistachio-light pl-3">Публичный профиль (Описание)</h3>
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold">Заголовок (Title)</label>
                        <input disabled={!isEditing} value={profile.fullDesc.about.title} onChange={e => updateDesc('title', e.target.value)} className="w-full p-2 border rounded mt-1 disabled:bg-gray-50" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold">Текст "О себе"</label>
                        <textarea disabled={!isEditing} value={profile.fullDesc.about.text} onChange={e => updateDesc('text', e.target.value)} className="w-full p-2 border rounded mt-1 h-32 disabled:bg-gray-50" />
                    </div>
                </section>

                <section>
                    <h3 className="font-bold text-lg mb-4 text-gray-700 border-l-4 border-pistachio-light pl-3">Специализация по болезням</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {profile.diseases?.map(d => (
                            <span key={d.id} className="bg-pistachio-light/10 text-pistachio-dark px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                {d.name}
                                {isEditing && <button type="button" onClick={() => setProfile({ ...profile, diseases: profile.diseases.filter(i => i.id !== d.id) })} className="hover:text-red-500">×</button>}
                            </span>
                        ))}
                    </div>
                    {isEditing && (
                        <select className="w-full p-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-pistachio-light" onChange={(e) => {
                            const d = allDiseases.find(item => item.id === Number(e.target.value));
                            if (d && !profile.diseases.find(i => i.id === d.id)) setProfile({ ...profile, diseases: [...profile.diseases, d] });
                        }}>
                            <option value="">Добавить болезнь из списка...</option>
                            {allDiseases.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    )}
                </section>

                {isEditing && (
                    <button type="submit" className="w-full py-4 bg-pistachio-dark text-white font-bold rounded-2xl shadow-lg hover:scale-[1.01] transition-transform">
                        Сохранить все изменения
                    </button>
                )}
            </form>
        </div>
    );
}
