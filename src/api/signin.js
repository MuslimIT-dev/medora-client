import { API } from "../constants/API.js";

export default async function signin(email, password) {
	const res = await fetch(`${API}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ email, password })
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message || "Ошибка входа");
	}

	return data;
}