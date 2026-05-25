import { API } from '../constants/API';

const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

export const getMedcardData = async (endpoint, page = 1, count = 10) => {
    const res = await fetch(`${API}/medcard/${endpoint}?page=${page}&count=${count}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to load map data");
    return await res.json();
};

export const getAnalysisHistory = async (typeId) => {
    const res = await fetch(`${API}/medcard/analyses/${typeId}/history`, { headers: getHeaders() });
    const result = await res.json();
    return result.data || [];
};
