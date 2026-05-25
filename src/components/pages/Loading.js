export default function Loading() {
	return (
		<div className="flex items-center justify-center h-screen">

			<div className="text-center">

				<div className="text-5xl animate-pulse mb-4">{"\u{1F3E5}"}</div>

				<h2 className="text-xl font-semibold">
					Загрузка...
				</h2>

				<p className="text-gray-500 text-sm mt-2">
					Пожалуйста, подождите
				</p>

				<div className="mt-4 flex justify-center">
					<div className="w-10 h-10 border-4 border-gray-200 border-t-pistachio-light rounded-full animate-spin"></div>
				</div>

			</div>

		</div>
	);
}