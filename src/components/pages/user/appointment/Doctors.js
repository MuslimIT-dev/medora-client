import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import List from '../../../widgets/List.js';
import FilterBar from '../../../widgets/FilterBar.js';
import DocCard from '../../../dummies/DocCard.js';
import getDocsList from '../../../../api/doctor.js';
import { getDocTypes } from '../../../../api/Catalog.js';

export default function Doctors() {
	const location = useLocation();
	const [docTypes, setDocTypes] = useState([]);
	const [filters, setFilters] = useState({
		type: "Все",
		disease: 0,
		isOffline: true,
		isOnline: false,
		experience: "",
		priceFrom: 0,
		priceTo: 2000,
		date: "",
		directionId: 0
	});

	useEffect(() => {
		getDocTypes().then(types => {
			setDocTypes(types);
			
			const params = new URLSearchParams(location.search);
			const typeIndex = params.get("type");
			const searchStuff = params.get("search_stuff"); // Перехватываем ключ от ИИ
			const directionId = params.get("from_direction");

			if (typeIndex && types[Number(typeIndex)]) {
				setFilters(prev => ({
					...prev,
					type: types[Number(typeIndex)],
					directionId: directionId ? Number(directionId) : 0
				}));
			} else if (searchStuff) {
				setFilters(prev => ({
					...prev,
					type: searchStuff,
					directionId: 0
				}));
			}
		});
	}, [location.search]);


	const handleChange = (e) => {
		setFilters(prev => ({ ...prev, type: e.target.value }));
	};

	return (
		<div className="w-full max-w-full overflow-x-hidden px-1 sm:px-0">
			<h1 className="font-bold text-xl sm:text-2xl mb-4">Запись на прием</h1>
			
			{/* Переключение сетки: 1 колонка на мобильных, flex-col-reverse чтобы фильтр был сверху, на lg: grid из 4 колонок */}
			<div className="flex flex-col-reverse lg:grid lg:grid-cols-4 gap-4">
				
				{/* Список врачей: занимает всю ширину на мобильных и 3 колонки на десктопе */}
				<div className="w-full lg:col-span-3 flex flex-col gap-3">
					{/* w-64 заменен на max-w-xs и w-full для безопасности на узких экранах */}
					<select value={filters.type} onChange={handleChange} className="border border-pistachio-dark rounded-lg p-2 bg-white outline-none w-full max-w-xs text-xs font-semibold">
						{docTypes.map((type) => <option key={type} value={type}>{type}</option>)}
					</select>
					<h2 className="text-gray-500 text-xs font-medium">Фильтрация специалистов</h2>
					<List filters={filters} Card={DocCard} getList={getDocsList} />
				</div>
				
				{/* Панель фильтров: занимает всю ширину на мобильных и 1 колонку на десктопе */}
				<div className="w-full lg:col-span-1">
					<FilterBar filters={filters} setFilters={setFilters} isEx={true} />
				</div>

			</div>
		</div>
	);
}
