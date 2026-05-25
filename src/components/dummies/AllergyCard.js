export default function AllergyCard({ Data }) {

	const severityColor = {
		"Лёгкая": "bg-green-400",
		"Средняя": "bg-yellow-400",
		"Тяжёлая": "bg-red-500"
	};

	return (
		<div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col gap-2">

			<h2 className="text-lg font-semibold">
				🌿 {Data.name}
			</h2>

			<p className="text-xs text-gray-500">
				{Data.type}
			</p>

			<p className="text-sm">
				Реакция: {Data.reaction}
			</p>

			<div className="flex gap-2 text-xs mt-1">

				<span className="px-2 py-0.5 bg-gray-100 rounded">
					{Data.status}
				</span>

				<span className={`px-2 py-0.5 text-white rounded ${severityColor[Data.severity]}`}>
					{Data.severity}
				</span>

			</div>

			<div className="text-xs text-gray-400 mt-2">
				Обнаружено: {Data.date}
			</div>

		</div>
	);
}