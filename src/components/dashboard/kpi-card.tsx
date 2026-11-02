import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
	icon: LucideIcon;
	label: string;
	value?: string;
	hint?: string;
	onClick?: () => void;
}

export default function KpiCard({
	icon: Icon,
	label,
	value,
	hint,
	onClick,
}: Props) {
	return (
		<Card
			className={
				onClick ? 'hover:bg-muted/50 cursor-pointer transition-colors' : ''
			}
			onClick={onClick}
		>
			<CardContent className={'flex items-center gap-4'}>
				<div className={'bg-primary/10 text-primary rounded-lg p-3'}>
					<Icon className={'size-5'} />
				</div>
				<div className={'min-w-0'}>
					<div className={'text-muted-foreground text-xs'}>{label}</div>
					{value ? (
						<div className={'text-2xl leading-tight font-semibold'}>
							{value}
						</div>
					) : (
						<Skeleton className={'mt-1 h-7 w-20'} />
					)}
					{hint && (
						<div className={'text-muted-foreground text-xs'}>{hint}</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
