import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { CitizenRow } from '@/lib/types/citizen';

import CitizensTable from '@/components/citizens-table';
import RegistryFilters from '@/components/registry-filters';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useCitizenFilters } from '@/lib/hooks/use-citizen-filters';
import { useCitizens } from '@/lib/hooks/use-citizens';

const PAGE_SIZES = ['25', '50', '100'].map((v) => ({ value: v, label: v }));

export default function Registry() {
	const { query, update } = useCitizenFilters();
	const { data, isPending, isFetching, isError } = useCitizens(query);

	const total = data?.total ?? 0;
	const pages = Math.max(1, Math.ceil(total / query.pageSize));

	// asc → desc → без сортировки
	const onSort = (key: keyof CitizenRow) => {
		if (query.sortBy !== key) update({ sortBy: key, sortDir: 'asc' });
		else if (query.sortDir === 'asc') update({ sortDir: 'desc' });
		else update({ sortBy: undefined, sortDir: undefined });
	};

	return (
		<div className='flex min-h-0 flex-1 flex-col gap-4 p-6'>
			<div className='flex items-baseline justify-between'>
				<h1 className='text-xl font-semibold'>Картотека граждан</h1>
				<span className='text-muted-foreground text-sm'>
					Найдено: {data ? total.toLocaleString('ru-RU') : '…'}
				</span>
			</div>

			<RegistryFilters query={query} onChange={update} />

			{isError && (
				<p className='text-destructive text-sm'>Не удалось загрузить данные</p>
			)}

			<CitizensTable
				isFetching={isFetching}
				isPending={isPending}
				query={query}
				rows={data?.rows ?? []}
				onSort={onSort}
			/>

			<div className='flex items-center justify-between text-sm'>
				<div className='flex items-center gap-2'>
					<span className='text-muted-foreground'>На странице:</span>
					<Select
						items={PAGE_SIZES}
						value={String(query.pageSize)}
						onValueChange={(v) => update({ pageSize: v ?? undefined })}
					>
						<SelectTrigger size='sm'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PAGE_SIZES.map((o) => (
								<SelectItem key={o.value} value={o.value}>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='flex items-center gap-2'>
					<span className='text-muted-foreground'>
						Страница {query.page} из {pages}
					</span>
					<Button
						disabled={query.page <= 1}
						size='icon-sm'
						variant='outline'
						onClick={() => update({ page: query.page - 1 })}
					>
						<ChevronLeft />
					</Button>
					<Button
						disabled={query.page >= pages}
						size='icon-sm'
						variant='outline'
						onClick={() => update({ page: query.page + 1 })}
					>
						<ChevronRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
