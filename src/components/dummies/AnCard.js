import { Link } from 'react-router-dom';

export default function AnCard({ Data }) {
	return (
		<div className="group relative grid grid-cols-6 gap-4 p-4 shadow-md rounded-lg text-sm hover:shadow-lg transition">

			<div className="col-span-1">
				<img src={Data.image || ""} alt="analysis" />
			</div>

			<div className="col-span-3 flex flex-col gap-1">
				<h2 className="text-xl font-semibold">{Data.name}</h2>

				<p className="text-yellow-500 text-sm">
					{"\u{2B50}"} {Data.rating} ({Data.reviews} отзывов)
				</p>

				<p className="text-gray-500">
					{Data.type} • {Data.clinic}
				</p>

				{Data.description && (
					<p className="text-gray-400 text-xs line-clamp-2">
						{Data.description}
					</p>
				)}

				{Data.preparation && (
					<div className="flex gap-1 flex-wrap mt-1">
						<span className="font-semibold">Подготовка:</span>
						<span className="text-xs bg-yellow-100 px-2 rounded">
							{Data.preparation}
						</span>
					</div>
				)}
			</div>

			<div className="col-span-2 flex flex-col justify-between">

				<div className="flex justify-between">
					<p className="text-gray-500">
						{Data.duration && `${Data.duration} мин`}
					</p>

					<p className="font-bold text-lg">
						{Data.price} смн
					</p>
				</div>

				{Data.freeDates?.length > 0 && (
					<div className="flex flex-col gap-1">
						<p className="font-bold">Ближайшее время:</p>

						<div className="flex flex-wrap gap-1">
							{Data.freeDates.map((date, i) => (
								<div
									key={i}
									className="px-2 py-0.5 rounded-md bg-green-400 text-white text-xs"
								>
									{date}
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="hidden group-hover:flex absolute right-4 bottom-4 gap-2">
				<Link
					className="bg-white shadow-md rounded-lg p-2 hover:bg-pistachio-light hover:text-white hover:scale-[1.05]"
					to={`/appointment/analysis/${Data.id}`}
					state={{ cardData: Data }}
				>
					Записаться
				</Link>

				<Link
					className="bg-white shadow-md rounded-lg p-2 hover:bg-pistachio-light hover:text-white hover:scale-[1.05]"
					to={`/analysis/${Data.id}`}
				>
					Подробнее
				</Link>
			</div>
		</div>
	);
}