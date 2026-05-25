import { Link } from 'react-router-dom';

const ITEMS = [
	{
		name: "Диагнозы",
		link: "/medcard/diagnoses",
		icon: "\u{1F9EC}",
		desc: "Болезни и хронические состояния"
	},
	{
		name: "Анализы и показатели",
		link: "/medcard/analyses",
		icon: "\u{1F9EA}",
		desc: "Результаты анализов, пульс, давление, вес"
	},
	{
		name: "Лекарства",
		link: "/medcard/medications",
		icon: "\u{1F48A}",
		desc: "Назначенные препараты"
	},
	{
		name: "Визиты",
		link: "/medcard/visits",
		icon: "\u{1F4C5}",
		desc: "История приёмов"
	},
	{
		name: "Документы",
		link: "/medcard/documents",
		icon: "\u{1F4C4}",
		desc: "Справки и выписки"
	},
	{
		name: "Аллергии",
		link: "/medcard/allergies",
		icon: "\u{1F49A}",
		desc: "Аллергические реакции"
	}
];

export default function MedCard() {
	return (
		<div className="max-w-5xl mx-auto">

			<h1 className="text-2xl font-bold mb-4">
				Медкарта
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