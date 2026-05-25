import { useState } from 'react';
import List from '../../../widgets/List.js';
import VisitCard from '../../../dummies/VisitCard.js';
import { getVisits } from '../../../../api/appointment.js';
import { useAuth } from "../../../../context/AuthContext.js";

const STATUS_TABS = [
    { id: "", name: "📋 Все" },
    { id: "active", name: "🟢 Активные" },
    { id: "passed", name: "🔵 Завершенные" },
    { id: "cancelled", name: "🔴 Отмененные" }
];

export default function Visits() {
    const { user } = useAuth();
    const [refresh, setRefresh] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");

    const fetchUserVisits = (page, count, filters) => {
        return getVisits(user?.id, page, count, { ...filters, status: statusFilter });
    };

    const handleSuccess = () => setRefresh(prev => prev + 1);

    if (!user) return <div className="p-10 text-center font-semibold text-gray-500">Пожалуйста, войдите в систему</div>;

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold text-gray-800">📅 Мои записи</h1>

            <div className="flex border-b border-gray-100 gap-2 overflow-x-auto pb-1 scrollbar-none">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`py-2 px-4 font-bold text-xs rounded-xl transition-all whitespace-nowrap border ${
                            statusFilter === tab.id
                                ? "bg-pistachio-light/10 text-pistachio-dark border-pistachio-light shadow-sm"
                                : "bg-white border-gray-100 text-gray-400 hover:text-gray-600 hover:border-gray-200"
                        }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            <List 
                key={`${statusFilter}-${refresh}`}
                getList={fetchUserVisits} 
                Card={(props) => <VisitCard {...props} onActionSuccess={handleSuccess} />} 
                filters={{}} 
            />
        </div>
    );
}
