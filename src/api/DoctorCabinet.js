import { API } from '../constants/API';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

/**
 * Creates or updates a doctor's professional profile
 * POST /api/cabinet/doctor/profile
 */
export async function postDoctorProfile(doctorData) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/cabinet/doctor/profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(doctorData)
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Failed to save doctor profile');
    }
    return data;
}

/**
 * Fetches the doctor's profile data for the cabinet
 * GET /api/cabinet/doctor/profile?id=X
 */
export async function getDoctorProfile(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/cabinet/doctor/profile?id=${id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        if (data.error === "profile_not_found") return null; 
        throw new Error(data.error || 'Failed to load profile');
    }
    return data.data;
}

export async function updateDocProfile(doctorData) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/cabinet/doctor/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(doctorData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update doctor profile');
    return data.data;
}

export const getDoctorAppointments = async (doctorId, page = 1, count = 10, filters = {}) => {
    const params = new URLSearchParams({
        id: doctorId,
        type: "doctor",
        page: page,
        count: count,
        ...filters
    });
    const response = await fetch(`${API}/appointments?${params}`, { headers: getHeaders() });
    const result = await response.json();
    return result.data;
};

export const createIndShedule = async (payload) => {
    const res = await fetch(`${API}/cabinet/doctor/online-shedule`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
};

export const getIndShedule = async (doctorId) => {
    const res = await fetch(`${API}/cabinet/doctor/online-shedule?id=${doctorId}`, {
        method: 'GET',
        headers: getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to fetch schedule");
    return result.data;
};

export const deleteIndShedule = async (doctorId) => {
    const res = await fetch(`${API}/cabinet/doctor/online-shedule/${doctorId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return res.json();
};

export const getDoctorPatients = async (page = 1, count = 10) => {
    const res = await fetch(`${API}/cabinet/doctor/patients?page=${page}&count=${count}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) throw new Error("Не удалось загрузить список пациентов");
    return await res.json();
};

export const fetchPatientMedcardForDoctor = async (patientId) => {
    const res = await fetch(`${API}/cabinet/doctor/patients/${patientId}/medcard`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) throw new Error("Не удалось загрузить медицинскую карту пациента");
    const result = await res.json();
    return result.data;
};