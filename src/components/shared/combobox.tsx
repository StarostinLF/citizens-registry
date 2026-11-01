import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

interface Props {
	id?: string;
	options: readonly { value: string; label: string }[];
	value?: string | string[];
	multiple?: boolean;
	onChange: (value: string | string[]) => void;
}

export default function Combobox({
	id,
	options,
	value,
	multiple,
	onChange,
}: Props) {
	const [open, setOpen] = useState(false);
	const selected = Array.isArray(value) ? value : value ? [value] : [];
	const labels = options
		.filter((o) => selected.includes(o.value))
		.map((o) => o.label);

	const toggle = (v: string) => {
		if (!multiple) {
			onChange(v);
			setOpen(false);
		} else
			onChange(
				selected.includes(v)
					? selected.filter((x) => x !== v)
					: [...selected, v],
			);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<Button
						className={'w-full justify-between font-normal'}
						id={id}
						type={'button'}
						variant={'outline'}
					/>
				}
			>
				<span className={'truncate'}>
					{labels.length === 0
						? 'Не выбрано'
						: labels.length > 2
							? `Выбрано: ${labels.length}`
							: labels.join(', ')}
				</span>
				<ChevronsUpDown className={'text-muted-foreground'} />
			</PopoverTrigger>
			<PopoverContent align={'start'} className={'w-(--anchor-width) p-0'}>
				<Command>
					<CommandInput placeholder={'Поиск…'} />
					<CommandList>
						<CommandEmpty>Ничего не найдено</CommandEmpty>
						{options.map((o) => (
							<CommandItem
								key={o.value}
								data-checked={selected.includes(o.value)}
								value={o.label}
								onSelect={() => toggle(o.value)}
							>
								{o.label}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
