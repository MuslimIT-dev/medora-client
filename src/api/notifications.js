import { API } from '../constants/API';

const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

export async function fetchNotifications() {
    const res = await fetch(`${API}/notifications`, { headers: getHeaders() });
    const result = await res.json();
    return result.data || [];
}

export async function markAsRead(id) {
    const res = await fetch(`${API}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getHeaders()
    });
    return res.json();
}
