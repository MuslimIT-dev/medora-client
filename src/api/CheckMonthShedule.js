import { API } from "../constants/API";

export default async function CheckMonthShedule({ type, id, branchId, month, year }) {
    try {
        const params = new URLSearchParams({
            branch: branchId || 0,
            month: month,
            year: year
        });

        const res = await fetch(`${API}/schedule/${type}/${id}?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        if (!res.ok) throw new Error("Failed to load schedule");
        const result = await res.json();
        
        const freeDays = [];
        const times = {};

        if (result && result.data) {
            result.data.forEach(item => {
                const dayNum = item.day !== undefined ? item.day : item.Day;
                const clocksArr = item.clocks !== undefined ? item.clocks : item.Clocks;

                if (dayNum !== undefined && clocksArr) {
                    freeDays.push(Number(dayNum));
                    times[dayNum] = clocksArr;
                }
            });
        }

        return { freeDays, times };
    } catch (err) {
        console.error("CheckMonthShedule API error:", err);
        return { freeDays: [], times: {} };
    }
}
