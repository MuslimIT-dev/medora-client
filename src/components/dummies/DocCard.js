import { Link, useLocation } from 'react-router-dom';
import { useState, useMemo } from 'react';

export default function DocCard({ Data }) {
  const location = useLocation();
  const [hoveredDisease, setHoveredDisease] = useState(null);

  const urlParams = new URLSearchParams(location.search);
  const directionId = urlParams.get("from_direction");

  const targetLink = directionId ? `/appointment/doctor/${Data.id}?from_direction=${directionId}` : `/appointment/doctor/${Data.id}`;

  const clinicNames = Data.clinics?.map((c) => c.name).join(", ");

  const prices = useMemo(() => {
    const acc = { online: [], offline: [] };
    if (!Data.clinics) return acc;
    
    Data.clinics.forEach(curr => {
      if (curr.prices?.online !== null && curr.prices?.online !== undefined) {
        acc.online.push(curr.prices.online);
      }
      if (curr.prices?.offline !== null && curr.prices?.offline !== undefined) {
        acc.offline.push(curr.prices.offline);
      }
    });
    return acc;
  }, [Data.clinics]);

  const minOnline = prices.online.length > 0 ? Math.min(...prices.online) : null;
  const minOffline = prices.offline.length > 0 ? Math.min(...prices.offline) : null;
  
  const maxPrice = useMemo(() => {
    const allPrices = [...prices.online, ...prices.offline];
    return allPrices.length > 0 ? Math.max(...allPrices) : 0;
  }, [prices]);

  return (
    <div className="group relative grid grid-cols-6 gap-4 p-4 shadow-md rounded-lg text-sm hover:shadow-lg transition bg-white">
      <div className="col-span-1 w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-3xl">
        <img
          src={Data.image || "https://pngtree.com"}
          alt="Doctor"
          className="w-full h-20 object-cover rounded-md"
        />
      </div>

      <div className="col-span-3 flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{Data.name}</h2>
        <p className="text-gray-500 text-sm">
          {Data.stuff} {clinicNames ? `• ${clinicNames}` : ""}
        </p>
        <p className="text-yellow-500 text-sm">
          {"\u{2B50}"} {Data.aveRate ? Data.aveRate.toFixed(1) : "0.0"} ({Data.reviews || 0} отзывов)
        </p>

        {Data.diseases?.length > 0 && (
          <div className="flex flex-col gap-1 mt-1 relative">
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-500">Лечит:</span>
              {Data.diseases.map((d) => (
                <span
                  key={d.id}
                  onMouseEnter={() => setHoveredDisease(d)}
                  onMouseLeave={() => setHoveredDisease(null)}
                  className="text-white px-2 py-0.5 rounded-md bg-pistachio-light text-xs cursor-pointer"
                >
                  {d.name}
                </span>
              ))}
            </div>
            {hoveredDisease && (
              <div className="absolute top-full mt-1 bg-white shadow-md rounded-md p-2 text-xs z-10 max-w-xs border border-gray-100">
                {hoveredDisease.description}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="col-span-2 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <p className="text-gray-500 text-sm">{Data.experience} лет стажа</p>
          <div className="font-semibold text-right text-sm">
            {minOffline !== null && <p>Клиника от {minOffline} смн</p>}
            {minOnline !== null && <p>Онлайн от {minOnline} смн</p>}
            {maxPrice > 0 && (
              <p className="text-gray-400 font-normal text-xs">
                Макс: {maxPrice} смн
              </p>
            )}
          </div>
        </div>

        {Data.freeDates?.length > 0 && (
          <div className="flex flex-col gap-1 mt-2">
            <p className="font-semibold text-xs">Ближайшее время:</p>
            <div className="flex flex-wrap gap-1">
              {Data.freeDates.map((date, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-green-400 text-white text-xs"
                >
                  {date}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="hidden group-hover:flex absolute right-4 bottom-4 gap-2">
        <Link
          className="bg-white shadow-md rounded-lg px-3 py-1 hover:bg-pistachio-light hover:text-white transition"
          to={targetLink}
          state={{ cardData: Data }}
        >
          Записаться
        </Link>
        <Link
          className="bg-white shadow-md rounded-lg px-3 py-1 hover:bg-pistachio-light hover:text-white transition"
          to={`/doctors/${Data.id}`}
          state={{ cardData: Data }}
        >
          О враче
        </Link>
      </div>
    </div>
  );
}