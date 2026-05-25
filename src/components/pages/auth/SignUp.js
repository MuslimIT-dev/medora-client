import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import signup from "../../../api/signup.js";

export default function SignUp() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [fullname, setFullname] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [gender, setGender] = useState("male");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async () => {
		setError("");

		if (!fullname || !birthDate || !phone || !email || !password || !confirmPassword) {
			setError("Заполните все обязательные поля");
			return;
		}

		if (!email.includes("@")) {
			setError("Введите корректный email");
			return;
		}

		if (password !== confirmPassword) {
			setError("Пароли не совпадают");
			return;
		}

		if (password.length < 4) {
			setError("Пароль должен быть не менее 4 символов");
			return;
		}

		try {
			const userData = await signup(fullname, birthDate, gender, email, password, phone);

			login(userData);
			navigate("/");
		} catch (err) {
			setError(err.message || "Ошибка регистрации");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50 py-10 px-4">
			<form
				className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-3 w-full max-w-sm"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<h2 className="text-xl font-bold text-center text-pistachio-dark mb-2">
					Регистрация аккаунта
				</h2>

				<label className="text-xs font-bold text-gray-400 -mb-1">ЛИЧНЫЕ ДАННЫЕ</label>
				<input
					placeholder="ФИО полностью"
					value={fullname}
					onChange={e => setFullname(e.target.value)}
					className="border p-2 rounded outline-none focus:ring-2 focus:ring-pistachio-light text-sm"
				/>

				<div className="grid grid-cols-2 gap-2">
					<div>
						<label className="text-[10px] font-bold text-gray-400 block mb-0.5">ДАТА РОЖДЕНИЯ</label>
						<input
							type="date"
							value={birthDate}
							onChange={e => setBirthDate(e.target.value)}
							className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-pistachio-light text-sm"
						/>
					</div>
					<div>
						<label className="text-[10px] font-bold text-gray-400 block mb-0.5">ПОЛ</label>
						<select
							value={gender}
							onChange={e => setGender(e.target.value)}
							className="w-full border p-2.5 rounded outline-none focus:ring-2 focus:ring-pistachio-light text-sm bg-white"
						>
							<option value="male">Мужской</option>
							<option value="female">Женский</option>
						</select>
					</div>
				</div>

				<input
					placeholder="Телефон (например, +992...)"
					type="tel"
					value={phone}
					onChange={e => setPhone(e.target.value)}
					className="border p-2 rounded outline-none focus:ring-2 focus:ring-pistachio-light text-sm"
				/>

				<label className="text-xs font-bold text-gray-400 mt-2 -mb-1">ДАННЫЕ ДЛЯ ВХОДА</label>
				<input
					placeholder="Email"
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					className="border p-2 rounded outline-none focus:ring-2 focus:ring-pistachio-light text-sm"
				/>

				<input
					type="password"
					placeholder="Пароль"
					value={password}
					onChange={e => setPassword(e.target.value)}
					className="border p-2 rounded outline-none focus:ring-2 focus:ring-pistachio-light text-sm"
				/>

				<input
					type="password"
					placeholder="Повторите пароль"
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.target.value)}
					className="border p-2 rounded outline-none focus:ring-2 focus:ring-pistachio-light text-sm"
				/>

				{error && (
					<div className="text-red-500 text-xs font-semibold text-center py-1">
						{error}
					</div>
				)}

				<button
					type="submit"
					className="bg-pistachio-light text-white p-2.5 rounded font-bold text-sm mt-2 hover:bg-pistachio-dark transition"
				>
					Создать аккаунт
				</button>
			</form>
		</div>
	);
}
