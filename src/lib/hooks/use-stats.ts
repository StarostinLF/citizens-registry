import { useQuery } from '@tanstack/react-query';

import { fetchStats } from '@/lib/api/stats';

export const useStats = () =>
	useQuery({ queryKey: ['stats'], queryFn: fetchStats, staleTime: Infinity });
