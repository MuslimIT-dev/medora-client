import { Link } from 'react-router-dom';

const ITEMS = [
	{
		name: "Врачи",
		link: "/appointment/doctors",
		icon: "\u{1F9D1}\u{200D}\u{2695}\u{FE0F}",
		desc: "Консультации специалистов"
	},
	{
		name: "Анализы/Диагностика",
		link: "/appointment/analyzes",
		icon: "\u{1F9EA}",
		desc: "Лабораторная диагностика"
	},
	{
		name: "Процедуры",
		link: "/appointment/procedures",
		icon: "\u{1F489}",
		desc: "Лечение и уход"
	},
	{
		name: "Стационар",
		link: "/appointment/hospitals",
		icon: "\u{1F3E5}",
		desc: "Проживание и лечение"
	}
];

export default function MakeAppoint() {
	return (
		<div className="max-w-5xl mx-auto">

			<h1 className="text-2xl font-bold mb-4">
				Запись на приём
			</h1>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

				{ITEMS.map((item, i) => (
					<Link
						key={i}
						to={item.link}
						className="group p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center text-center"
					>

						<div className="text-3xl mb-2 group-hover:scale-110 transition">
							{item.icon}
						</div>

						<p className="font-semibold">
							{item.name}
						</p>

						<p className="text-xs text-gray-500 mt-1">
							{item.desc}
						</p>

						<div className="h-1 w-0 bg-pistachio-light mt-3 group-hover:w-full transition-all duration-300 rounded-full"></div>

					</Link>
				))}

			</div>
		</div>
	);
}