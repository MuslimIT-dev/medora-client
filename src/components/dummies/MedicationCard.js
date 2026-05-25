export default function MedicationCard({ Data }) {

	const statusColor = {
		"Активно": "bg-green-400",
		"Завершено": "bg-gray-400"
	};

	return (
		<div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col gap-2">

			<h2 className="text-lg font-semibold">
				💊 {Data.name}
			</h2>

			<p className="text-sm text-gray-600">
				{Data.dosage} • {Data.frequency}
			</p>

			<p className="text-xs text-gray-500">
				Курс: {Data.duration}
			</p>

			{Data.doctor && (
				<p className="text-xs text-gray-500">
					👨‍⚕️ {Data.doctor}
				</p>
			)}

			<div className="flex justify-between items-center mt-2">

				<span className={`text-xs text-white px-2 py-0.5 rounded ${statusColor[Data.status]}`}>
					{Data.status}
				</span>

				<span className="text-xs text-gray-400">
					{Data.startDate}
				</span>

			</div>

		</div>
	);
}