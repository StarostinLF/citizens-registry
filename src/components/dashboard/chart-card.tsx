import type { ReactNode } from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
	title: string;
	description?: string;
	loading: boolean;
	className?: string;
	children: ReactNode;
}

export default function ChartCard({
	title,
	description,
	loading,
	className,
	children,
}: Props) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				{loading ? <Skeleton className={'h-56 w-full'} /> : children}
			</CardContent>
		</Card>
	);
}
