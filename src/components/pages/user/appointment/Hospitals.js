import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import List from '../../../widgets/List.js';
import FilterBar from '../../../widgets/FilterBar.js';
import HosCard from '../../../dummies/HosCard.js';
import { getHosList, getHosTypes } from '../../../../api/Catalog.js';

export default function Hospitals() {
	const location = useLocation();
	const [hosTypes, setHosTypes] = useState([]);
	const [filters, setFilters] = useState({
		type: "Все",
  		sort: "рейтингу",
  		inClinic: true,
  		online: false,
  		priceFrom: 0,
  		priceTo: 2000,
  		date: "",
		directionId: 0
	});

	useEffect(() => {
		getHosTypes().then(types => {
			setHosTypes(types);
			
			const params = new URLSearchParams(location.search);
			const typeIndex = params.get("type");
			const directionId = params.get("from_direction");

			if (typeIndex && types[Number(typeIndex)]) {
				setFilters(prev => ({
					...prev,
					type: types[Number(typeIndex)],
					directionId: directionId ? Number(directionId) : 0
				}));
			} else if (directionId) {
				setFilters(prev => ({ ...prev, directionId: Number(directionId) }));
			}
		});
	}, [location.search]);

	const handleChange = (e) => {
		setFilters(prev => ({ ...prev, type: e.target.value }));
	};

	return (
		<div>
			<h1 className="font-bold text-2xl mb-4">Запись на стационар</h1>
			<div className="grid grid-cols-4 gap-4">
				<div className="col-span-3 flex flex-col gap-3">
					<select value={filters.type} onChange={handleChange} className="border border-pistachio-dark rounded-lg p-2 bg-white outline-none w-64 text-xs font-semibold">
						{hosTypes.map((type) => <option key={type} value={type}>{type}</option>)}
					</select>
					<h2 className="text-gray-500 text-xs font-medium">Сортировка по {filters.sort}</h2>
					<List filters={filters} Card={HosCard} getList={getHosList}/>
				</div>
				<div className="col-span-1">
					<FilterBar filters={filters} setFilters={setFilters} isEx={false}/>
				</div>
			</div>
		</div>
	);
}
