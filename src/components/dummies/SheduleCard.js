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
		<div className={loading ? "opacity-50 pointer-events-none" : ""}>
			<div className="mb-4 flex items-center justify-between px-2">
				<button
					onClick={() => changeMonth(-1)}
					disabled={isPast}
					className="w-8 h-8 flex items-center justify-center border rounded-full disabled:opacity-20"
				>
					{"<"}
				</button>
				<span className="font-bold text-gray-700 capitalize">
					{new Date(year, month - 1).toLocaleString('ru', { month: 'long' })} {year}
				</span>
				<button
					onClick={() => changeMonth(1)}
					className="w-8 h-8 flex items-center justify-center border rounded-full"
				>
					{">"}
				</button>
			</div>

			<div className="grid grid-cols-7 gap-1 text-center">
				{weekDays.map(d => (
					<div key={d} className="text-[10px] uppercase text-gray-400 font-bold py-1">{d}</div>
				))}

				{Array.from({ length: startOffset }).map((_, i) => (
					<div key={`empty-${i}`} />
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
								aspect-square flex items-center justify-center text-sm rounded-lg transition-all
								${isSelected ? "bg-pistachio-dark text-white ring-2 ring-offset-1 ring-pistachio-dark" : ""}
								${isFree && !isOldDay ? "bg-green-100 text-green-700 font-bold" : "text-gray-300"}
								${isOldDay ? "opacity-30 cursor-not-allowed" : ""}
							`}
						>
							{day}
						</button>
					);
				})}
			</div>

			{selectedDay && !loading && (
				<div className="mt-6 animate-fadeIn">
					<div className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Доступное время</div>
					<div className="flex gap-2 flex-wrap">
						{schedule.times[selectedDay]?.map((t) => (
							<button
								key={t}
								onClick={() => setAptData({ ...aptData, time: t })}
								className={`
									px-4 py-2 text-sm rounded-xl border transition-all
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
