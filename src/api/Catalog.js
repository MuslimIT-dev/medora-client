import { API } from "../constants/API";

function authHeaders() {
	return {
		Authorization: `Bearer ${localStorage.getItem("token")}`
	};
}

export async function getDiseases() {
	const res = await fetch(
		`${API}/catalog/diseases`,
		{
			headers: authHeaders()
		}
	);

	return res.json();
}

export async function getMedications() {
	const res = await fetch(
		`${API}/catalog/medications`,
		{
			headers: authHeaders()
		}
	);

	return res.json();
}

export async function getDirections() {
	const res = await fetch(
		`${API}/catalog/directions`,
		{
			headers: authHeaders()
		}
	);

	return res.json();
}

const fetchCatalogByType = async (type) => {
    try {
        const response = await fetch(`${API}/catalog/directions`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (!response.ok) throw new Error("Catalog fetch error");
        const res = await response.json();

        const items = (res.data || [])
            .filter(item => item.type === type)
            .map(item => item.name);

        return ["Все", ...items];
    } catch (err) {
        console.error(`Error loading catalog for ${type}:`, err);
        return ["Все"];
    }
};

export const getAnTypes = () => fetchCatalogByType("test");
export const getHosTypes = () => Promise.resolve(["Все", "Общая палата терапии", "Палата интенсивной реанимации"]);
export const getProcTypes = () => fetchCatalogByType("procedure");
export const getDocTypes = () => fetchCatalogByType("doctor");

export const getAnList = async (page = 1, count = 10, filters = {}) => {
    try {
        const params = new URLSearchParams({
            page: page,
            count: count,
            type: filters.type || "Все",
            sort: filters.sort || "рейтингу",
            priceFrom: filters.priceFrom !== undefined ? filters.priceFrom : 0,
            priceTo: filters.priceTo !== undefined ? filters.priceTo : 2000,
            date: filters.date || ""
        });

        const res = await fetch(`${API}/catalog/list/test?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch analyses");
        return json.data;
    } catch (err) {
        console.error("getAnList error:", err);
        throw err;
    }
};

export const getProcList = async (page = 1, count = 10, filters = {}) => {
    try {
        const params = new URLSearchParams({
            page: page,
            count: count,
            type: filters.type || "Все",
            sort: filters.sort || "рейтингу",
            priceFrom: filters.priceFrom !== undefined ? filters.priceFrom : 0,
            priceTo: filters.priceTo !== undefined ? filters.priceTo : 2000,
            date: filters.date || ""
        });

        const res = await fetch(`${API}/catalog/list/procedure?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch procedures");
        return json.data;
    } catch (err) {
        console.error("getProcList error:", err);
        throw err;
    }
};

export const getHosList = async (page = 1, count = 10, filters = {}) => {
    try {
        const params = new URLSearchParams({
            page: page,
            count: count,
            type: filters.type || "Все",
            sort: filters.sort || "рейтингу",
            priceFrom: filters.priceFrom !== undefined ? filters.priceFrom : 0,
            priceTo: filters.priceTo !== undefined ? filters.priceTo : 2000,
            date: filters.date || ""
        });

        const res = await fetch(`${API}/catalog/list/hospital?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch hospital stays");
        return json.data;
    } catch (err) {
        console.error("getHosList error:", err);
        throw err;
    }
};