import { Link } from 'react-router-dom';

export default function ErrorPage() {
	return (
		<div className="flex items-center justify-center h-full py-20">

			<div className="text-center p-10 bg-white shadow-md rounded-2xl max-w-md w-full">

				<div className="text-6xl mb-4">{"\u{26A0}\u{FE0F}"}</div>

				<h1 className="text-3xl font-bold mb-2">
					404
				</h1>

				<p className="text-gray-500 mb-6">
					Страница не найдена или была перемещена.
				</p>

				<Link
					to="/"
					className="inline-block bg-pistachio-light text-white px-4 py-2 rounded-lg hover:scale-[1.03] transition"
				>
					Вернуться на главную
				</Link>

			</div>
		</div>
	);
}