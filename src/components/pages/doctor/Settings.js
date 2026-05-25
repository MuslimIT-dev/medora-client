import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getDoctorProfile, updateDocProfile } from '../../../api/DoctorCabinet';
import { getAllDiseases, postDisease } from '../../../api/Diseases';
import { useNavigate } from 'react-router-dom';
import { getVerificationStatus } from '../../../api/Verification';

export default function DocSettings() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [allDiseases, setAllDiseases] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [verificationBid, setVerificationBid] = useState(null);
    const [illnessSearch, setIllnessSearch] = useState("");

    useEffect(() => {
        if (user?.id) loadData();
    }, [user]);

    const loadData = async () => {
        setLoading(true);
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
                
                const bid = await getVerificationStatus("doctor", profData.id);
                setVerificationBid(bid);
            }
            setAllDiseases(diseaseList || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadData();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfile({ ...profile, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const cleanEdu = profile.fullDesc.education.filter(item => item.degree?.trim() && item.place?.trim() && item.year?.trim());
        const cleanExp = profile.fullDesc.experience.filter(item => item.position?.trim() && item.place?.trim() && item.years?.trim());

        try {
            const payload = {
                userID: Number(user.id),
                stuff: profile.stuff,
                experience: Number(profile.experience),
                description: JSON.stringify({ ...profile.fullDesc, education: cleanEdu, experience: cleanExp }),
                phone: profile.phone,
                email: profile.email,
                image: profile.image || "",
                diseases: profile.diseases?.map(d => d.id) || []
            };
            await updateDocProfile(payload);
            alert("Данные сохранены!");
            setIsEditing(false);
            loadData();
        } catch (err) { alert("Ошибка: " + err.message); }
    };

    const handleAddIllness = async (e) => {
        if (e.key === 'Enter' && illnessSearch.trim()) {
            e.preventDefault();
            const term = illnessSearch.trim();
            const existing = allDiseases.find(d => d.name.toLowerCase() === term.toLowerCase());
            
            if (existing) {
                if (!profile.diseases.find(i => i.id === existing.id)) {
                    setProfile({ ...profile, diseases: [...profile.diseases, existing] });
                }
            } else {
                const desc = prompt(`Добавить новую болезнь "${term}"? Введите описание:`);
                if (desc) {
                    const res = await postDisease({ name: term, description: desc });
                    const newObj = { id: res.data, name: term, description: desc };
                    setAllDiseases(prev => [...prev, newObj]);
                    setProfile(prev => ({ ...prev, diseases: [...prev.diseases, newObj] }));
                }
            }
            setIllnessSearch("");
        }
    };

    const filteredIllnesses = useMemo(() => 
        !illnessSearch ? [] : allDiseases.filter(d => d.name.toLowerCase().includes(illnessSearch.toLowerCase())),
    [illnessSearch, allDiseases]);

    if (loading) return <div className="p-10 text-center font-bold text-pistachio-dark">Загрузка настроек...</div>;

    return (
        <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-6 border border-gray-100">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <img src={profile.image || "https://placeholder.com"} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-pistachio-light" />
                        {isEditing && (
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-[10px] font-bold">ИЗМЕНИТЬ</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">{profile.name}</h1>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                verificationBid?.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                                {verificationBid ? verificationBid.status : 'none'}
                            </span>

                            {(!verificationBid || verificationBid.status === 'pending') && (
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/doctor/verification-bid')} 
                                    className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-600 transition"
                                >
                                    {!verificationBid ? "Подать заявку" : "Редактировать заявку"}
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>
                </div>
                <button type="button" onClick={isEditing ? handleCancel : () => setIsEditing(true)} className={`px-6 py-2 rounded-xl font-bold transition ${isEditing ? "bg-gray-100 text-gray-600" : "bg-pistachio-light text-white"}`} >
                    {isEditing ? "Отмена" : "Редактировать"}
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <section className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-700 border-l-4 border-pistachio-light pl-3">Данные</h3>
                        <input disabled={!isEditing} placeholder="Email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full p-2 border rounded disabled:bg-gray-50" />
                        <input disabled={!isEditing} placeholder="Телефон" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full p-2 border rounded disabled:bg-gray-50" />
                        <input disabled={!isEditing} placeholder="Специализация" value={profile.stuff} onChange={e => setProfile({ ...profile, stuff: e.target.value })} className="w-full p-2 border rounded disabled:bg-gray-50" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-700 border-l-4 border-pistachio-light pl-3">Профиль</h3>
                        <input disabled={!isEditing} placeholder="Заголовок" value={profile.fullDesc.about.title} onChange={e => setProfile({...profile, fullDesc: {...profile.fullDesc, about: {...profile.fullDesc.about, title: e.target.value}}})} className="w-full p-2 border rounded disabled:bg-gray-50" />
                        <textarea disabled={!isEditing} placeholder="О себе" value={profile.fullDesc.about.text} onChange={e => setProfile({...profile, fullDesc: {...profile.fullDesc, about: {...profile.fullDesc.about, text: e.target.value}}})} className="w-full p-2 border rounded h-24 disabled:bg-gray-50" />
                    </div>
                </section>

                {['education', 'experience'].map(field => (
                    <section key={field} className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-700 border-l-4 border-pistachio-light pl-3 uppercase text-sm">{field === 'education' ? 'Образование' : 'Опыт'}</h3>
                            {isEditing && <button type="button" onClick={() => setProfile({...profile, fullDesc: {...profile.fullDesc, [field]: [...profile.fullDesc[field], field === 'education' ? {degree:"", place:"", year:""} : {place:"", position:"", years:""}]}})} className="text-xs text-pistachio-dark font-bold">+ Добавить</button>}
                        </div>
                        {profile.fullDesc[field].map((item, idx) => (
                            <div key={idx} className="grid grid-cols-4 gap-2 bg-gray-50 p-2 rounded-lg">
                                {Object.keys(item).map(key => (
                                    <input key={key} disabled={!isEditing} placeholder={key} value={item[key]} onChange={e => {
                                        const updated = [...profile.fullDesc[field]];
                                        updated[idx][key] = e.target.value;
                                        setProfile({...profile, fullDesc: {...profile.fullDesc, [field]: updated}});
                                    }} className="p-2 border rounded text-sm bg-white" />
                                ))}
                                {isEditing && <button type="button" onClick={() => setProfile({...profile, fullDesc: {...profile.fullDesc, [field]: profile.fullDesc[field].filter((_, i) => i !== idx)}})} className="text-red-500 text-xl">&times;</button>}
                            </div>
                        ))}
                    </section>
                ))}

                <section className="space-y-4">
                    <h3 className="font-bold text-gray-700 border-l-4 border-pistachio-light pl-3">Заболевания</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.diseases?.map(d => (
                            <span key={d.id} className="bg-pistachio-light/10 text-pistachio-dark px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {d.name} {isEditing && <button type="button" onClick={() => setProfile({ ...profile, diseases: profile.diseases.filter(i => i.id !== d.id) })}>×</button>}
                            </span>
                        ))}
                    </div>
                    {isEditing && (
                        <div className="relative">
                            <input placeholder="Поиск болезни..." value={illnessSearch} onChange={e => setIllnessSearch(e.target.value)} onKeyDown={handleAddIllness} className="w-full p-2 border rounded-xl" />
                            {filteredIllnesses.length > 0 && (
                                <div className="absolute top-full w-full bg-white border rounded shadow-lg z-50 max-h-40 overflow-y-auto">
                                    {filteredIllnesses.map(d => (
                                        <div key={d.id} onClick={() => { if(!profile.diseases.find(i => i.id === d.id)) setProfile({...profile, diseases: [...profile.diseases, d]}); setIllnessSearch(""); }} className="p-2 hover:bg-gray-100 cursor-pointer text-sm">{d.name}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {isEditing && <button type="submit" className="w-full py-4 bg-pistachio-dark text-white font-bold rounded-2xl shadow-lg hover:scale-[1.01] transition-transform">Сохранить все изменения</button>}
            </form>
        </div>
    );
}
