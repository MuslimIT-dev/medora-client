export default function FilterBar({ filters, setFilters, isEx}) {

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		setFilters(prev => ({
			...prev,
			[name]: type === "checkbox" ? checked : value
		}));
	};

	const handlePriceFrom = (e) => {
		const value = Number(e.target.value);

		if (value <= filters.priceTo) {
			setFilters(prev => ({
				...prev,
				priceFrom: value
			}));
		}
	};

	const handlePriceTo = (e) => {
		const value = Number(e.target.value);

		if (value >= filters.priceFrom) {
			setFilters(prev => ({
				...prev,
				priceTo: value
			}));
		}
	};

	return(
		<div className="flex flex-col gap-2 shadow-md rounded-lg text-sm p-3 sticky top-24 z-50 bg-white">

			<h1 className="font-bold text-xl">Фильтр</h1>

			<p>Сортировка по:</p>
			<select
				name="sort"
				value={filters.sort}
				onChange={handleChange}
				className="border border-pistachio-dark rounded-lg pb-1"
			>
				<option value="рейтингу">рейтингу</option>
				<option value="стажу">стажу</option>
				<option value="цене">цене</option>
			</select>

			<div>
				<p>Тип приёма:</p>

				<input
					name="inClinic"
					type="checkbox"
					checked={filters.inClinic}
					onChange={handleChange}
				/>
				<label className="ml-1">В клинике</label><br/>

				<input
					name="online"
					type="checkbox"
					checked={filters.online}
					onChange={handleChange}
				/>
				<label className="ml-1">Онлайн</label>
			</div>
			{isEx && (
			<>
			<p>Стаж больше:</p>
			<input
				name="experience"
				value={filters.experience}
				onChange={handleChange}
				className="border border-pistachio-dark rounded-lg px-1"
				type="number"
				min="1" />
			</>)}		

			<p>Цена:</p>

			<div className="flex flex-col gap-1">
				<span>{filters.priceFrom} — {filters.priceTo}</span>

				<input
					type="range"
					min="0"
					max="2000"
					step="10"
					name="priceFrom"
					value={filters.priceFrom}
					onChange={handlePriceFrom}
				/>

				<input
					type="range"
					min="0"
					max="2000"
					step="10"
					name="priceTo"
					value={filters.priceTo}
					onChange={handlePriceTo}
				/>
			</div>

			<p>Ближайшая дата:</p>
			<input
				name="date"
				value={filters.date}
				onChange={handleChange}
				className="border border-pistachio-dark rounded-lg pb-1"
				type="date"
			/>

		</div>
	);
}