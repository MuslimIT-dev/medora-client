import { API } from '../constants/API';

export async function getAllDiseases() {
    const res = await fetch(`${API}/diseases`, {
        method: 'GET'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch diseases');
    return data.data;
}

export async function postDisease(diseaseData) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/diseases`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },

        body: JSON.stringify(diseaseData) 
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to post disease');
    return data;
}
