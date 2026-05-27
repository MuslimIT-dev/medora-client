import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import DocCard from '../../../dummies/DocCard.js';
import AnCard from '../../../dummies/AnCard.js';
import ProcCard from '../../../dummies/ProcCard.js';
import HosCard from '../../../dummies/HosCard.js';

import SheduleCard from '../../../dummies/SheduleCard.js';
import OrderSummary from '../../../widgets/OrderSummary.js';
import { getDoctorById } from '../../../../api/doctor.js';
import { API } from '../../../../constants/API.js';

const getServiceItemById = async (type, id) => {
    const targetType = type === "hospital" ? "hospital" : type;
    const res = await fetch(`${API}/catalog/${targetType}/${id}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to load catalog item data");
    }
    const result = await res.json();
    return result.data;
};

const FETCH_MAP = {
    doctor: getDoctorById,
    test: (id) => getServiceItemById("test", id),
    procedure: (id) => getServiceItemById("procedure", id),
    hospital: (id) => getServiceItemById("hospital", id)
};

const AppointmentPage = () => {
  const { type, id } = useParams();
  const location = useLocation();

  const [cardData, setCardData] = useState(location.state?.cardData || null);
  const [loading, setLoading] = useState(!cardData);

  const urlParams = new URLSearchParams(location.search);
  const directionIdFromUrl = urlParams.get("from_direction");

  console.log("DEBUG [AppointmentPage]: directionId из URL =", directionIdFromUrl);

  const [aptData, setAptData] = useState({
      type: type,
      id: id,
      hospitalId: 0,
      date: "",
      time: "",
      directionId: directionIdFromUrl ? Number(directionIdFromUrl) : 0,
  });

  const [selectedClinicId, setSelectedClinicId] = useState(null);

  useEffect(() => {
      if (!cardData) {
          const fetchData = FETCH_MAP[type];
          if (fetchData) {
              setLoading(true);
              fetchData(id)
                  .then(data => {
                      setCardData(data);
                      setLoading(false)
                  })
                  .catch(err => {
                      console.error("Fetch error:", err);
                      setLoading(false);
                  });
          }
      }
  }, [id, type, cardData]);

  useEffect(() => {
      if (cardData?.clinics?.length > 0) {
          setSelectedClinicId(cardData.clinics[0].id);
      } else if (cardData && !cardData.clinics) {
          const mockClinicId = cardData.branch_id || cardData.branchId || 1;
          setSelectedClinicId(mockClinicId);
          setCardData(prev => ({
              ...prev,
              clinics: [{ id: mockClinicId, name: prev.clinic || "Главный филиал Medora", address: prev.address || "ул. Бухоро 12" }]
          }));
      }
  }, [cardData]);

  useEffect(() => {
      if (selectedClinicId !== null) {
          setAptData(prev => ({ ...prev, hospitalId: Number(selectedClinicId) }));
      }
  }, [selectedClinicId]);

  if (loading) return <div className="p-10 text-center">Загрузка...</div>;
  if (!cardData) return <div className="p-10 text-center">Данные не найдены</div>;

  const CARD_MAP = {
      doctor: DocCard,
      test: AnCard,
      procedure: ProcCard,
      hospital: HosCard
  };
  
  const CardComponent = CARD_MAP[type] || DocCard;

  return (
      <div className="w-full max-w-full overflow-x-hidden px-1 sm:px-0">
          <h1 className="font-bold text-xl sm:text-2xl">Запись: {type}</h1>
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-8 py-4">
              <main className="w-full lg:col-span-3 flex flex-col">
                  <div className="w-full overflow-x-hidden">
                      <CardComponent Data={cardData} />
                  </div>

                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 shadow-md rounded-lg bg-white w-full box-border">
                      <h3 className="font-bold mb-2 text-sm sm:text-base">Выберите место:</h3>
                      <select 
                          className="w-full p-2 border rounded bg-white outline-none text-sm sm:text-base"
                          value={selectedClinicId || ""}
                          onChange={(e) => setSelectedClinicId(e.target.value)}
                      >
                          {cardData.clinics?.map((c) => (
                              <option key={c.id} value={c.id}>{c.name} {c.address ? `— ${c.address}` : ""}</option>
                          ))}
                      </select>
                  </div>

                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 shadow-md rounded-lg bg-white w-full box-border overflow-x-auto">
                      <h3 className="font-bold mb-2 text-sm sm:text-base">Дата и время:</h3>
                      <SheduleCard type={type} id={id} aptData={aptData} setAptData={setAptData} />
                  </div>
              </main>

              <aside className="w-full lg:col-span-1">
                  <OrderSummary 
                      aptData={aptData} 
                      cardData={cardData} 
                      selectedClinicId={selectedClinicId}
                  />
              </aside>
          </div>
      </div>
  );
};

export default AppointmentPage;
                          
