import { Search, X } from 'lucide-react';
import { useRef, useState } from 'react';

import type { FilterPatch } from '@/lib/hooks/use-citizen-filters';
import type { CitizenQuery } from '@/lib/types/citizen';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	CATEGORIES,
	GENDERS,
	REGIONS,
	STATUSES,
} from '@/lib/data/dictionaries';

const ALL = 'all';

interface FilterSelectProps {
	label: string;
	options: readonly { value: string; label: string }[];
	value?: string;
	onChange: (value?: string) => void;
}

function FilterSelect({ label, options, value, onChange }: FilterSelectProps) {
	const items = [{ value: ALL, label }, ...options];

	return (
		<Select
			items={items}
			value={value ?? ALL}
			onValueChange={(v) => onChange(v === ALL || !v ? undefined : v)}
		>
			<SelectTrigger className='w-48'>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{items.map((o) => (
					<SelectItem key={o.value} value={o.value}>
						{o.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

interface Props {
	query: CitizenQuery;
	onChange: (patch: FilterPatch) => void;
}

export default function RegistryFilters({ query, onChange }: Props) {
	const [search, setSearch] = useState(query.search ?? '');
	const timer = useRef<number | undefined>(undefined);

	// Поиск уходит в URL с задержкой, чтобы не дёргать API на каждую букву
	const onSearch = (value: string) => {
		setSearch(value);
		clearTimeout(timer.current);
		timer.current = window.setTimeout(
			() => onChange({ search: value.trim() }),
			300,
		);
	};

	const reset = () => {
		clearTimeout(timer.current);
		setSearch('');
		onChange({
			search: undefined,
			status: undefined,
			gender: undefined,
			region: undefined,
			category: undefined,
			ageFrom: undefined,
			ageTo: undefined,
		});
	};

	const hasFilters = Boolean(
		search ||
		query.status ||
		query.gender ||
		query.region ||
		query.category ||
		query.ageFrom != null ||
		query.ageTo != null,
	);

	return (
		<div className='flex flex-wrap items-center gap-2'>
			<div className='relative w-64'>
				<Search className='text-muted-foreground absolute top-2 left-2.5 size-4' />
				<Input
					className='pl-8'
					placeholder='Поиск по ФИО'
					value={search}
					onChange={(e) => onSearch(e.target.value)}
				/>
			</div>
			<FilterSelect
				label='Все статусы'
				options={STATUSES}
				value={query.status}
				onChange={(status) => onChange({ status })}
			/>
			<FilterSelect
				label='Любой пол'
				options={GENDERS}
				value={query.gender}
				onChange={(gender) => onChange({ gender })}
			/>
			<FilterSelect
				label='Все регионы'
				options={REGIONS}
				value={query.region}
				onChange={(region) => onChange({ region })}
			/>
			<FilterSelect
				label='Все категории'
				options={CATEGORIES}
				value={query.category}
				onChange={(category) => onChange({ category })}
			/>
			<Input
				className='w-28'
				min={0}
				placeholder='Возраст от'
				type='number'
				value={query.ageFrom ?? ''}
				onChange={(e) => onChange({ ageFrom: e.target.value })}
			/>
			<Input
				className='w-28'
				min={0}
				placeholder='Возраст до'
				type='number'
				value={query.ageTo ?? ''}
				onChange={(e) => onChange({ ageTo: e.target.value })}
			/>
			{hasFilters && (
				<Button variant='ghost' onClick={reset}>
					<X /> Сбросить
				</Button>
			)}
		</div>
	);
}
