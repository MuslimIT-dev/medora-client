import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDoctorDescription, getDoctorReviews } from "../../../../api/doctor";

export default function DoctorPage() {
    const { state } = useLocation();
    const doctor = state?.cardData;

    const [desc, setDesc] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const count = 5;

    useEffect(() => {
        if (doctor?.id) {
            loadDescription();
        }
    }, [doctor?.id]);

    useEffect(() => {
        if (doctor?.id) {
            loadReviews(page);
        }
    }, [page, doctor?.id]);

    const loadDescription = async () => {
        const data = await getDoctorDescription(doctor.id);
        setDesc(data);
    };

    const loadReviews = async (p) => {
        const res = await getDoctorReviews(doctor.id, p, count);
        if (res?.data) {
            setReviews(res.data.data);
        }
    };

    if (!doctor) return <div className="p-10 text-center font-bold">Доктор не найден</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8 pb-20">
            
            {/* HEADER MAIN INFO */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-3xl">
					<img src={doctor.image}/>
				</div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800">{doctor.name}</h1>
                    <p className="text-blue-600 font-medium">{doctor.stuff}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-500 font-bold">⭐ {doctor.aveRate.toFixed(1)}</span>
                        <span className="text-gray-400 text-sm">({doctor.reviews} отзывов)</span>
                    </div>
                </div>
            </div>

            {/* DESCRIPTION: ABOUT ME */}
            {desc?.about && (
                <div className="space-y-2">
                    <h2 className="text-lg font-bold text-gray-700 px-1">{desc.about.title}</h2>
                    <div className="bg-blue-50 p-4 rounded-2xl text-gray-600 leading-relaxed">
                        {desc.about.text}
                    </div>
                </div>
            )}

            {/* SCROLLS */}
            <div className="space-y-8">
                
                {/* EDUCATION */}
                {desc?.education && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-700 mb-3 px-1">Образование</h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">
                            {desc.education.map((e, i) => (
                                <div key={i} className="min-w-[280px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-shrink-0">
                                    <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">{e.year}</p>
                                    <p className="font-bold text-gray-800 leading-tight mb-2">{e.degree}</p>
                                    <p className="text-gray-500 text-sm italic">{e.place}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* EXPERIENCE */}
                {desc?.experience && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-700 mb-3 px-1">Опыт работы</h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">
                            {desc.experience.map((e, i) => (
                                <div key={i} className="min-w-[280px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-shrink-0">
                                    <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-1">{e.years}</p>
                                    <p className="font-bold text-gray-800 leading-tight mb-2">{e.position}</p>
                                    <p className="text-gray-500 text-sm italic">{e.place}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SPECIALIZATIONS */}
                {desc?.specializations && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-700 mb-3 px-1">Специализации</h2>
                        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar -mx-4 px-4">
                            {desc.specializations.map((spec, i) => (
                                <span key={i} className="whitespace-nowrap px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* REVIEWS */}
            <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Отзывы пациентов</h2>
                </div>

                <div className="space-y-4">
                    {reviews.length > 0 ? reviews.map(r => (
                        <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-50 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-gray-800">{r.sender}</p>
                                <span className="text-yellow-500 font-bold text-sm">⭐ {r.rating}</span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed italic">"{r.comment}"</p>
                        </div>
                    )) : <p className="text-gray-400 italic">Отзывов пока нет</p>}
                </div>

                {/* PAGINATION */}
                <div className="flex items-center justify-center gap-6 mt-8">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        ←
                    </button>
                    <span className="font-bold text-gray-700">Страница {page}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}
