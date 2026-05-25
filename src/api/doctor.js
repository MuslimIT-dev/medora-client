import { API } from '../constants/API';

export default async function getDocsList(page, count, filters) {
	try {
	  const params = new URLSearchParams();
	  params.append('page', page);
	  params.append('count', count);

	  if (filters.type) params.append('type', filters.type);
	  
	  if (filters.sort) params.append('sort', filters.sort);
	  if (filters.disease) params.append('disease', filters.disease); 
	  params.append('isOnline', filters.isOnline);
	  params.append('isOffline', filters.isOffline);
	  if (filters.experience) params.append('experience', filters.experience);
	  if (filters.priceFrom !== undefined)
		params.append('priceFrom', filters.priceFrom);
	  if (filters.priceTo !== undefined)
		params.append('priceTo', filters.priceTo);
	  if (filters.date) params.append('date', filters.date);
  
	  const res = await fetch(`${API}/doctors/?${params.toString()}`);
	  const json = await res.json();
  
	  if (!res.ok) {
		throw new Error(json.error || 'Failed to load doctors');
	  }
  
	  return json.data;
	} catch (err) {
	  console.error('getDocsList error:', err);
	  throw err;
	}
}

// GET description
export async function getDoctorDescription(id) {
	try {
		const res = await fetch(`${API}/doctors/${id}/desc`);
		if (!res.ok) throw new Error("Failed to fetch");

		const data = await res.json();

		return JSON.parse(data.data); // строка -> JSON
	} catch (err) {
		console.error(err);
		return null;
	}
}

// GET reviews
export async function getDoctorReviews(id, page, count) {
	try {
		const res = await fetch(
			`${API}/reviews?type=doctor&id=${id}&page=${page}&count=${count}`
		);

		if (!res.ok) throw new Error("Failed");

		return await res.json();
	} catch (err) {
		console.error(err);
		return null;
	}
}

export const getDoctorById = async (id) => {
    try {
        const response = await fetch(`${API}/doctors/${id}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Не удалось загрузить данные врача");
        }

        const result = await response.json();

        return result.data; 
    } catch (err) {
        console.error("Ошибка API (getDoctorById):", err);
        throw err;
    }
};