import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import List from '../../widgets/List';
import VisitCard from '../../dummies/VisitCard';
import { getDoctorAppointments } from '../../../api/DoctorCabinet';

export default function DocSchedule() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchApts = (page, count, filters) => {
        return getDoctorAppointments(user.id, page, count, filters);
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-pistachio-dark">📅 График и записи</h1>
                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate('/doctor/vacancies')}
                        className="px-4 py-2 border border-pistachio-light text-pistachio-dark rounded-xl font-bold hover:bg-pistachio-light hover:text-white transition"
                    >
                        🔍 Поиск вакансий
                    </button>
                    <button 
                        onClick={() => navigate('/doctor/schedule/online-setup')}
                        className="px-4 py-2 bg-pistachio-light text-white rounded-xl font-bold shadow-lg hover:bg-pistachio-dark transition"
                    >
                        ⚙️ Настроить онлайн-прием
                    </button>
                </div>
            </header>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4">Ближайшие приемы пациентов</h2>
                <List 
                    getList={fetchApts} 
                    Card={VisitCard} 
                    filters={{ status: 'active' }} 
                />
            </section>
        </div>
    );
}
