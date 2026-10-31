import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { CitizenQuery } from '@/lib/types/citizen';

import { fetchCitizens } from '@/lib/api/citizens';

export const useCitizens = (query: CitizenQuery) =>
	useQuery({
		queryKey: ['citizens', query],
		queryFn: () => fetchCitizens(query),
		placeholderData: keepPreviousData,
	});
