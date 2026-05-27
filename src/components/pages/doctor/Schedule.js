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
        <div className="space-y-4 sm:space-y-6 w-full max-w-full box-border px-1 sm:px-0 overflow-x-hidden">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 w-full">
                <h1 className="text-xl sm:text-2xl font-bold text-pistachio-dark break-words">📅 График и записи</h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => navigate('/doctor/vacancies')}
                        className="w-full sm:w-auto px-4 py-2 sm:py-2 text-sm border border-pistachio-light text-pistachio-dark rounded-xl font-bold hover:bg-pistachio-light hover:text-white text-center transition active:scale-95"
                    >
                        🔍 Поиск вакансий
                    </button>
                    <button 
                        onClick={() => navigate('/doctor/schedule/online-setup')}
                        className="w-full sm:w-auto px-4 py-2 sm:py-2 text-sm bg-pistachio-light text-white rounded-xl font-bold shadow-lg hover:bg-pistachio-dark text-center transition active:scale-95"
                    >
                        ⚙️ Настроить онлайн-прием
                    </button>
                </div>
            </header>

            <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 w-full box-border overflow-x-hidden">
                <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800">Ближайшие приемы пациентов</h2>
                <div className="w-full overflow-x-hidden">
                    <List 
                        getList={fetchApts} 
                        Card={VisitCard} 
                        filters={{ status: 'active' }} 
                    />
                </div>
            </section>
        </div>
    );
}
