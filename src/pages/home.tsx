import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Cake, FilePlus2, Inbox, UserCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	XAxis,
	YAxis,
} from 'recharts';

import ChartCard from '@/components/dashboard/chart-card';
import KpiCard from '@/components/dashboard/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { AGE_GROUPS } from '@/lib/api/stats';
import {
	CATEGORIES,
	GENDERS,
	REGIONS,
	STATUSES,
	labelOf,
} from '@/lib/data/dictionaries';
import { useStats } from '@/lib/hooks/use-stats';

const COLORS = [1, 2, 3, 4, 5].map((n) => `var(--chart-${n})`);
const fmt = (n: number) => n.toLocaleString('ru-RU');

const toRows = (
	counts: Record<string, number> | undefined,
	dict: readonly { value: string; label: string }[],
) =>
	dict.map((d, i) => ({
		key: d.value,
		name: d.label,
		value: counts?.[d.value] ?? 0,
		fill: COLORS[i % COLORS.length],
	}));

const pieConfig = (rows: ReturnType<typeof toRows>) =>
	Object.fromEntries(
		rows.map((r) => [r.name, { label: r.name, color: r.fill }]),
	);

export default function Home() {
	const { data, isPending } = useStats();
	const navigate = useNavigate();
	const go = (query: string) => navigate(`/registry?${query}`);

	const statusRows = toRows(data?.byStatus, STATUSES);
	const genderRows = toRows(data?.byGender, GENDERS);
	const categoryRows = toRows(data?.byCategory, CATEGORIES).sort(
		(a, b) => b.value - a.value,
	);
	const regionRows = toRows(data?.byRegion, REGIONS)
		.sort((a, b) => b.value - a.value)
		.slice(0, 8);
	const ageRows = AGE_GROUPS.map((g, i) => ({
		...g,
		value: data?.byAge[i] ?? 0,
	}));

	const delta =
		data && data.newPrevMonth
			? Math.round(
					((data.newThisMonth - data.newPrevMonth) / data.newPrevMonth) * 100,
				)
			: 0;
	const activeShare = data
		? Math.round((data.byStatus.active / data.total) * 100)
		: 0;

	return (
		<div className={'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6'}>
			<h1 className={'text-xl font-semibold'}>Главная</h1>

			<div className={'grid gap-4 sm:grid-cols-2 xl:grid-cols-4'}>
				<KpiCard
					hint={`Средний возраст — ${data?.avgAge ?? '…'} лет`}
					icon={Users}
					label={'Всего граждан'}
					value={data && fmt(data.total)}
					onClick={() => navigate('/registry')}
				/>
				<KpiCard
					hint={`${delta >= 0 ? '+' : ''}${delta}% к прошлому месяцу`}
					icon={FilePlus2}
					label={'Новых за месяц'}
					value={data && fmt(data.newThisMonth)}
				/>
				<KpiCard
					hint={'Доля со статусом «На учёте»'}
					icon={UserCheck}
					label={'На учёте'}
					value={data && `${activeShare}%`}
					onClick={() => go('status=active')}
				/>
				<KpiCard
					hint={'Суммарно по всем гражданам'}
					icon={Inbox}
					label={'Открытых обращений'}
					value={data && fmt(data.openAppeals)}
				/>
			</div>

			<div className={'grid gap-4 lg:grid-cols-3'}>
				<ChartCard
					className={'lg:col-span-2'}
					description={'Последние 12 месяцев'}
					loading={isPending}
					title={'Постановка на учёт'}
				>
					<ChartContainer
						className={'h-56 w-full'}
						config={{ count: { label: 'Граждан', color: 'var(--chart-1)' } }}
					>
						<AreaChart data={data?.byMonth}>
							<CartesianGrid vertical={false} />
							<XAxis axisLine={false} dataKey={'month'} tickLine={false} />
							<YAxis
								axisLine={false}
								tickFormatter={fmt}
								tickLine={false}
								width={48}
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Area
								dataKey={'count'}
								fill={'var(--color-count)'}
								fillOpacity={0.2}
								stroke={'var(--color-count)'}
								type={'monotone'}
							/>
						</AreaChart>
					</ChartContainer>
				</ChartCard>

				<ChartCard
					description={'Клик — открыть в картотеке'}
					loading={isPending}
					title={'Статусы учёта'}
				>
					<ChartContainer
						className={'h-56 w-full'}
						config={pieConfig(statusRows)}
					>
						<PieChart>
							<ChartTooltip content={<ChartTooltipContent hideLabel />} />
							<Pie
								className={'cursor-pointer'}
								data={statusRows}
								dataKey={'value'}
								innerRadius={45}
								nameKey={'name'}
								onClick={(_, i) => go(`status=${statusRows[i].key}`)}
							>
								{statusRows.map((r) => (
									<Cell key={r.key} fill={r.fill} />
								))}
							</Pie>
							<ChartLegend content={<ChartLegendContent nameKey={'name'} />} />
						</PieChart>
					</ChartContainer>
				</ChartCard>

				<ChartCard
					description={'Клик — фильтр по возрасту'}
					loading={isPending}
					title={'Возрастные группы'}
				>
					<ChartContainer
						className={'h-56 w-full'}
						config={{ value: { label: 'Граждан', color: 'var(--chart-2)' } }}
					>
						<BarChart data={ageRows}>
							<CartesianGrid vertical={false} />
							<XAxis axisLine={false} dataKey={'label'} tickLine={false} />
							<YAxis
								axisLine={false}
								tickFormatter={fmt}
								tickLine={false}
								width={48}
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar
								className={'cursor-pointer'}
								dataKey={'value'}
								fill={'var(--color-value)'}
								radius={4}
								onClick={(_, i) =>
									go(`ageFrom=${ageRows[i].from}&ageTo=${ageRows[i].to}`)
								}
							/>
						</BarChart>
					</ChartContainer>
				</ChartCard>

				<ChartCard
					description={'Клик — открыть в картотеке'}
					loading={isPending}
					title={'Пол'}
				>
					<ChartContainer
						className={'h-56 w-full'}
						config={pieConfig(genderRows)}
					>
						<PieChart>
							<ChartTooltip content={<ChartTooltipContent hideLabel />} />
							<Pie
								className={'cursor-pointer'}
								data={genderRows}
								dataKey={'value'}
								nameKey={'name'}
								onClick={(_, i) => go(`gender=${genderRows[i].key}`)}
							>
								{genderRows.map((r) => (
									<Cell key={r.key} fill={r.fill} />
								))}
							</Pie>
							<ChartLegend content={<ChartLegendContent nameKey={'name'} />} />
						</PieChart>
					</ChartContainer>
				</ChartCard>

				<ChartCard
					description={'Топ-8 по числу граждан'}
					loading={isPending}
					title={'Регионы'}
				>
					<ChartContainer
						className={'h-56 w-full'}
						config={{ value: { label: 'Граждан', color: 'var(--chart-3)' } }}
					>
						<BarChart data={regionRows} layout={'vertical'}>
							<XAxis type={'number'} hide />
							<YAxis
								axisLine={false}
								dataKey={'name'}
								tickLine={false}
								type={'category'}
								width={110}
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar
								className={'cursor-pointer'}
								dataKey={'value'}
								fill={'var(--color-value)'}
								radius={4}
								onClick={(_, i) => go(`region=${regionRows[i].key}`)}
							/>
						</BarChart>
					</ChartContainer>
				</ChartCard>
			</div>

			<div className={'grid gap-4 lg:grid-cols-3'}>
				<ChartCard
					description={'Клик — открыть в картотеке'}
					loading={isPending}
					title={'Категории граждан'}
				>
					<ChartContainer
						className={'h-64 w-full'}
						config={{ value: { label: 'Граждан', color: 'var(--chart-4)' } }}
					>
						<BarChart data={categoryRows} layout={'vertical'}>
							<XAxis type={'number'} hide />
							<YAxis
								axisLine={false}
								dataKey={'name'}
								tickLine={false}
								type={'category'}
								width={130}
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar
								className={'cursor-pointer'}
								dataKey={'value'}
								fill={'var(--color-value)'}
								radius={4}
								onClick={(_, i) => go(`category=${categoryRows[i].key}`)}
							/>
						</BarChart>
					</ChartContainer>
				</ChartCard>

				<Card>
					<CardHeader>
						<CardTitle className={'flex items-center gap-2'}>
							<Cake className={'size-4'} /> Дни рождения на неделе
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className={'flex flex-col gap-3'}>
							{data?.birthdays.map((c) => (
								<li
									key={c.id}
									className={'flex items-center justify-between gap-2 text-sm'}
								>
									<button
										className={'text-left hover:underline'}
										type={'button'}
										onClick={() => navigate(`/registry/${c.id}`)}
									>
										{c.lastName} {c.firstName} {c.middleName}
									</button>
									<span className={'text-muted-foreground shrink-0 text-xs'}>
										{format(parseISO(`2000-${c.day}`), 'd MMM', { locale: ru })}{' '}
										· {c.age}
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Последние постановки на учёт</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className={'flex flex-col gap-3'}>
							{data?.recent.map((c) => (
								<li
									key={c.id}
									className={'flex items-center justify-between gap-2 text-sm'}
								>
									<button
										className={'text-left hover:underline'}
										type={'button'}
										onClick={() => navigate(`/registry/${c.id}`)}
									>
										{c.lastName} {c.firstName[0]}.{c.middleName[0]}.
									</button>
									<span className={'text-muted-foreground shrink-0 text-xs'}>
										{labelOf(REGIONS, c.region)} ·{' '}
										{format(parseISO(c.registeredAt), 'd MMM', { locale: ru })}
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
