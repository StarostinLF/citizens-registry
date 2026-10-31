import { faker } from '@faker-js/faker/locale/ru';

import type { CitizenRow } from '@/lib/types/citizen';

import {
	CATEGORIES,
	GENDERS,
	REGIONS,
	STATUSES,
} from '@/lib/data/dictionaries';

const TOTAL = 100_000;

const pick = <T>(list: readonly T[]) => faker.helpers.arrayElement(list);
const toDate = (d: Date) => d.toISOString().slice(0, 10);

const makeCitizen = (id: number): CitizenRow => {
	const gender = pick(GENDERS).value;
	const region = pick(REGIONS);

	return {
		id,
		lastName: faker.person.lastName(gender),
		firstName: faker.person.firstName(gender),
		middleName: faker.person.middleName(gender),
		gender,
		birthDate: toDate(faker.date.birthdate({ mode: 'age', min: 18, max: 95 })),
		region: region.value,
		city: pick(region.cities),
		phone: faker.phone.number({ style: 'national' }),
		category: pick(CATEGORIES).value,
		status: pick(STATUSES).value,
		registeredAt: toDate(
			faker.date.between({ from: '2015-01-01', to: new Date() }),
		),
		appealsOpen: faker.number.int({ min: 0, max: 3 }),
	};
};

let cache: CitizenRow[] | undefined;

export const getCitizens = () => {
	if (!cache) {
		faker.seed(2026);
		cache = Array.from({ length: TOTAL }, (_, i) => makeCitizen(i + 1));
	}
	return cache;
};
