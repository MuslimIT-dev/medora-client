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
		/* sticky top-24 работает теперь только на больших экранах (lg:), чтобы на мобильных фильтр не залипал при прокрутке */
		<div className="flex flex-col gap-2 shadow-md rounded-lg text-sm p-3 lg:sticky lg:top-24 z-50 bg-white w-full box-border">

			<h1 className="font-bold text-lg sm:text-xl">Фильтр</h1>

			<p>Сортировка по:</p>
			<select
				name="sort"
				value={filters.sort}
				onChange={handleChange}
				className="border border-pistachio-dark rounded-lg pb-1 p-1 bg-white w-full max-w-md"
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
				className="border border-pistachio-dark rounded-lg px-2 py-0.5 w-full max-w-xs"
				type="number"
				min="1" />
			</>)}		

			<p>Цена:</p>

			<div className="flex flex-col gap-1 w-full">
				<span>{filters.priceFrom} — {filters.priceTo}</span>

				<input
					type="range"
					min="0"
					max="2000"
					step="10"
					name="priceFrom"
					value={filters.priceFrom}
					onChange={handlePriceFrom}
					className="w-full accent-pistachio-dark"
				/>

				<input
					type="range"
					min="0"
					max="2000"
					step="10"
					name="priceTo"
					value={filters.priceTo}
					onChange={handlePriceTo}
					className="w-full accent-pistachio-dark"
				/>
			</div>

			<p>Ближайшая дата:</p>
			<input
				name="date"
				value={filters.date}
				onChange={handleChange}
				className="border border-pistachio-dark rounded-lg p-1 w-full max-w-md bg-white"
				type="date"
			/>

		</div>
	);
}
