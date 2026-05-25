import { API } from "../constants/API.js";

export default async function me({ token, setUser, setLoading }) {
    try {
        const res = await fetch(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Unauthorized");
        }

        // IMPORTANT: Your Go code returns data directly: { "id": 1, "email": "..." }
        // So we set 'data', NOT 'data.data'
        setUser(data);
        
        // Save to localStorage so ChangeProfile.js can find the user ID
        localStorage.setItem("user", JSON.stringify(data));

    } catch (err) {
        console.log("ME error:", err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    } finally {
        setLoading(false);
    }
}