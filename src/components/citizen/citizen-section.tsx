import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { SECTIONS } from '@/lib/data/sections';
import { useCitizenSection } from '@/lib/hooks/use-citizen';

interface Props {
	id: number;
	section: (typeof SECTIONS)[number];
}

export default function CitizenSection({ id, section }: Props) {
	const { data, isPending, isError } = useCitizenSection(id, section.key);

	if (isPending) return <Skeleton className={'h-48 w-full'} />;
	if (isError)
		return <p className={'text-destructive'}>Не удалось загрузить раздел</p>;

	return (
		<Card className={'py-0'}>
			<Table>
				<TableHeader>
					<TableRow>
						{section.columns.map((c) => (
							<TableHead key={c.key}>{c.label}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.length === 0 && (
						<TableRow>
							<TableCell
								className={'text-muted-foreground h-24 text-center'}
								colSpan={section.columns.length}
							>
								Записей нет
							</TableCell>
						</TableRow>
					)}
					{data.map((row, i) => (
						<TableRow key={i}>
							{section.columns.map((c) => (
								<TableCell key={c.key}>{row[c.key]}</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
}
