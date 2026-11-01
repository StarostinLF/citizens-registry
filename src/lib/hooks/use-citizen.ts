import { useQuery } from '@tanstack/react-query';

import type { SectionKey } from '@/lib/data/sections';

import { fetchCitizen, fetchSection } from '@/lib/api/citizens';

export const useCitizen = (id: number) =>
	useQuery({
		queryKey: ['citizen', id],
		queryFn: () => fetchCitizen(id),
		retry: false,
	});

export const useCitizenSection = (id: number, key: SectionKey) =>
	useQuery({
		queryKey: ['citizen', id, key],
		queryFn: () => fetchSection(id, key),
	});
