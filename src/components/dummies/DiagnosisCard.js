export default function DiagnosisCard({ Data }) {
	return (
		<div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col gap-2">

			<h2 className="text-lg font-semibold">
				{Data.name}
			</h2>

			<div className="flex gap-2 text-xs">
				<span className="px-2 py-0.5 bg-gray-100 rounded">
					{Data.type}
				</span>

				<span className="px-2 py-0.5 bg-pistachio-light text-white rounded">
					{Data.status}
				</span>
			</div>

			<p className="text-gray-500 text-sm">
				{Data.description}
			</p>

			<div className="flex justify-between text-xs text-gray-400 mt-2">
				<span>{Data.doctor}</span>
				<span>{Data.date}</span>
			</div>

		</div>
	);
}