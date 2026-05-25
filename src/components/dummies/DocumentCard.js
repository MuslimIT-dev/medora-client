export default function DocumentCard({ Data }) {

	const statusColor = {
		"Готово": "bg-green-400",
		"Подписано": "bg-blue-400",
		"Ожидает": "bg-yellow-400"
	};

	return (
		<div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col gap-2">

			<h2 className="text-lg font-semibold flex items-center gap-2">
				📄 {Data.name}
			</h2>

			<p className="text-xs text-gray-500">
				{Data.type}
			</p>

			<div className="text-sm text-gray-600">
				{Data.doctor && <p>👨‍⚕️ {Data.doctor}</p>}
				{Data.clinic && <p>🏥 {Data.clinic}</p>}
			</div>

			<div className="flex justify-between items-center mt-2">

				<span className={`text-xs text-white px-2 py-0.5 rounded ${statusColor[Data.status]}`}>
					{Data.status}
				</span>

				<span className="text-xs text-gray-400">
					{Data.date}
				</span>

			</div>

			<div className="flex gap-2 mt-3">
				<button className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">
					Открыть
				</button>

				<button className="text-xs px-3 py-1 rounded bg-pistachio-light text-white hover:scale-[1.03] transition">
					Скачать
				</button>
			</div>

		</div>
	);
}