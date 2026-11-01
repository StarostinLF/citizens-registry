import { format, parseISO } from 'date-fns';
import { Mail, MapPin, Phone } from 'lucide-react';

import type { CitizenDetails } from '@/lib/types/citizen';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SECTIONS } from '@/lib/data/sections';

interface Props {
	citizen: CitizenDetails;
	onSelect: (tab: string) => void;
}

export default function CitizenSidebar({ citizen: c, onSelect }: Props) {
	const contacts = [
		{ icon: Phone, text: c.phone },
		{ icon: Phone, text: `${c.workPhone} (раб.)` },
		{ icon: Mail, text: c.email },
		{
			icon: MapPin,
			text: `${c.zip}, ${c.city}, ${c.street}, д. ${c.house}, кв. ${c.apartment}`,
		},
	];

	return (
		<aside className={'flex flex-col gap-4'}>
			<Card>
				<CardHeader>
					<CardTitle>Разделы</CardTitle>
				</CardHeader>
				<CardContent className={'grid grid-cols-2 gap-2'}>
					{SECTIONS.map((s) => (
						<button
							key={s.key}
							className={
								'hover:bg-muted rounded-lg border p-3 text-left transition-colors'
							}
							type={'button'}
							onClick={() => onSelect(s.key)}
						>
							<div className={'text-xl font-semibold'}>{c.counts[s.key]}</div>
							<div className={'text-muted-foreground text-xs'}>{s.label}</div>
						</button>
					))}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Контакты</CardTitle>
				</CardHeader>
				<CardContent className={'flex flex-col gap-3 text-sm'}>
					{contacts.map(({ icon: Icon, text }) => (
						<div key={text} className={'flex gap-2'}>
							<Icon
								className={'text-muted-foreground mt-0.5 size-4 shrink-0'}
							/>
							<span className={'wrap-break-word'}>{text}</span>
						</div>
					))}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>События</CardTitle>
				</CardHeader>
				<CardContent className={'flex flex-col gap-3 text-sm'}>
					{c.events.map((e, i) => (
						<div key={i}>
							<div className={'text-muted-foreground text-xs'}>
								{format(parseISO(e.date), 'dd.MM.yyyy')}
							</div>
							{e.text}
						</div>
					))}
				</CardContent>
			</Card>
		</aside>
	);
}
