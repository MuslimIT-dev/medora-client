export default function AnalysesCard({ Data }) {
	return (
		<div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col gap-2">

			<h2 className="text-lg font-semibold">
				🧪 {Data.name}
			</h2>

			<div className="flex gap-2 text-xs">
				<span className="px-2 py-0.5 bg-gray-100 rounded">
					{Data.type}
				</span>

				<span className="px-2 py-0.5 bg-pistachio-light text-white rounded">
					{Data.status}
				</span>
			</div>

			<p className="text-sm">
				Результат: <span className="font-semibold">{Data.result}</span>
			</p>

			{Data.values?.length > 0 && (
				<div className="mt-2 flex flex-col gap-1 text-xs">
					{Data.values.map((val, i) => (
						<div key={i} className="flex justify-between">
							<span>{val.name}</span>
							<span>
								{val.value} <span className="text-gray-400">({val.norm})</span>
							</span>
						</div>
					))}
				</div>
			)}

			<div className="flex justify-between text-xs text-gray-400 mt-2">
				<span>{Data.clinic}</span>
				<span>{Data.date}</span>
			</div>

		</div>
	);
}