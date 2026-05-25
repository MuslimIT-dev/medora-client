import { API } from "../constants/API.js";

export const checkUserRoles = async (userId) => {
    try {
        const response = await fetch(`${API}/user/roles/check?id=${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await response.json();
        return result.data; // Returns { isDoctor: true, isDirector: false, ... }
    } catch (err) {
        console.error("Role check failed", err);
        return { isDoctor: false, isDirector: false, isAdmin: false };
    }
};
