import { API } from "../constants/API.js";

export default async function signup(fullname, birthDate, gender, email, password, phone) {
	const res = await fetch(`${API}/auth/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			fullname,
			birth_date: birthDate,
			gender,
			email,
			password,
			phone
		})
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Ошибка регистрации");
	}

	return data;
}
