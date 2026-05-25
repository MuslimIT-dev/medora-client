import React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '../../widgets/List.js';
import { getDoctorPatients } from '../../../api/DoctorCabinet.js';

export default function DocPatients() {
    const navigate = useNavigate();

    const PatientCard = ({ Data }) => {
        const getAge = (birthDateStr) => {
            if (!birthDateStr || birthDateStr === 'Не указана') return '—';
            const birth = new Date(birthDateStr);
            const now = new Date();
            let age = now.getFullYear() - birth.getFullYear();
            if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
                age--;
            }
            return `${age} лет`;
        };

        return (
            <div 
                onClick={() => navigate(`/doctor/patients/${Data.id}/medcard`)}
                className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-pistachio-light transition cursor-pointer flex flex-col md:flex-row justify-between md:items-center gap-4"
            >
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-gray-800">👤 {Data.fullname}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                            {getAge(Data.birth_date)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">
                        📞 Тел: <span className="text-gray-700 font-medium">{Data.phone}</span> | Пол: <span className="text-gray-700 font-medium">{Data.gender === 'male' ? 'Мужской' : 'Женский'}</span>
                    </p>
                </div>

                <div className="text-left md:text-right shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-gray-50">
                    <span className="text-xs text-gray-400 block">Всего приемов: <strong className="text-gray-700">{Data.total_visits}</strong></span>
                    <span className="text-xs text-gray-400 block mt-0.5">Последний визит: <strong className="text-gray-600">{new Date(Data.last_visit).toLocaleDateString()}</strong></span>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-800">👥 Мои пациенты</h1>
            <p className="text-xs text-gray-400 -mt-2">Выберите пациента для просмотра электронной медицинской карты</p>
            
            <List 
                getList={(page, count) => getDoctorPatients(page, count)} 
                Card={PatientCard} 
                filters={{}} 
            />
        </div>
    );
}
