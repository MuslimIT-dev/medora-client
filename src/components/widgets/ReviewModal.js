import React, { useState, useEffect } from "react";
import { API } from "../../constants/API";

export default function ReviewModal({ isOpen, onClose, appointment }) {
    const [reviewId, setReviewId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        fetch(`${API}/reviews/by-appointment/${appointment.id}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        .then(r => r.json())
        .then(res => {
            if (res.data) {
                setReviewId(res.data.id);
                setRating(res.data.rating);
                setComment(res.data.comment);
            } else {
                setReviewId(null);
                setRating(5);
                setComment("");
            }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [isOpen, appointment.id]);

    const handleSave = async () => {
        const isEdit = reviewId !== null;
        const url = isEdit ? `${API}/reviews` : `${API}/reviews`;
        const method = isEdit ? "PUT" : "POST";
        
        const body = isEdit 
            ? { reviewId: Number(reviewId), rating: Number(rating), comment }
            : { appointmentId: Number(appointment.id), targetId: Number(appointment.targetId), targetType: appointment.targetType, rating: Number(rating), comment };

        const res = await fetch(url, {
            method,
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert(isEdit ? "Отзыв успешно обновлен!" : "Спасибо за ваш отзыв!");
            onClose();
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Удалить ваш отзыв?")) return;
        const res = await fetch(`${API}/reviews?id=${reviewId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
            alert("Отзыв удален");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[600] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 flex flex-col gap-4 shadow-xl">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-base text-gray-800">
                        {reviewId ? "📝 Редактировать отзыв" : "⭐ Оставить отзыв врачу"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 text-lg font-bold">✕</button>
                </div>

                {loading ? <div className="text-center py-6 font-medium text-gray-400">Загрузка данных...</div> : (
                    <div className="flex flex-col gap-3 text-xs">
                        <div>
                            <label className="font-bold text-gray-400 block mb-1">Ваша оценка (1-5)</label>
                            <div className="flex gap-2 text-xl">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <button key={num} type="button" onClick={() => setRating(num)} className={num <= rating ? "text-amber-400" : "text-gray-200"}>★</button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="font-bold text-gray-400 block mb-1">Комментарий</label>
                            <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full border p-2.5 rounded-xl h-24 resize-none outline-none focus:border-green-500 text-xs" placeholder="Расскажите ваши впечатления от приема..." />
                        </div>

                        <div className="flex gap-2 mt-2">
                            <button onClick={handleSave} className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition">Сохранить</button>
                            {reviewId && (
                                <button onClick={handleDelete} className="px-4 py-3 border border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 transition">Удалить</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
