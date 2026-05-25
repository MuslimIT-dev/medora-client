import { API } from '../constants/API';

const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

export async function fetchUserChats() {
    const res = await fetch(`${API}/chats`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to load chats");
    const result = await res.json();
    return result.data || [];
}

export async function fetchChatMessages(chatId) {
    const res = await fetch(`${API}/chats/${chatId}/messages`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to load messages");
    const result = await res.json();
    return result.data || [];
}
