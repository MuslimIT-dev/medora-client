import { useState, useEffect } from "react";
import { postDisease } from "../../api/Diseases";
import { getDiseases, getMedications, getDirections } from "../../api/Catalog";

export default function DocProtocolForm({ form, setForm, onClose, onSubmit }) {
	const [allDiseases, setAllDiseases] = useState([]);
	const [catalogMeds, setCatalogMeds] = useState([]);
	const [catalogDirections, setCatalogDirections] = useState([]);
	const [illnessSearch, setIllnessSearch] = useState("");
	const [catalogSpecialties, setCatalogSpecialties] = useState([]);
	const [catalogTests, setCatalogTests] = useState([]);
	const [catalogProcedures, setCatalogProcedures] = useState([]);

	useEffect(() => {
		getDiseases().then(res => setAllDiseases(res.data || res || [])).catch(console.error);
		getMedications().then(res => setCatalogMeds(res.data || res || [])).catch(console.error);

		getDirections()
			.then(res => {
				const rawData = res.data || res || [];
				setCatalogSpecialties(rawData.filter(c => c.type === "doctor"));
				setCatalogTests(rawData.filter(c => c.type === "test"));
				setCatalogProcedures(rawData.filter(c => c.type === "procedure"));
			})

			.catch(console.error);

		setForm(prev => {
			const current = prev || {};
			return {
				diseases: current.diseases || [],
				medications: current.medications || [],
				directions: current.directions || []
			};
		});
	}, [setForm]);

	const handleAddIllness = async (e) => {
		if (e.key === 'Enter' && illnessSearch.trim()) {
			e.preventDefault();
			const term = illnessSearch.trim();
			const existing = allDiseases.find(d => d.name.toLowerCase() === term.toLowerCase());

			if (existing) {
				if (!form.diseases.find(i => i.id === existing.id)) {
					setForm(prev => ({ ...prev, diseases: [...prev.diseases, existing] }));
				}
			} else {
				const desc = prompt(`Добавить новую болезнь "${term}" в общую базу клиники? Введите описание:`);
				if (desc) {
					try {
						const res = await postDisease({ name: term, description: desc });
						const generatedId = res.data?.id || res.id || res.data || Date.now();
						const newObj = { id: generatedId, name: term, description: desc };

						setAllDiseases(prev => [...prev, newObj]);
						setForm(prev => ({ ...prev, diseases: [...prev.diseases, newObj] }));
					} catch (err) {
						alert("Ошибка при сохранении новой болезни на сервере");
					}
				}
			}
			setIllnessSearch("");
		}
	};

	const filteredIllnesses = illnessSearch.trim() === ""
		? []
		: allDiseases.filter(d => d.name.toLowerCase().includes(illnessSearch.toLowerCase()));

	const addMedicationBlock = () => {
		const defaultMedId = catalogMeds[0]?.id || "";
		const newMed = { medication_id: defaultMedId, dosage: "1 таб", description: "", duration_days: 7, interval_type: "day", time_hours: "08:00,20:00" };
		setForm(prev => ({ ...prev, medications: [...(prev?.medications || []), newMed] }));
	};

	const updateMedicationBlock = (index, field, value) => {
		setForm(prev => ({
			...prev,
			medications: prev.medications.map((m, i) => i === index ? { ...m, [field]: value } : m)
		}));
	};

	const removeMedicationBlock = (index) => {
		setForm(prev => ({ ...prev, medications: prev.medications.filter((_, i) => i !== index) }));
	};

	const addDirectionBlock = () => {
		const defaultType = "doctor";
		const defaultId = catalogSpecialties[0]?.id || 1;

		const newDir = {
			targetType: defaultType,
			targetId: Number(defaultId),
			description: ""
		};
		setForm(prev => ({
			...prev,
			directions: [...(prev?.directions || []), newDir]
		}));
	};

	const updateDirectionBlock = (index, updatedFields) => {
		setForm(prev => ({
			...prev,
			directions: prev.directions.map((d, i) => i === index ? { ...d, ...updatedFields } : d)
		}));
	};

	const removeDirectionBlock = (index) => {
		setForm(prev => ({ ...prev, directions: prev.directions.filter((_, i) => i !== index) }));
	};

	if (!form || !form.diseases) {
		return <div className="p-4 text-center text-xs text-gray-400">Загрузка медицинских справочников...</div>;
	}

	return (
		<div className="w-96 bg-white border-l shadow-2xl p-4 flex flex-col h-full overflow-y-auto shrink-0 z-50">
			<div className="flex justify-between items-center border-b pb-2 mb-3 shrink-0">
				<h2 className="font-bold text-sm text-gray-800">📋 Электронный протокол визита</h2>
				<button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-sm p-1">✕</button>
			</div>

			<form onSubmit={onSubmit} className="flex flex-col gap-4 text-xs flex-1">

				{/* ЗАБОЛЕВАНИЯ И ДИАГНОЗЫ */}
				<div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100 flex flex-col gap-2">
					<label className="font-bold text-blue-800 block">🧬 Установленные диагнозы</label>

					<div className="flex flex-wrap gap-2 mb-2">
						{form.diseases?.map(d => (
							<span key={d.id} className="bg-pistachio-light/20 text-pistachio-dark font-semibold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 shadow-sm border border-pistachio-light/30">
								{d.name}
								<button
									type="button"
									onClick={() => setForm({ ...form, diseases: form.diseases.filter(i => i.id !== d.id) })}
									className="font-bold hover:text-red-500 transition ml-0.5"
								>
									×
								</button>
							</span>
						))}
					</div>

					<div className="relative">
						<input
							placeholder="Поиск болезни (или нажмите Enter)..."
							value={illnessSearch}
							onChange={e => setIllnessSearch(e.target.value)}
							onKeyDown={handleAddIllness}
							className="w-full p-2.5 border rounded-xl bg-white outline-none focus:border-pistachio-light shadow-sm"
						/>
						{filteredIllnesses.length > 0 && (
							<div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-lg z-50 max-h-40 overflow-y-auto mt-1 border-gray-100">
								{filteredIllnesses.map(d => (
									<div
										key={d.id}
										onClick={() => {
											if (!form.diseases.find(i => i.id === d.id)) {
												setForm({ ...form, diseases: [...form.diseases, d] });
											}
											setIllnessSearch("");
										}}
										className="p-2.5 hover:bg-gray-50 cursor-pointer text-xs border-b border-gray-50 last:border-none text-gray-700 font-medium"
									>
										{d.name}
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* НАЗНАЧЕНИЕ ЛЕКАРСТВ */}
				<div className="bg-purple-50/40 p-3 rounded-xl border border-purple-100 flex flex-col gap-2">
					<div className="flex justify-between items-center">
						<label className="font-bold text-purple-800">💊 Назначение лекарств</label>
						<button type="button" onClick={addMedicationBlock} className="text-purple-600 font-bold hover:underline">+ Добавить</button>
					</div>
					{form.medications?.map((med, idx) => (
						<div key={idx} className="bg-white border rounded-xl p-3 shadow-sm relative flex flex-col gap-2 mt-1">
							<button type="button" onClick={() => removeMedicationBlock(idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 font-bold">&times;</button>
							<div>
								<label className="text-gray-400 block mb-0.5">Препарат</label>
								<select value={med.medication_id} onChange={(e) => updateMedicationBlock(idx, "medication_id", Number(e.target.value))} className="w-full border p-1.5 rounded bg-white">
									{catalogMeds.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
								</select>
							</div>
							<div className="grid grid-cols-2 gap-1.5">
								<div>
									<label className="text-gray-400 block mb-0.5">Дозировка</label>
									<input value={med.dosage} onChange={(e) => updateMedicationBlock(idx, "dosage", e.target.value)} className="w-full border p-1.5 rounded" placeholder="500мг / 1 таб" />
								</div>
								<div>
									<label className="text-gray-400 block mb-0.5">Дней курса</label>
									<input type="number" value={med.duration_days} onChange={(e) => updateMedicationBlock(idx, "duration_days", Number(e.target.value))} className="w-full border p-1.5 rounded" />
								</div>
							</div>
							<div className="grid grid-cols-2 gap-1.5">
								<div>
									<label className="text-gray-400 block mb-0.5">Интервал</label>
									<select value={med.interval_type} onChange={(e) => updateMedicationBlock(idx, "interval_type", e.target.value)} className="w-full border p-1.5 rounded bg-white">
										<option value="day">Раз в день</option>
										<option value="week">Раз в неделю</option>
										<option value="month">Раз в месяц</option>
									</select>
								</div>
								<div>
									<label className="text-gray-400 block mb-0.5">Часы приема</label>
									<input value={med.time_hours} onChange={(e) => updateMedicationBlock(idx, "time_hours", e.target.value)} className="w-full border p-1.5 rounded" placeholder="08:00,20:00" />
								</div>
							</div>
							<input value={med.description} onChange={(e) => updateMedicationBlock(idx, "description", e.target.value)} className="w-full border p-1.5 rounded text-[11px]" placeholder="Примечание к приему" />
						</div>
					))}
				</div>

				{/* НАПРАВЛЕНИЯ И АНАЛИЗЫ */}
				<div className="bg-amber-50/40 p-3 rounded-xl border border-amber-100 flex flex-col gap-2">
					<div className="flex justify-between items-center">
						<label className="font-bold text-amber-800">📋 Направления и анализы</label>
						<button type="button" onClick={addDirectionBlock} className="text-amber-600 font-bold hover:underline">+ Добавить</button>
					</div>
					{form.directions?.map((dir, idx) => {
						let currentSubCatalog = [];
						if (dir.targetType === "doctor") currentSubCatalog = catalogSpecialties;
						if (dir.targetType === "test") currentSubCatalog = catalogTests;
						if (dir.targetType === "procedure") currentSubCatalog = catalogProcedures;

						return (
							<div key={idx} className="bg-white border rounded-xl p-3 shadow-sm relative flex flex-col gap-2 mt-1">
								<button type="button" onClick={() => removeDirectionBlock(idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 font-bold">&times;</button>

								<div className="grid grid-cols-2 gap-2">
									<div>
										<label className="text-gray-400 block mb-0.5 text-[10px]">Категория</label>
										<select
											value={dir.targetType || "doctor"}
											onChange={(e) => {
												const nextType = e.target.value;
												let firstId = 1;
												if (nextType === "doctor") firstId = catalogSpecialties[0]?.id || 1;
												if (nextType === "test") firstId = catalogTests[0]?.id || 1;
												if (nextType === "procedure") firstId = catalogProcedures[0]?.id || 1;

												updateDirectionBlock(idx, { targetType: nextType, targetId: Number(firstId) });
											}}
											className="w-full border p-1.5 rounded bg-white outline-none font-medium"
										>
											<option value="doctor">👨‍⚕️ Направление к врачу</option>
											<option value="test">🧪 Сдать анализ</option>
											<option value="procedure">⚙️ На процедуру</option>
											<option value="hospitalization">🏥 Госпитализация</option>
										</select>
									</div>

									{dir.targetType !== "hospitalization" ? (
										<div>
											<label className="text-gray-400 block mb-0.5 text-[10px]">Тип назначения</label>
											<select
												value={dir.targetId || ""}
												onChange={(e) => updateDirectionBlock(idx, { targetId: Number(e.target.value) })}
												className="w-full border p-1.5 rounded bg-white outline-none text-gray-700"
											>
												{currentSubCatalog.map(item => (
													<option key={item.id} value={item.id}>
														{item.name}
													</option>
												))}
											</select>
										</div>
									) : (
										<div>
											<label className="text-gray-400 block mb-0.5 text-[10px]">Стационар</label>
											<select
												value={dir.targetId || 1}
												onChange={(e) => updateDirectionBlock(idx, { targetId: Number(e.target.value) })}
												className="w-full border p-1.5 rounded bg-white outline-none text-gray-700 font-semibold"
											>
												<option value="1">Общая палата терапии</option>
												<option value="2">Палата интенсивной реанимации</option>
											</select>
										</div>
									)}
								</div>

								<div>
									<label className="text-gray-400 block mb-0.5 text-[10px]">Инструкция к направлению</label>
									<textarea
										value={dir.description || ""}
										onChange={(e) => updateDirectionBlock(idx, { description: e.target.value })}
										className="w-full border p-1.5 rounded text-[11px] h-12 resize-none outline-none focus:border-pistachio-light text-gray-700"
										placeholder="Укажите сопутствующие жалобы или требования к подготовке..."
									/>
								</div>
							</div>
						);
					})}
				</div>

				<button type="submit" className="w-full py-3 bg-pistachio-light text-white font-bold rounded-xl mt-auto hover:bg-pistachio-dark transition text-sm shadow">
					✓ Фиксировать и завершить прием
				</button>
			</form>
		</div>
	);
}
