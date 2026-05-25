import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postDoctorProfile } from '../../api/DoctorCabinet';
import { useNavigate } from 'react-router-dom';

export default function ChangeProfile() {
    const navigate = useNavigate();
    const { user, currentRole, switchRole } = useAuth();

    const hasRole = (roleName) => user?.roles?.includes(roleName);

    const [showDocForm, setShowDocForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ 
        stuff: '', experience: 0, description: '', phone: '', email: '' 
    });

    const handleRoleSwitch = (role, path) => {
        switchRole(role);
        navigate(path);
    };

    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const descriptionJson = JSON.stringify({
                about: { title: `Dr. ${user.fullname || 'Specialist'}`, text: formData.description },
                education: [], experience: [], specializations: [formData.stuff]
            });
            const payload = { 
                userID: user.id, 
                stuff: formData.stuff, 
                experience: Number(formData.experience), 
                description: descriptionJson, 
                phone: formData.phone, 
                email: formData.email, 
                diseases: [] 
            };
            await postDoctorProfile(payload);
            alert("Профиль врача создан! Пожалуйста, перезайдите в систему для обновления ролей.");
            window.location.reload();
        } catch (err) {
            alert("Ошибка: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-pistachio-dark">Управление ролями</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* PATIENT */}
                <div className={`p-6 border-2 rounded-2xl bg-white shadow-sm flex flex-col justify-between ${currentRole === 'user' ? 'border-pistachio-light ring-2 ring-pistachio-light/20' : 'border-gray-100'}`}>
                    <div>
                        <div className="text-3xl mb-2">👤</div>
                        <h2 className="text-xl font-bold">Пациент</h2>
                        <p className="text-gray-500 text-sm mt-2">Основной профиль для записи к врачам.</p>
                    </div>
                    {currentRole === 'user' ? (
                        <div className="mt-6 text-pistachio-dark font-bold text-center bg-pistachio-light/10 py-2 rounded-xl">Текущий профиль</div>
                    ) : (
                        <button onClick={() => handleRoleSwitch('user', '/')} className="mt-6 w-full border-2 border-pistachio-light text-pistachio-dark py-2 rounded-xl font-bold">Выбрать</button>
                    )}
                </div>

                {/* DOCTOR */}
                <div className={`p-6 border-2 rounded-2xl bg-white shadow-sm flex flex-col justify-between ${currentRole === 'doctor' ? 'border-pistachio-light ring-2 ring-pistachio-light/20' : 'border-gray-100'}`}>
                    {showDocForm ? (
                        <form onSubmit={handleCreateDoctor} className="flex flex-col gap-2">
                            <input required className="border p-2 rounded text-sm" placeholder="Специализация" onChange={e => setFormData({...formData, stuff: e.target.value})} />
                            <input required type="number" className="border p-2 rounded text-sm" placeholder="Стаж" onChange={e => setFormData({...formData, experience: parseInt(e.target.value)})} />
                            <textarea required className="border p-2 rounded text-sm h-20" placeholder="О себе" onChange={e => setFormData({...formData, description: e.target.value})} />
                            <button type="submit" disabled={loading} className="bg-pistachio-light text-white py-2 rounded-lg font-bold text-sm">
                                {loading ? "Загрузка..." : "Отправить"}
                            </button>
                            <button type="button" onClick={() => setShowDocForm(false)} className="text-gray-400 text-xs">Отмена</button>
                        </form>
                    ) : (
                        <>
                            <div>
                                <div className="text-3xl mb-2">👨‍⚕️</div>
                                <h2 className="text-xl font-bold">Врач</h2>
                                <p className="text-gray-500 text-sm mt-2">Кабинет для ведения пациентов.</p>
                            </div>
                            <div className="mt-6">
                                {hasRole('doctor') ? (
                                    currentRole === 'doctor' ? (
                                        <div className="text-pistachio-dark font-bold text-center bg-pistachio-light/10 py-2 rounded-xl">Активен</div>
                                    ) : (
                                        <button onClick={() => handleRoleSwitch('doctor', '/doctor')} className="w-full bg-pistachio-light text-white py-2 rounded-xl font-bold transition hover:bg-pistachio-dark">Переключиться</button>
                                    )
                                ) : (
                                    <button onClick={() => setShowDocForm(true)} className="w-full border-2 border-pistachio-light text-pistachio-dark py-2 rounded-xl font-bold hover:bg-pistachio-light hover:text-white transition">+ Стать врачом</button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* DIRECTOR */}
                <div className={`p-6 border-2 rounded-2xl bg-white shadow-sm flex flex-col justify-between ${currentRole === 'director' ? 'border-pistachio-light' : 'border-gray-100'}`}>
                    <div>
                        <div className="text-3xl mb-2">💼</div>
                        <h2 className="text-xl font-bold">Директор</h2>
                        <p className="text-gray-500 text-sm mt-2">Управление клиникой и персоналом.</p>
                    </div>
                    {hasRole('director') ? (
                        currentRole === 'director' ? <div className="mt-6 text-center font-bold">Активен</div> : <button onClick={() => handleRoleSwitch('director', '/director')} className="mt-6 w-full bg-pistachio-light text-white py-2 rounded-xl font-bold">Выбрать</button>
                    ) : (
                        <button disabled className="mt-6 w-full border-2 border-gray-200 text-gray-300 py-2 rounded-xl font-bold cursor-not-allowed">Скоро</button>
                    )}
                </div>

                {/* ADMIN */}
                <div className={`p-6 border-2 rounded-2xl bg-white shadow-sm flex flex-col justify-between ${currentRole === 'admin' ? 'border-pistachio-light' : 'border-gray-100'}`}>
                    <div>
                        <div className="text-3xl mb-2">📋</div>
                        <h2 className="text-xl font-bold">Админ</h2>
                        <p className="text-gray-500 text-sm mt-2">Управление филиалом.</p>
                    </div>
                    {hasRole('admin') ? (
                         currentRole === 'admin' ? <div className="mt-6 text-center font-bold">Активен</div> : <button onClick={() => handleRoleSwitch('admin', '/admin')} className="mt-6 w-full bg-pistachio-light text-white py-2 rounded-xl font-bold">Выбрать</button>
                    ) : (
                        <button disabled className="mt-6 w-full border-2 border-gray-200 text-gray-300 py-2 rounded-xl font-bold cursor-not-allowed">Скоро</button>
                    )}
                </div>
            </div>
        </div>
    );
}
