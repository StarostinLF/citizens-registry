import { useSearchParams } from 'react-router-dom';

import type {
	CitizenCategory,
	CitizenGender,
	CitizenRegion,
	CitizenStatus,
} from '@/lib/data/dictionaries';
import type { CitizenQuery, CitizenRow } from '@/lib/types/citizen';

export type FilterPatch = Record<string, string | number | undefined>;

export const useCitizenFilters = () => {
	const [params, setParams] = useSearchParams();

	const num = (key: string) => {
		const raw = params.get(key);
		const n = raw ? Number(raw) : NaN;
		return Number.isNaN(n) ? undefined : n;
	};

	const query: CitizenQuery = {
		page: num('page') ?? 1,
		pageSize: num('pageSize') ?? 50,
		search: params.get('search') ?? undefined,
		status: (params.get('status') as CitizenStatus | null) ?? undefined,
		gender: (params.get('gender') as CitizenGender | null) ?? undefined,
		region: (params.get('region') as CitizenRegion | null) ?? undefined,
		category: (params.get('category') as CitizenCategory | null) ?? undefined,
		ageFrom: num('ageFrom'),
		ageTo: num('ageTo'),
		sortBy: (params.get('sortBy') as keyof CitizenRow | null) ?? undefined,
		sortDir: params.get('sortDir') === 'desc' ? 'desc' : 'asc',
	};

	const update = (patch: FilterPatch) =>
		setParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				for (const [key, value] of Object.entries(patch)) {
					if (value === undefined || value === '') next.delete(key);
					else next.set(key, String(value));
				}
				if (!('page' in patch)) next.delete('page');
				return next;
			},
			{ replace: true },
		);

	return { query, update };
};
