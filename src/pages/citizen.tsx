import { differenceInYears, parseISO } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CitizenForm from '@/components/citizen/citizen-form';
import CitizenSection from '@/components/citizen/citizen-section';
import CitizenSidebar from '@/components/citizen/citizen-sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES, STATUSES, labelOf } from '@/lib/data/dictionaries';
import { SECTIONS } from '@/lib/data/sections';
import { useCitizen } from '@/lib/hooks/use-citizen';

export default function Citizen() {
	const id = Number(useParams().id);
	const navigate = useNavigate();
	const [tab, setTab] = useState('main');
	const { data: c, isPending } = useCitizen(id);

	return (
		<div className={'flex-1 overflow-y-auto p-6'}>
			<Button variant={'ghost'} onClick={() => navigate(-1)}>
				<ArrowLeft /> К картотеке
			</Button>
			{isPending && <Skeleton className={'mt-4 h-96 w-full'} />}
			{!isPending && !c && (
				<p className={'text-muted-foreground mt-4'}>Гражданин не найден</p>
			)}
			{c && (
				<>
					<div className={'mt-4 flex items-center gap-4'}>
						<Avatar className={'size-16'}>
							<AvatarFallback className={'text-xl'}>
								{c.lastName[0]}
								{c.firstName[0]}
							</AvatarFallback>
						</Avatar>
						<div>
							<h1 className={'text-xl font-semibold'}>
								{c.lastName} {c.firstName} {c.middleName}
							</h1>
							<div
								className={
									'text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-sm'
								}
							>
								<span>№ {c.id}</span>
								<span>
									{differenceInYears(new Date(), parseISO(c.birthDate))} л.
								</span>
								<Badge>{labelOf(STATUSES, c.status)}</Badge>
								<Badge variant={'outline'}>
									{labelOf(CATEGORIES, c.category)}
								</Badge>
							</div>
						</div>
					</div>
					<div
						className={'mt-6 grid items-start gap-4 xl:grid-cols-[1fr_320px]'}
					>
						<Tabs className={'min-w-0'} value={tab} onValueChange={setTab}>
							<TabsList
								className={
									'max-w-full flex-wrap justify-start gap-1 group-data-horizontal/tabs:h-auto'
								}
							>
								<TabsTrigger className={'h-8 flex-none px-3'} value={'main'}>
									Основные сведения
								</TabsTrigger>
								{SECTIONS.map((s) => (
									<TabsTrigger
										key={s.key}
										className={'h-8 flex-none px-3'}
										value={s.key}
									>
										{s.label}
									</TabsTrigger>
								))}
							</TabsList>
							<TabsContent value={'main'} keepMounted>
								<CitizenForm citizen={c} />
							</TabsContent>
							{SECTIONS.map((s) => (
								<TabsContent key={s.key} value={s.key}>
									<CitizenSection id={id} section={s} />
								</TabsContent>
							))}
						</Tabs>
						<CitizenSidebar citizen={c} onSelect={setTab} />
					</div>
				</>
			)}
		</div>
	);
}
