import { useState, useEffect, useMemo } from "react";
import CheckMonthShedule from "../../api/CheckMonthShedule.js";

const SheduleCard = ({ type, id, aptData, setAptData }) => {
	const now = new Date();
	const currentMonth = now.getMonth() + 1;
	const currentYear = now.getFullYear();

	const [month, setMonth] = useState(currentMonth);
	const [year, setYear] = useState(currentYear);
	const [loading, setLoading] = useState(false);
	const [schedule, setSchedule] = useState({ freeDays: [], times: {} });
	const [selectedDay, setSelectedDay] = useState(null);

	const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const data = await CheckMonthShedule({ 
					type, id, branchId: aptData.hospitalId, month, year 
				});
				setSchedule(data);
			} catch (err) {
				setSchedule({ freeDays: [], times: {} });
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [month, year, type, id, aptData.hospitalId]); 

	const { daysInMonth, startOffset } = useMemo(() => {
		const days = new Date(year, month, 0).getDate();
		let firstDay = new Date(year, month - 1, 1).getDay();
		const offset = firstDay === 0 ? 6 : firstDay - 1;
		return { daysInMonth: days, startOffset: offset };
	}, [month, year]);

	const isPast = useMemo(() => {
		return year < currentYear || (year === currentYear && month <= currentMonth);
	}, [month, year, currentMonth, currentYear]);

	const changeMonth = (dir) => {
		let newMonth = month + dir;
		let newYear = year;

		if (newMonth < 1) { newMonth = 12; newYear--; }
		if (newMonth > 12) { newMonth = 1; newYear++; }

		if (newYear < currentYear || (newYear === currentYear && newMonth < currentMonth)) return;

		setMonth(newMonth);
		setYear(newYear);
	};

	const handleDayClick = (day) => {
		if (year === currentYear && month === currentMonth && day < now.getDate()) return;
		
		setSelectedDay(day);
		setAptData({ ...aptData, date: `${day}.${month}.${year}`, time: "" });
	};

	return (
		<div className={`w-full box-border ${loading ? "opacity-50 pointer-events-none" : ""}`}>
			<div className="mb-4 flex items-center justify-between px-1 sm:px-2">
				<button
					onClick={() => changeMonth(-1)}
					disabled={isPast}
					className="w-8 h-8 flex items-center justify-center border rounded-full disabled:opacity-20 shrink-0 active:scale-95 transition-transform"
				>
					{"<"}
				</button>
				<span className="font-bold text-gray-700 capitalize text-sm sm:text-base truncate px-1">
					{new Date(year, month - 1).toLocaleString('ru', { month: 'long' })} {year}
				</span>
				<button
					onClick={() => changeMonth(1)}
					className="w-8 h-8 flex items-center justify-center border rounded-full shrink-0 active:scale-95 transition-transform"
				>
					{">"}
				</button>
			</div>

			<div className="grid grid-cols-7 gap-1 text-center w-full min-w-0">
				{weekDays.map(d => (
					<div key={d} className="text-[9px] sm:text-[10px] uppercase text-gray-400 font-bold py-1 truncate">{d}</div>
				))}

				{Array.from({ length: startOffset }).map((_, i) => (
					<div key={`empty-${i}`} className="aspect-square" />
				))}

				{Array.from({ length: daysInMonth }, (_, i) => {
					const day = i + 1;
					const isFree = schedule.freeDays.includes(day);
					const isSelected = selectedDay === day;

					const isOldDay = year === currentYear && month === currentMonth && day < now.getDate();

					return (
						<button
							key={day}
							disabled={isOldDay || !isFree}
							onClick={() => handleDayClick(day)}
							className={`
								aspect-square flex items-center justify-center text-xs sm:text-sm rounded-lg transition-all w-full p-0
								${isSelected ? "bg-pistachio-dark text-white ring-1 sm:ring-2 ring-offset-1 ring-pistachio-dark" : ""}
								${isFree && !isOldDay ? "bg-green-100 text-green-700 font-bold hover:bg-green-200" : "text-gray-300"}
								${isOldDay ? "opacity-30 cursor-not-allowed" : ""}
							`}
						>
							{day}
						</button>
					);
				})}
			</div>

			{selectedDay && !loading && (
				<div className="mt-5 sm:mt-6 animate-fadeIn w-full box-border">
					<div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase mb-2 sm:mb-3 tracking-wider">Доступное время</div>
					{/* Заменен flex на grid для идеального выравнивания кнопок времени на экранах смартфонов */}
					<div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 w-full">
						{schedule.times[selectedDay]?.map((t) => (
							<button
								key={t}
								onClick={() => setAptData({ ...aptData, time: t })}
								className={`
									px-2 py-2 sm:px-4 text-xs sm:text-sm rounded-xl border text-center transition-all truncate
									${aptData.time === t ? "bg-pistachio-dark text-white border-pistachio-dark shadow-md" : "bg-white text-gray-700 border-gray-200 hover:border-pistachio-dark"}
								`}
							>
								{t}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);									
};

export default SheduleCard;
