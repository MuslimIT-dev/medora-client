import { API } from "../constants/API.js";

export const MakeAppointment = async (payload, token) => {
    const response = await fetch(`${API}/appointments`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create appointment");
    }
    return response.json();
};

export const getVisits = async (userId, page = 1, count = 10, filters = {}) => {
    const params = new URLSearchParams({
        id: userId,
        type: "user",   
        page: page,
        count: count,
        ...filters
    });

    const response = await fetch(`${API}/appointments?${params}`);
    if (!response.ok) throw new Error("Failed to fetch visits");
    const result = await response.json();
    return result.data;
};

export const updateAppointment = async (payload) => {
    const response = await fetch(`${API}/appointments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to update");
    return response.json();
};

export const deleteAppointment = async (id, targetId, targetType) => {
    const response = await fetch(`${API}/appointments/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId, targetType }), 
    });
    if (!response.ok) throw new Error("Failed to delete");
    return response.json();
};

export async function completeAppointment(
	appointmentId,
	payload
) {
	const res = await fetch(
		`${API}/cabinet/doctor/appointments/${appointmentId}/complete`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem(
					"token"
				)}`,
				"Content-Type":
					"application/json"
			},
			body: JSON.stringify(
				payload
			)
		}
	);

	return res.json();
}