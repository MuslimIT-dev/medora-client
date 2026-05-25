import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { deleteAppointment } from "../../api/appointment";
import DocProtocolForm from "../widgets/DocProtocolForm";
import ReviewModal from "../widgets/ReviewModal";

export default function VisitCard({ Data, onActionSuccess }) {
    const navigate = useNavigate();
    const location = useLocation();
    
    const isDoctorSide = location.pathname.includes("/doctor");
    const [isProtocolOpen, setIsProtocolOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    
    const [form, setForm] = useState({ diseases: [], medications: [], directions: [] });

    const statusStyles = {
        active: "bg-blue-100 text-blue-700",
        passed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700"
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm("Вы уверены, что хотите отменить запись?")) return;
        try {
            await deleteAppointment(Data.id, Data.targetId, Data.targetType);
            alert("Запись отменена");
            onActionSuccess();
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="p-4 bg-white border rounded-xl shadow-sm flex flex-col gap-2 relative text-sm">
            <div className="flex justify-between items-start">
                <div onClick={() => !isDoctorSide && Data.status !== 'active' && navigate(`/appointment/${Data.targetType}/${Data.targetId}`)} className={(!isDoctorSide && Data.status !== 'active') ? "cursor-pointer hover:opacity-70 transition" : ""}>
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 flex-wrap">
                        {isDoctorSide ? `👤 Пациент: ${Data.patient}` : `👨‍⚕️ ${Data.doctor}`}
                        {!isDoctorSide && Data.status !== 'active' && <span className="text-xs font-normal text-blue-500 underline">(Записаться снова)</span>}
                    </h3>
                    <p className="text-gray-500 text-xs mt-0.5">📍 {Data.address}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusStyles[Data.status] || "bg-gray-100"}`}>
                    {Data.status}
                </span>
            </div>
            
            <div className="flex justify-between items-center mt-2 border-t pt-2 text-xs">
                <span className="text-gray-600 font-medium">📅 {Data.date}</span>
                <div className="flex gap-2">
                    {!isDoctorSide && Data.status === 'active' && (
                        <button type="button" onClick={handleDelete} className="text-red-500 font-bold hover:underline">Отменить</button>
                    )}

                    {!isDoctorSide && Data.status === 'passed' && (
                        <button type="button" onClick={() => setIsReviewOpen(true)} className="text-amber-600 font-bold hover:underline">
                            ★ Отзыв о приеме
                        </button>
                    )}

                    {isDoctorSide && Data.status === 'active' && (
                        <button type="button" onClick={() => setIsProtocolOpen(true)} className="bg-pistachio-dark text-white font-bold px-3 py-1.5 rounded-lg hover:bg-pistachio-light transition text-[11px] shadow-sm">📋 Заполнить протокол</button>
                    )}
                </div>
            </div>

            <ReviewModal isOpen={isReviewOpen} onClose={() => { setIsReviewOpen(false); onActionSuccess(); }} appointment={Data} />

            {isProtocolOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-fadeIn" onClick={() => setIsProtocolOpen(false)}>
                    <div className="h-full bg-white animate-slideLeft" onClick={(e) => e.stopPropagation()}>
                        <DocProtocolForm form={form} setForm={setForm} onClose={() => setIsProtocolOpen(false)} onSubmit={async (e) => { e.preventDefault(); /* ... код сохранения протокола врача ... */ }} />
                    </div>
                </div>
            )}
        </div>
    );
}
