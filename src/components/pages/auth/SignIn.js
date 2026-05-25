import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import signin from "../../../api/signin.js";

export default function SignIn() {

	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const handleSubmit = async () => {

		setError("");

		if (!email || !password) {
			setError("Заполните все поля");
			return;
		}

		try {
			const user = await signin(email, password);

			login(user);
			navigate("/");

		} catch (err) {
			setError(err.message || "Ошибка входа");
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-50">
			<form 
				className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-3 w-80"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>

				<h2 className="text-xl font-bold text-center">Вход</h2>

				<input
					placeholder="Email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					className="border p-2 rounded outline-none focus:ring-2 focus:ring-pistachio-light"
				/>

				<input
					type="password"
					placeholder="Пароль"
					value={password}
					onChange={e => setPassword(e.target.value)}
					className="border p-2 rounded outline-none focus:ring-2 focus:ring-pistachio-light"
				/>

				{error && (
					<div className="text-red-500 text-sm text-center">
						{error}
					</div>
				)}

				<button
					type="submit"
					className="bg-pistachio-light text-white p-2 rounded hover:scale-[1.02] transition"
				>
					Войти
				</button>

				<div className="text-sm text-center text-gray-500 mt-2">
					Нет аккаунта?{" "}
					<Link
						to="/signup"
						className="text-pistachio-dark font-semibold hover:underline"
					>
						Зарегистрироваться
					</Link>
				</div>

			</form>
		</div>
	);
}