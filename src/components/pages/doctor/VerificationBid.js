import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getVerificationStatus, postVerificationBid, updateVerificationBid, deleteVerificationBid } from '../../../api/Verification';
import { getDoctorProfile } from '../../../api/DoctorCabinet';

export default function VerificationBid() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [bid, setBid] = useState(null);
    const [doctorId, setDoctorId] = useState(null);
    
    const [formData, setFormData] = useState({
        description: "",
        documents: []
    });

    useEffect(() => {
        if (user?.id) {
            loadBidData();
        }
    }, [user]);

    const loadBidData = async () => {
        try {
            const prof = await getDoctorProfile(user.id);
            setDoctorId(prof.id);
            const existingBid = await getVerificationStatus("doctor", prof.id);
            if (existingBid) {
                setBid(existingBid);
                setFormData({ description: existingBid.description, documents: existingBid.documents || [] });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, documents: [...prev.documents, reader.result] }));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSave = async () => {
        if (!formData.description.trim()) return alert("Введите описание");
        try {
            if (bid) {
                await updateVerificationBid(bid.id, formData.description, formData.documents);
            } else {
                await postVerificationBid({ id: doctorId, description: formData.description, documents: formData.documents });
            }
            alert("Заявка сохранена!");
            navigate('/doctor/settings');
        } catch (e) { alert(e.message); }
    };

    const handleDelete = async () => {
        if (!window.confirm("Удалить заявку?")) return;
        try {
            await deleteVerificationBid(bid.id);
            navigate('/doctor/settings');
        } catch (e) { alert(e.message); }
    };

    if (loading) return <div className="p-20 text-center">Загрузка...</div>;

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10">
            <h1 className="text-2xl font-bold mb-6">{bid ? "Редактирование заявки" : "Подача заявки на верификацию"}</h1>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Описание квалификации</label>
                    <textarea 
                        className="w-full p-3 border rounded-xl h-40 focus:ring-2 focus:ring-pistachio-light outline-none"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Напишите о ваших дипломах, сертификатах и опыте..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Документы (фото/сканы)</label>
                    <input type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pistachio-light file:text-white hover:file:bg-pistachio-dark" />
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {formData.documents.map((doc, idx) => (
                            <div key={idx} className="relative group">
                                <img src={doc} className="w-full h-20 object-cover rounded-lg border" alt="doc" />
                                <button 
                                    onClick={() => setFormData({...formData, documents: formData.documents.filter((_, i) => i !== idx)})}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                >×</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button onClick={handleSave} className="flex-1 bg-pistachio-dark text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition">
                        {bid ? "Обновить" : "Отправить"}
                    </button>
                    {bid && (
                        <button onClick={handleDelete} className="flex-1 border-2 border-red-500 text-red-500 py-3 rounded-xl font-bold hover:bg-red-50 transition">
                            Удалить
                        </button>
                    )}
                </div>
                <button onClick={() => navigate(-1)} className="w-full text-gray-400 text-sm">Назад</button>
            </div>
        </div>
    );
}
