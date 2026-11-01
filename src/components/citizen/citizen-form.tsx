import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { CitizenDetails } from '@/lib/types/citizen';

import Combobox from '@/components/shared/combobox';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { GROUPS, type FieldDef } from '@/lib/data/fields';

type Form = ReturnType<typeof useForm<CitizenDetails>>;

function FormField({ def, form }: { def: FieldDef; form: Form }) {
	const { name, label, type, options } = def;

	return (
		<Field
			className={
				type === 'textarea' ? 'sm:col-span-2 xl:col-span-3' : undefined
			}
		>
			<FieldLabel htmlFor={name}>{label}</FieldLabel>
			{type === 'select' && options && (
				<Controller
					control={form.control}
					name={name}
					render={({ field }) => (
						<Select
							items={options}
							value={field.value as string}
							onValueChange={field.onChange}
						>
							<SelectTrigger className={'w-full'} id={name}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{options.map((o) => (
									<SelectItem key={o.value} value={o.value}>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
			)}
			{type === 'switch' && (
				<Controller
					control={form.control}
					name={name}
					render={({ field }) => (
						<div className={'flex h-8 items-center'}>
							<Switch
								checked={field.value as boolean}
								id={name}
								onCheckedChange={field.onChange}
							/>
						</div>
					)}
				/>
			)}
			{(type === 'search' || type === 'multi') && options && (
				<Controller
					control={form.control}
					name={name}
					render={({ field }) => (
						<Combobox
							id={name}
							multiple={type === 'multi'}
							options={options}
							value={field.value as string | string[]}
							onChange={field.onChange}
						/>
					)}
				/>
			)}
			{type === 'textarea' && (
				<Textarea id={name} rows={3} {...form.register(name)} />
			)}
			{(!type || type === 'date' || type === 'email' || type === 'number') && (
				<Input
					id={name}
					max={def.max}
					min={def.min}
					type={type}
					{...form.register(name)}
				/>
			)}
		</Field>
	);
}

export default function CitizenForm({ citizen }: { citizen: CitizenDetails }) {
	const queryClient = useQueryClient();
	const form = useForm<CitizenDetails>({ values: citizen });
	const { isDirty } = form.formState;

	const onSubmit = (values: CitizenDetails) => {
		queryClient.setQueryData(['citizen', citizen.id], values);
		toast.success('Изменения сохранены');
	};

	return (
		<form
			className={'flex flex-col gap-4'}
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<Card>
				<CardContent>
					<Accordion
						defaultValue={GROUPS.slice(0, 2).map((g) => g.title)}
						multiple
					>
						{GROUPS.map((group) => (
							<AccordionItem key={group.title} value={group.title}>
								<AccordionTrigger className={'text-base'}>
									{group.title}
									<span
										className={
											'text-muted-foreground ml-2 self-center text-xs font-normal'
										}
									>
										{group.fields.length} полей
									</span>
								</AccordionTrigger>
								<AccordionContent
									className={'grid gap-4 pb-4 sm:grid-cols-2 xl:grid-cols-3'}
								>
									{group.fields.map((def) => (
										<FormField key={def.name} def={def} form={form} />
									))}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</CardContent>
			</Card>
			<div className={'flex justify-end gap-2'}>
				<Button
					disabled={!isDirty}
					type={'button'}
					variant={'outline'}
					onClick={() => form.reset()}
				>
					Сбросить
				</Button>
				<Button disabled={!isDirty} type={'submit'}>
					Сохранить
				</Button>
			</div>
		</form>
	);
}
