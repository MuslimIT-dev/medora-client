import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MakeAppointment } from "../../api/appointment";
import { useAuth } from "../../context/AuthContext";

const OrderSummary = ({ cardData, aptData, selectedClinicId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMode(null);
    }, [selectedClinicId]);

    const selectedClinic = useMemo(() => {
        return cardData?.clinics?.find(c => c.id === Number(selectedClinicId));
    }, [cardData, selectedClinicId]);

    const currentPrice = useMemo(() => {
        if (!mode || !selectedClinic || !selectedClinic.prices) return 0;
        const price = mode === "online" ? selectedClinic.prices.online : selectedClinic.prices.offline;
        return price !== null && price !== undefined ? price : 0;
    }, [mode, selectedClinic]);

    const handleBooking = async () => {
        if (!user) {
            alert("Пожалуйста, войдите в систему");
            return navigate("/login");
        }

        const isConfirmed = window.confirm(`Вы уверены, что хотите записаться в ${selectedClinic?.name} на ${aptData.date} в ${aptData.time}?`);
        if (!isConfirmed) return;

        setLoading(true);
        try {
            const pad = (num) => num.toString().padStart(2, '0');
            let datePart = aptData.date;
            let timePart = aptData.time;

            if (datePart.includes('-')) {
                const [y, m, d] = datePart.split('-');
                datePart = `${y}-${pad(m)}-${pad(d)}`;
            } else if (datePart.includes('.')) {
                const [d, m, y] = datePart.split('.');
                datePart = `${y}-${pad(m)}-${pad(d)}`;
            }

            const [hours, mins] = timePart.split(':');
            timePart = `${pad(hours)}:${pad(mins)}:00`;
            const manualIsoString = `${datePart}T${timePart}Z`;

            const payload = {
                userId: user.id,
                targetType: aptData.type,
                targetId: Number(aptData.id),
                branchId: Number(selectedClinicId),
                date: manualIsoString,
                directionId: Number(aptData.directionId || 0)
            };

            const token = localStorage.getItem('token');
            const response = await MakeAppointment(payload, token);

            alert("Запись оформлена! Рекомендация скрыта с Дашборда.");
            navigate("/medcard/visits", { state: { newVisit: response.data } });
        } catch (err) {
            alert("Ошибка записи: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = !mode || !aptData.date || !aptData.time || loading;

    return (
        /* Изменен sticky top-4 на статический на мобильных, чтобы не перекрывать контент, p-6 уменьшен на p-4 для узких экранов */
        <div className="p-4 sm:p-6 bg-white shadow-xl rounded-2xl border border-gray-100 lg:sticky lg:top-24 text-sm w-full box-border">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                {currentPrice} <span className="text-xs sm:text-sm font-normal text-gray-500">смн</span>
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-400 mb-4 uppercase tracking-wider font-semibold">Итого к оплате</p>

            <div className="mb-4 sm:mb-6 p-3 bg-gray-50 rounded-xl w-full box-border min-w-0">
                <p className="text-xs sm:text-sm font-bold text-gray-700 break-words">{selectedClinic?.name || "Загрузка филиала..."}</p>
                <p className="text-[11px] sm:text-xs text-gray-500 break-words mt-0.5">{selectedClinic?.address || "Адрес уточняется"}</p>
            </div>

            <div className="space-y-2 sm:space-y-3 w-full">
                {selectedClinic?.prices?.online !== undefined && selectedClinic?.prices?.online !== null && (
                    <button
                        type="button"
                        onClick={() => setMode("online")}
                        className={`w-full py-2.5 px-3 sm:py-3 sm:px-4 rounded-xl border-2 transition-all flex justify-between items-center gap-2 ${mode === "online" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-100 hover:border-gray-200"}`}
                    >
                        <span className="font-medium text-xs sm:text-sm text-left truncate">Онлайн консультация</span>
                        <span className="text-xs sm:text-sm font-bold shrink-0">{selectedClinic.prices.online} смн</span>
                    </button>
                )}
                {selectedClinic?.prices?.offline !== undefined && selectedClinic?.prices?.offline !== null && (
                    <button
                        type="button"
                        onClick={() => setMode("offline")}
                        className={`w-full py-2.5 px-3 sm:py-3 sm:px-4 rounded-xl border-2 transition-all flex justify-between items-center gap-2 ${mode === "offline" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-100 hover:border-gray-200"}`}
                    >
                        <span className="font-medium text-xs sm:text-sm text-left truncate">Прием в клинике</span>
                        <span className="text-xs sm:text-sm font-bold shrink-0">{selectedClinic.prices.offline} смн</span>
                    </button>
                )}
            </div>

            <div className="mt-4 sm:mt-6 space-y-1.5 sm:space-y-2 border-t pt-4 w-full box-border">
                {!selectedClinic?.prices?.online && !selectedClinic?.prices?.offline && (
                    <p className="text-[11px] sm:text-xs text-red-500 italic">Данный филиал временно не ведет прием пациентов</p>
                )}
                {(!mode && (selectedClinic?.prices?.online || selectedClinic?.prices?.offline)) && (
                    <p className="text-[11px] sm:text-xs text-red-500 italic">Выберите тип приема (Онлайн/Оффлайн)</p>
                )}
                {!aptData.date && <p className="text-[11px] sm:text-xs text-orange-500 italic">Выберите дату и время</p>}

                {aptData.date && aptData.time && (
                    <div className="flex justify-between items-start gap-2 text-xs sm:text-sm w-full">
                        <span className="text-gray-500 shrink-0">Запись на:</span>
                        <span className="font-bold text-right break-words">{aptData.date}, {aptData.time}</span>
                    </div>
                )}
            </div>

            <button
                onClick={handleBooking}
                disabled={isButtonDisabled}
                className={`mt-4 sm:mt-6 w-full py-3 sm:py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 text-sm sm:text-base ${isButtonDisabled ? "bg-gray-200 cursor-not-allowed shadow-none" : "bg-green-500 hover:bg-green-600 shadow-green-200"}`}
            >
                {loading ? "Обработка..." : "Подтвердить запись"}
            </button>

            <button
                onClick={() => navigate(-1)}
                className="mt-2 w-full py-1.5 sm:py-2 text-xs sm:text-sm text-gray-400 hover:text-gray-600 transition-colors text-center"
            >
                Отмена
            </button>
        </div>
    );
};

export default OrderSummary;
