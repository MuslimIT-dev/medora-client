import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { API } from "../../../constants/API";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	const [meds, setMeds] = useState([]);
	const [visits, setVisits] = useState([]);
	const [analyses, setAnalyses] = useState([]);
	const [directions, setDirections] = useState([]); // Стейт для абстрактных направлений врача

	useEffect(() => {
		if (user?.id) {
			loadDashboardData();
		}
	}, [user?.id]);

	const loadDashboardData = async () => {
		try {
			const token = localStorage.getItem('token');
			const headers = { 'Authorization': `Bearer ${token}` };

			const [dashRes, dirRes] = await Promise.all([
				fetch(`${API}/dashboard`, { headers }),
				fetch(`${API}/medcard/directions/active`, { headers })
			]);

			const dashResult = await dashRes.json();
			const dirResult = await dirRes.json();

			setMeds(dashResult.meds || []);
			setVisits(dashResult.visits || []);
			setAnalyses(dashResult.analyses || []);
			setDirections(dirResult.data || []);
		} catch (e) {
			console.error("Ошибка загрузки дашборда:", e);
		} finally {
			setLoading(false);
		}
	};

	const toggleMed = async (id, currentStatus) => {
		const nextStatus = !currentStatus;
		try {
			setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: nextStatus } : m));

			await fetch(`${API}/medcard/medications/today/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify({ taken: nextStatus ? 1 : 0 })
			});
		} catch (e) {
			console.error(e);
			setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: currentStatus } : m));
		}
	};

	const nextMedToTake = meds.find(m => !m.taken);
	const highRiskAnalysis = analyses.find(a =>
		a.result.toLowerCase().includes("повышен") ||
		a.result.toLowerCase().includes("выше")
	);

	if (loading) return <div className="p-10 text-center font-bold text-pistachio-dark">Загрузка панели управления...</div>;

	return (
		<div className="flex flex-col gap-6 text-sm">
			<h1 className="text-2xl font-bold text-gray-800">🏠 Главная</h1>

			{/* НОВЫЙ ИНТЕГРИРОВАННЫЙ БЛОК НАПРАВЛЕНИЙ ОТ ВРАЧА */}
			<div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4 border border-gray-50">
				<h2 className="font-semibold text-lg text-gray-700 border-l-4 border-amber-400 pl-2 flex items-center gap-2">
					📋 Назначенные направления и рекомендации
					{directions.length > 0 && (
						<span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
							{directions.length}
						</span>
					)}
				</h2>
				
				{directions.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{directions.map(dir => {
							const isDoctorType = dir.targetType === "doctor";
							return (
								<div key={dir.id} className="p-4 bg-amber-50/20 border border-amber-100 rounded-xl flex flex-col gap-2 relative shadow-sm">
									<div className="flex justify-between items-start">
										<div>
											<span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
												isDoctorType ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
											}`}>
												{isDoctorType ? "👨‍⚕️ К специалисту" : dir.targetType === "test" ? "🧪 На Анализ" : "⚙️ На Процедуру"}
											</span>
											<h4 className="font-bold text-gray-800 mt-1.5 text-base">{dir.targetName}</h4>
										</div>
									</div>

									{dir.description && (
										<p className="text-xs text-gray-500 bg-white p-2 rounded-lg border border-gray-50 italic">
											Указание: {dir.description}
										</p>
									)}

									<button
									type="button"
									onClick={() => {
										if (dir.targetType === "doctor") {
											navigate(`/appointment/doctors?type=${dir.targetId}&from_direction=${dir.id}`);
										} else if (dir.targetType === "test") {
											navigate(`/appointment/analyzes?type=${dir.targetId}&from_direction=${dir.id}`);
										} else if (dir.targetType === "procedure") {
											navigate(`/appointment/procedures?type=${dir.targetId}&from_direction=${dir.id}`);
										} else {
											navigate(`/appointment/hospitals?type=${dir.targetId}&from_direction=${dir.id}`);
										}
									}}
									className="mt-2 py-2 bg-pistachio-dark text-white font-bold rounded-lg text-xs hover:bg-pistachio-light transition text-center shadow-sm"
								>
									📅 Найти свободное время и записаться
								</button>
								</div>
							);
						})}
					</div>
				) : (
					<p className="text-xs text-gray-400 italic py-2">У вас нет активных медицинских направлений.</p>
				)}
			</div>

			{/* СЕТКА СТАНДАРТНЫХ ОКОН КЛИНИКИ */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-gray-50">
					<h2 className="font-semibold text-lg text-gray-700 border-l-4 border-pistachio-light pl-2">
						💊 Сегодняшние лекарства
					</h2>
					{meds.length > 0 ? (
						meds.map(med => (
							<div
								key={med.id}
								className={`flex justify-between items-center p-3 rounded-xl border transition-all ${med.taken ? "bg-green-50/40 border-green-100 opacity-60" : "bg-gray-50 border-gray-100"}`}
							>
								<div>
									<p className={`font-medium ${med.taken ? "line-through text-gray-400" : "text-gray-700"}`}>
										{med.name}
									</p>
									<p className="text-xs text-gray-400 mt-0.5">⏰ {med.time}</p>
								</div>

								<button
									onClick={() => toggleMed(med.id, med.taken)}
									className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold transition-all ${med.taken ? "bg-green-400 border-green-400 text-white" : "bg-white border-gray-200"}`}
								>
									{med.taken && "✓"}
								</button>
							</div>
						))
					) : (
						<p className="text-sm text-gray-400 italic py-4 text-center">Нет запланированных лекарств на сегодня</p>
					)}
				</div>

				<div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-gray-50">
					<h2 className="font-semibold text-lg text-gray-700 border-l-4 border-pistachio-light pl-2">
						📅 Ближайшие визиты
					</h2>
					{visits.length > 0 ? (
						visits.map(v => (
							<div key={v.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
								<span className="text-xl">👨‍⚕️</span>
								<div>
									<p className="font-medium text-gray-800">{v.doctor}</p>
									<p className="text-xs text-gray-400 mt-0.5">⏱️ {v.date}</p>
								</div>
							</div>
						))
					) : (
						<p className="text-sm text-gray-400 italic py-4 text-center">Нет запланированных приемов</p>
					)}
				</div>

				<div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-gray-50">
					<h2 className="font-semibold text-lg text-gray-700 border-l-4 border-pistachio-light pl-2">
						🧪 Последние анализы
					</h2>
					{analyses.length > 0 ? (
						analyses.map(a => (
							<div key={a.id} className="flex justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 items-center">
								<p className="font-medium text-gray-700">🔬 {a.name}</p>
								<p className={`text-sm font-semibold px-2 py-0.5 rounded-md ${a.result.toLowerCase().includes("повышен") || a.result.toLowerCase().includes("выше")
										? "bg-red-50 text-red-600"
										: "bg-green-50 text-green-600"
									}`}>{a.result}</p>
							</div>
						))
					) : (
						<p className="text-sm text-gray-400 italic py-4 text-center">История анализов пуста</p>
					)}
				</div>

				<div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-gray-50">
					<h2 className="font-semibold text-lg text-gray-700 border-l-4 border-pistachio-light pl-2">
						⚠️ Важно
					</h2>

					{nextMedToTake && (
						<div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-xl text-sm flex items-center gap-2 font-medium animate-pulse">
							🔔 Не забудьте принять лекарство: <strong>{nextMedToTake.name}</strong> в {nextMedToTake.time}
						</div>
					)}

					{highRiskAnalysis && (
						<div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-sm flex flex-col gap-0.5 font-medium">
							<span>🚨 Обнаружен критический показатель!</span>
							<span className="text-xs opacity-80">Раздел {highRiskAnalysis.name}: {highRiskAnalysis.result}</span>
						</div>
					)}

					{!nextMedToTake && !highRiskAnalysis && (
						<div className="text-center text-sm text-gray-400 italic py-6">
							Все показатели в норме, график лекарств выполнен.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
