import { useVirtualizer } from '@tanstack/react-virtual';
import { differenceInYears, format, parseISO } from 'date-fns';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { CitizenStatus } from '@/lib/data/dictionaries';
import type { CitizenQuery, CitizenRow } from '@/lib/types/citizen';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
	CATEGORIES,
	GENDERS,
	REGIONS,
	STATUSES,
	labelOf,
} from '@/lib/data/dictionaries';
import { cn } from '@/lib/utils';

const ROW_HEIGHT = 52;

const GRID =
	'grid grid-cols-[minmax(240px,2fr)_90px_170px_minmax(170px,1.5fr)_150px_170px_130px_100px_130px] items-center gap-x-3 px-4';

const statusVariant: Record<
	CitizenStatus,
	'default' | 'outline' | 'destructive' | 'secondary'
> = {
	active: 'default',
	review: 'outline',
	suspended: 'destructive',
	removed: 'secondary',
};

const formatDate = (date: string) => format(parseISO(date), 'dd.MM.yyyy');

interface Column {
	title: string;
	sortBy?: keyof CitizenRow;
	cell: (c: CitizenRow) => ReactNode;
}

const columns: Column[] = [
	{
		title: 'ФИО',
		sortBy: 'lastName',
		cell: (c) => (
			<span className={'font-medium'}>
				{c.lastName} {c.firstName} {c.middleName}
			</span>
		),
	},
	{ title: 'Пол', sortBy: 'gender', cell: (c) => labelOf(GENDERS, c.gender) },
	{
		title: 'Дата рождения',
		sortBy: 'birthDate',
		cell: (c) =>
			`${formatDate(c.birthDate)} (${differenceInYears(new Date(), parseISO(c.birthDate))} л.)`,
	},
	{
		title: 'Регион',
		sortBy: 'region',
		cell: (c) => (
			<>
				<div className={'truncate'}>{c.city}</div>
				<div className={'text-muted-foreground truncate text-xs'}>
					{labelOf(REGIONS, c.region)}
				</div>
			</>
		),
	},
	{ title: 'Телефон', cell: (c) => c.phone },
	{
		title: 'Категория',
		sortBy: 'category',
		cell: (c) => labelOf(CATEGORIES, c.category),
	},
	{
		title: 'Статус',
		sortBy: 'status',
		cell: (c) => (
			<Badge variant={statusVariant[c.status]}>
				{labelOf(STATUSES, c.status)}
			</Badge>
		),
	},
	{ title: 'Обращения', sortBy: 'appealsOpen', cell: (c) => c.appealsOpen },
	{
		title: 'На учёте с',
		sortBy: 'registeredAt',
		cell: (c) => formatDate(c.registeredAt),
	},
];

interface Props {
	rows: CitizenRow[];
	isPending: boolean;
	isFetching: boolean;
	query: CitizenQuery;
	onSort: (key: keyof CitizenRow) => void;
}

export default function CitizensTable({
	rows,
	isPending,
	isFetching,
	query,
	onSort,
}: Props) {
	const scrollRef = useRef<HTMLDivElement>(null);

	// eslint-disable-next-line react-hooks/incompatible-library
	const virtualizer = useVirtualizer({
		count: rows.length,
		estimateSize: () => ROW_HEIGHT,
		getScrollElement: () => scrollRef.current,
		overscan: 10,
	});

	useEffect(() => {
		scrollRef.current?.scrollTo({ top: 0 });
	}, [query.page]);

	return (
		<div
			ref={scrollRef}
			className={'min-h-0 flex-1 overflow-auto rounded-lg border'}
		>
			<div className={'min-w-375'}>
				<div
					className={cn(
						GRID,
						'bg-muted text-muted-foreground sticky top-0 z-10 h-10 border-b text-xs font-medium',
					)}
				>
					{columns.map((col) => {
						if (!col.sortBy) return <div key={col.title}>{col.title}</div>;

						const sortBy = col.sortBy;
						const Icon =
							query.sortBy !== sortBy
								? ChevronsUpDown
								: query.sortDir === 'desc'
									? ArrowDown
									: ArrowUp;

						return (
							<button
								key={col.title}
								className={
									'hover:text-foreground flex items-center gap-1 text-left'
								}
								type={'button'}
								onClick={() => onSort(sortBy)}
							>
								{col.title}
								<Icon className={'size-3.5'} />
							</button>
						);
					})}
				</div>
				{isPending &&
					Array.from({ length: 12 }, (_, i) => (
						<div
							key={i}
							className={cn(GRID, 'border-b')}
							style={{ height: ROW_HEIGHT }}
						>
							{columns.map((col) => (
								<Skeleton key={col.title} className={'h-4 w-3/4'} />
							))}
						</div>
					))}
				{!isPending && rows.length === 0 && (
					<div className={'text-muted-foreground p-10 text-center text-sm'}>
						Ничего не найдено — попробуй изменить фильтры
					</div>
				)}
				{rows.length > 0 && (
					<div
						className={cn('relative', isFetching && 'opacity-60')}
						style={{ height: virtualizer.getTotalSize() }}
					>
						{virtualizer.getVirtualItems().map((v) => {
							const c = rows[v.index];

							return (
								<Link
									key={c.id}
									className={cn(
										GRID,
										'hover:bg-muted/50 absolute top-0 left-0 w-full border-b text-sm',
										c.status === 'removed' && 'text-muted-foreground',
									)}
									style={{
										height: v.size,
										transform: `translateY(${v.start}px)`,
									}}
									to={`/registry/${c.id}`}
								>
									{columns.map((col) => (
										<div key={col.title} className={'truncate'}>
											{col.cell(c)}
										</div>
									))}
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
