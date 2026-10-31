import type { CitizenQuery, CitizenRow } from '@/lib/types/citizen';

import { getCitizens } from '@/lib/data/generate';

export interface Page<T> {
	rows: T[];
	total: number;
}

// Дата рождения человека, которому сегодня ровно `age` лет
const birthDateByAge = (age: number) => {
	const d = new Date();
	d.setFullYear(d.getFullYear() - age);
	return d.toISOString().slice(0, 10);
};

export const fetchCitizens = async (
	q: CitizenQuery,
): Promise<Page<CitizenRow>> => {
	await new Promise((resolve) => setTimeout(resolve, 250));

	const search = q.search?.trim().toLowerCase();
	const latestBirth = q.ageFrom != null ? birthDateByAge(q.ageFrom) : null;
	const earliestBirth = q.ageTo != null ? birthDateByAge(q.ageTo + 1) : null;

	const rows = getCitizens().filter(
		(c) =>
			(!q.status || c.status === q.status) &&
			(!q.gender || c.gender === q.gender) &&
			(!q.region || c.region === q.region) &&
			(!q.category || c.category === q.category) &&
			(!latestBirth || c.birthDate <= latestBirth) &&
			(!earliestBirth || c.birthDate > earliestBirth) &&
			(!search ||
				`${c.lastName} ${c.firstName} ${c.middleName}`
					.toLowerCase()
					.includes(search)),
	);

	if (q.sortBy) {
		const key = q.sortBy;
		const dir = q.sortDir === 'desc' ? -1 : 1;
		rows.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * dir);
	}

	const start = (q.page - 1) * q.pageSize;
	return { rows: rows.slice(start, start + q.pageSize), total: rows.length };
};
