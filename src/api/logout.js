import { API } from "../constants/API.js";

export default async function logout(token) {
	await fetch(`${API}/auth/logout`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			refresh_token: localStorage.getItem("refresh_token")
		})
	});
}