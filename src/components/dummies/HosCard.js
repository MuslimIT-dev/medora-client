import { Link } from 'react-router-dom';

export default function StayCard({ Data }) {
	return (
		<div className="group relative grid grid-cols-6 gap-4 p-4 shadow-md rounded-lg text-sm hover:shadow-lg transition">

			<div className="col-span-1">
				<img
					src={Data.image || ""}
					alt="Stay"
					className="w-full h-20 object-cover rounded-md"
				/>
			</div>

			<div className="col-span-3 flex flex-col gap-1">

				<h2 className="text-lg font-semibold">{Data.name}</h2>

				<p className="text-gray-500 text-sm">
					{Data.type} • {Data.clinic}
				</p>

				<p className="text-yellow-500 text-sm">
					{"\u{2B50}"} {Data.rating} ({Data.reviews} отзывов)
				</p>

				<p className="text-gray-500 text-xs">
					Мин. срок: {Data.minDays} дней
				</p>

				{Data.features?.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-1">
						{Data.features.map((f, i) => (
							<span
								key={i}
								className="text-white px-2 py-0.5 rounded-md bg-pistachio-light text-xs"
							>
								{f}
							</span>
						))}
					</div>
				)}

			</div>

			<div className="col-span-2 flex flex-col justify-between">

				<div className="flex justify-between items-start">
					<p className="text-gray-500 text-sm">
						{Data.duration && `${Data.duration} дней`}
					</p>

					<p className="font-semibold text-sm">
						от {Data.price} смн / день
					</p>
				</div>

				{Data.availableDates?.length > 0 && (
					<div className="flex flex-col gap-1 mt-2">
						<p className="font-semibold text-xs">
							Ближайшие заезды:
						</p>

						<div className="flex flex-wrap gap-1">
							{Data.availableDates.map((date, i) => (
								<span
									key={i}
									className="px-2 py-0.5 rounded-md bg-green-400 text-white text-xs"
								>
									{date}
								</span>
							))}
						</div>
					</div>
				)}

			</div>

			<div className="hidden group-hover:flex absolute right-4 bottom-4 gap-2">

				<Link
					className="bg-white shadow-md rounded-lg px-3 py-1 hover:bg-pistachio-light hover:text-white transition"
					to={`/appointment/hospital/${Data.id}`}
					state={{ cardData: Data }}
				>
					Забронировать
				</Link>

				<Link
					className="bg-white shadow-md rounded-lg px-3 py-1 hover:bg-pistachio-light hover:text-white transition"
					to={`/hospitals/${Data.id}`}
				>
					Подробнее
				</Link>

			</div>

		</div>
	);
}