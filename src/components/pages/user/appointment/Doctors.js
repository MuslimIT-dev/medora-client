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
		<div>
			<h1 className="font-bold text-2xl mb-4">Запись на прием</h1>
			<div className="grid grid-cols-4 gap-4">
				<div className="col-span-3 flex flex-col gap-3">
					<select value={filters.type} onChange={handleChange} className="border border-pistachio-dark rounded-lg p-2 bg-white outline-none w-64 text-xs font-semibold">
						{docTypes.map((type) => <option key={type} value={type}>{type}</option>)}
					</select>
					<h2 className="text-gray-500 text-xs font-medium">Фильтрация специалистов</h2>
					<List filters={filters} Card={DocCard} getList={getDocsList} />
				</div>
				<div className="col-span-1">
					<FilterBar filters={filters} setFilters={setFilters} isEx={true} />
				</div>
			</div>
		</div>
	);
}
