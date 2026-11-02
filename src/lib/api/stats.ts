import {
	addDays,
	differenceInYears,
	format,
	parseISO,
	subMonths,
} from 'date-fns';

import type { CitizenRow } from '@/lib/types/citizen';

import { getCitizens } from '@/lib/data/generate';

export const AGE_GROUPS = [
	{ label: '18–29', from: 18, to: 29 },
	{ label: '30–44', from: 30, to: 44 },
	{ label: '45–59', from: 45, to: 59 },
	{ label: '60–74', from: 60, to: 74 },
	{ label: '75+', from: 75, to: 120 },
] as const;

export interface DashboardStats {
	total: number;
	newThisMonth: number;
	newPrevMonth: number;
	openAppeals: number;
	avgAge: number;
	byStatus: Record<string, number>;
	byGender: Record<string, number>;
	byCategory: Record<string, number>;
	byRegion: Record<string, number>;
	byAge: number[];
	byMonth: { month: string; count: number }[];
	birthdays: (CitizenRow & { age: number; day: string })[];
	recent: CitizenRow[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const inc = (map: Record<string, number>, key: string) => {
	map[key] = (map[key] ?? 0) + 1;
};

export const fetchStats = async (): Promise<DashboardStats> => {
	await sleep(300);

	const now = new Date();
	const monthKey = (d: Date) => format(d, 'yyyy-MM');
	const months = Array.from({ length: 12 }, (_, i) =>
		subMonths(now, 11 - i),
	).map((d) => ({ key: monthKey(d), month: format(d, 'LLL yy'), count: 0 }));
	const monthIdx = new Map(months.map((m, i) => [m.key, i]));

	const weekDays = Array.from({ length: 7 }, (_, i) =>
		format(addDays(now, i), 'MM-dd'),
	);
	const thisMonth = monthKey(now);
	const prevMonth = monthKey(subMonths(now, 1));

	const s: DashboardStats = {
		total: 0,
		newThisMonth: 0,
		newPrevMonth: 0,
		openAppeals: 0,
		avgAge: 0,
		byStatus: {},
		byGender: {},
		byCategory: {},
		byRegion: {},
		byAge: AGE_GROUPS.map(() => 0),
		byMonth: [],
		birthdays: [],
		recent: [],
	};
	let ageSum = 0;

	for (const c of getCitizens()) {
		const age = differenceInYears(now, parseISO(c.birthDate));
		const reg = c.registeredAt.slice(0, 7);

		s.total++;
		s.openAppeals += c.appealsOpen;
		ageSum += age;
		inc(s.byStatus, c.status);
		inc(s.byGender, c.gender);
		inc(s.byCategory, c.category);
		inc(s.byRegion, c.region);

		const g = AGE_GROUPS.findIndex((a) => age >= a.from && age <= a.to);
		if (g >= 0) s.byAge[g]++;

		if (reg === thisMonth) s.newThisMonth++;
		else if (reg === prevMonth) s.newPrevMonth++;
		const mi = monthIdx.get(reg);
		if (mi != null) months[mi].count++;

		const md = c.birthDate.slice(5);
		if (s.birthdays.length < 8 && weekDays.includes(md))
			s.birthdays.push({ ...c, age: age + 1, day: md });
		if (c.registeredAt >= (s.recent[7]?.registeredAt ?? '')) {
			s.recent.push(c);
			s.recent.sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
			s.recent.length = Math.min(s.recent.length, 8);
		}
	}

	s.avgAge = Math.round(ageSum / s.total);
	s.byMonth = months.map(({ month, count }) => ({ month, count }));
	s.birthdays.sort((a, b) => weekDays.indexOf(a.day) - weekDays.indexOf(b.day));
	return s;
};
