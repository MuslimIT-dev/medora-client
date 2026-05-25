import { API } from '../constants/API';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const getVerificationStatus = async (targetType, entityId) => {
    const res = await fetch(`${API}/cabinet/doctor/verification?target_type=${targetType}&entity_id=${entityId}`, {
        headers: getHeaders()
    });
    const result = await res.json();
    return result.data;
};

export const postVerificationBid = async (bidData) => {
    const res = await fetch(`${API}/cabinet/doctor/verification`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bidData)
    });
    return await res.json();
};

export const updateVerificationBid = async (bidId, description, documents) => {
    const res = await fetch(`${API}/cabinet/doctor/verification`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ bid_id: bidId, description, documents })
    });
    return await res.json();
};

export const deleteVerificationBid = async (bidId) => {
    const res = await fetch(`${API}/cabinet/doctor/verification/${bidId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return await res.json();
};
