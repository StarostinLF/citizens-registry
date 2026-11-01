import { faker } from '@faker-js/faker/locale/ru';
import { addYears, format, parseISO } from 'date-fns';

import type { CitizenDetails, SectionRow } from '@/lib/types/citizen';

import { MARITAL_STATUSES, REGIONS, labelOf } from '@/lib/data/dictionaries';
import { GROUPS, type FieldDef } from '@/lib/data/fields';
import { getCitizens, pick, toDate } from '@/lib/data/generate';
import { SECTIONS, type SectionKey } from '@/lib/data/sections';

const EVENTS = [
	'Гражданин поставлен на учёт',
	'Обновлены контактные данные',
	'Принят пакет документов',
	'Назначена льгота',
	'Зарегистрировано обращение',
	'Проведена проверка данных',
	'Изменён статус учёта',
];

const NOTES = [
	'',
	'Требуется обновить документы',
	'Просит связываться по SMS',
	'Нужна помощь при личном визите',
];

const date = (from: string | Date, to: string | Date = new Date()) =>
	format(faker.date.between({ from, to }), 'dd.MM.yyyy');

const phone = () => faker.phone.number({ style: 'national' });
const money = (min: number, max: number) =>
	`${faker.number.int({ min, max }).toLocaleString('ru-RU')} ₽`;
const status = () => pick(['Действует', 'Завершено', 'На рассмотрении']);

const makers: Record<SectionKey, () => SectionRow> = {
	family: () => ({
		name: faker.person.fullName(),
		relation: pick([
			'Супруг(а)',
			'Сын',
			'Дочь',
			'Мать',
			'Отец',
			'Брат',
			'Сестра',
		]),
		birthDate: date('1940-01-01', '2022-01-01'),
		phone: phone(),
		dependent: pick(['Да', 'Нет']),
	}),
	education: () => ({
		level: pick([
			'Среднее',
			'Среднее специальное',
			'Бакалавриат',
			'Специалитет',
			'Магистратура',
		]),
		institution: pick([
			'Школа № 12',
			'Политехнический колледж',
			'Государственный университет',
			'Педагогический институт',
			'Технический университет',
		]),
		specialty: pick([
			'Экономика',
			'Право',
			'Строительство',
			'Педагогика',
			'Медицина',
			'Информатика',
		]),
		year: String(faker.number.int({ min: 1980, max: 2025 })),
	}),
	work: () => ({
		organization: faker.company.name(),
		position: pick([
			'Инженер',
			'Бухгалтер',
			'Водитель',
			'Менеджер',
			'Учитель',
			'Рабочий',
		]),
		from: date('2000-01-01', '2018-01-01'),
		to: pick(['по н.в.', date('2018-01-01')]),
	}),
	benefits: () => ({
		type: pick([
			'Льгота по ЖКУ',
			'Льгота на проезд',
			'Налоговая льгота',
			'Лекарственное обеспечение',
		]),
		basis: pick([
			'Удостоверение',
			'Справка МСЭ',
			'Решение комиссии',
			'Заявление',
		]),
		from: date('2015-01-01', '2023-01-01'),
		to: date('2024-01-01', '2030-01-01'),
		status: status(),
	}),
	payments: () => ({
		date: date('2023-01-01'),
		type: pick([
			'Пенсия',
			'Пособие',
			'Компенсация ЖКУ',
			'Единовременная выплата',
		]),
		amount: `${faker.number.int({ min: 1000, max: 60000 }).toLocaleString('ru-RU')} ₽`,
		status: pick(['Выплачено', 'В обработке', 'Отклонено']),
	}),
	documents: () => ({
		type: pick([
			'Паспорт',
			'СНИЛС',
			'ИНН',
			'Свидетельство о рождении',
			'Справка МСЭ',
			'Удостоверение',
		]),
		number: faker.string.numeric(10),
		issuedBy: pick(['МФЦ', 'ОВМ МВД', 'ПФР', 'ЗАГС', 'Бюро МСЭ']),
		issuedAt: date('2005-01-01'),
	}),
	addresses: () => ({
		type: pick(['Регистрация', 'Проживание', 'Временная регистрация']),
		address: `${faker.location.city()}, ${faker.location.street()}, д. ${faker.number.int({ min: 1, max: 150 })}`,
		from: date('2005-01-01', '2020-01-01'),
		to: pick(['по н.в.', date('2020-01-01')]),
	}),
	property: () => ({
		type: pick(['Квартира', 'Жилой дом', 'Земельный участок', 'Гараж']),
		object: faker.location.streetAddress(),
		share: pick(['1', '1/2', '1/3', '1/4']),
		cadastral: faker.helpers.replaceSymbols('##:##:#######:###'),
		value: money(800_000, 9_000_000),
	}),
	vehicles: () => ({
		brand: pick([
			'LADA Granta',
			'Kia Rio',
			'Hyundai Solaris',
			'Renault Logan',
			'Volkswagen Polo',
		]),
		plate: faker.helpers.replaceSymbols('?###??##').toUpperCase(),
		year: String(faker.number.int({ min: 2000, max: 2025 })),
		right: pick(['Собственность', 'Аренда', 'Доверенность']),
	}),
	military: () => ({
		date: date('1990-01-01'),
		event: pick([
			'Постановка на учёт',
			'Медкомиссия',
			'Присвоено звание',
			'Переведён в запас',
		]),
		commissariat: pick(['Центральный', 'Северный', 'Южный', 'Восточный']),
		document: faker.helpers.replaceSymbols('?? #######'),
	}),
	disability: () => ({
		group: pick(['I группа', 'II группа', 'III группа']),
		cause: pick(['Общее заболевание', 'Трудовое увечье', 'С детства']),
		from: date('2010-01-01', '2023-01-01'),
		to: date('2025-01-01', '2032-01-01'),
		act: faker.helpers.replaceSymbols('МСЭ-######'),
	}),
	medical: () => ({
		date: date('2022-01-01'),
		type: pick([
			'Диспансеризация',
			'Осмотр терапевта',
			'Госпитализация',
			'Вакцинация',
			'Реабилитация',
		]),
		institution: pick([
			'Поликлиника № 1',
			'Городская больница № 2',
			'Центр здоровья',
		]),
		result: pick(['Здоров', 'Рекомендовано наблюдение', 'Назначено лечение']),
	}),
	income: () => ({
		year: String(faker.number.int({ min: 2019, max: 2025 })),
		source: pick([
			'Заработная плата',
			'Пенсия',
			'Пособие',
			'Алименты',
			'Стипендия',
		]),
		amount: money(80_000, 1_200_000),
		document: pick(['2-НДФЛ', 'Справка ПФР', 'Справка СФР', 'Декларация']),
	}),
	housing: () => ({
		address: `${faker.location.city()}, ${faker.location.street()}, д. ${faker.number.int({ min: 1, max: 150 })}`,
		type: pick(['Квартира', 'Частный дом', 'Комната', 'Общежитие']),
		area: `${faker.number.int({ min: 12, max: 140 })} м²`,
		ownership: pick(['Собственность', 'Социальный наём', 'Аренда']),
		status: pick(['Проживает', 'Снят', 'В очереди']),
	}),
	services: () => ({
		service: pick([
			'Социальное обслуживание на дому',
			'Санаторное лечение',
			'Сиделка',
			'Доставка продуктов',
			'Транспортная услуга',
		]),
		provider: pick(['КЦСОН', 'Соцзащита', 'Комплексный центр', 'НКО «Забота»']),
		from: date('2022-01-01', '2024-06-01'),
		to: date('2024-06-01', '2027-01-01'),
		status: status(),
	}),
	courts: () => ({
		number: faker.helpers.replaceSymbols('2-####/20##'),
		court: pick(['Районный суд', 'Мировой суд', 'Городской суд']),
		category: pick([
			'Жилищный спор',
			'Алименты',
			'Взыскание',
			'Социальные выплаты',
		]),
		date: date('2018-01-01'),
		result: pick(['Удовлетворено', 'Отказано', 'В производстве', 'Прекращено']),
	}),
	files: () => ({
		name: `${pick(['scan', 'spravka', 'zayavlenie', 'foto'])}_${faker.string.numeric(4)}.${pick(['pdf', 'jpg', 'docx'])}`,
		kind: pick(['Скан документа', 'Справка', 'Заявление', 'Фото']),
		size: `${faker.number.int({ min: 40, max: 4000 })} КБ`,
		date: date('2022-01-01'),
		author: faker.person.fullName(),
	}),
	visits: () => ({
		date: date('2023-01-01'),
		department: pick(['Центральное отделение', 'Северное отделение', 'МФЦ']),
		purpose: pick([
			'Подача документов',
			'Консультация',
			'Получение справки',
			'Подписание заявления',
		]),
		employee: faker.person.fullName(),
		result: pick(['Выполнено', 'Назначен повторный приём', 'Отказано']),
	}),
	contacts: () => ({
		date: date('2023-01-01'),
		channel: pick(['Телефон', 'SMS', 'Email', 'Личный визит']),
		direction: pick(['Входящий', 'Исходящий']),
		employee: faker.person.fullName(),
		summary: pick([
			'Уточнены данные',
			'Консультация по выплате',
			'Напоминание о документах',
			'Информирование о статусе',
		]),
	}),
	appeals: () => ({
		number: `ОБ-${faker.string.numeric(6)}`,
		topic: pick([
			'Назначение выплаты',
			'Смена адреса',
			'Постановка на учёт',
			'Жалоба',
			'Консультация',
		]),
		date: date('2023-01-01'),
		status: pick(['Новое', 'В работе', 'Решено', 'Закрыто']),
	}),
};

const makeValue = (d: FieldDef): string | boolean | string[] => {
	const { type, options, sample, min = 0, max = 10, future } = d;
	if (type === 'switch') return faker.datatype.boolean();
	if (type === 'number') return String(faker.number.int({ min, max }));
	if (type === 'date')
		return toDate(
			future
				? faker.date.soon({ days: 365 * 5 })
				: faker.date.between({ from: '2000-01-01', to: new Date() }),
		);
	if (type === 'multi')
		return faker.helpers.arrayElements(
			options!.map((o) => o.value),
			{ min: 0, max: 3 },
		);
	if (options) return pick(options).value;
	if (type === 'email') return faker.internet.email();
	if (typeof sample === 'string') return faker.helpers.replaceSymbols(sample);
	return sample ? pick(sample) : '';
};

const makeExtra = () =>
	Object.fromEntries(
		GROUPS.flatMap((g) => g.fields)
			.filter((d) => d.name.startsWith('extra.'))
			.map((d) => [d.name.slice(6), makeValue(d)]),
	);

export const makeDetails = (id: number): CitizenDetails | undefined => {
	const row = getCitizens()[id - 1];
	if (!row) return;

	faker.seed(id);

	return {
		...row,
		birthPlace: faker.location.city(),
		citizenship: 'Россия',
		maritalStatus: pick(MARITAL_STATUSES).value,
		snils: faker.helpers.replaceSymbols('###-###-### ##'),
		inn: faker.string.numeric(12),
		passportSeries: faker.helpers.replaceSymbols('## ##'),
		passportNumber: faker.string.numeric(6),
		passportIssuedBy: `ОУФМС России по ${labelOf(REGIONS, row.region)}`,
		passportIssuedAt: toDate(
			faker.date.between({
				from: addYears(parseISO(row.birthDate), 14),
				to: new Date(),
			}),
		),
		passportCode: faker.helpers.replaceSymbols('###-###'),
		email: faker.internet.email(),
		workPhone: phone(),
		zip: faker.string.numeric(6),
		street: faker.location.street(),
		house: String(faker.number.int({ min: 1, max: 150 })),
		apartment: String(faker.number.int({ min: 1, max: 300 })),
		manager: faker.person.fullName(),
		note: pick(NOTES),
		consentPd: faker.datatype.boolean(),
		smsNotify: faker.datatype.boolean(),
		extra: makeExtra(),
		counts: Object.fromEntries(
			SECTIONS.map((s) => [s.key, faker.number.int({ min: 0, max: 6 })]),
		) as CitizenDetails['counts'],
		events: faker.date
			.betweens({ from: row.registeredAt, to: new Date(), count: 6 })
			.reverse()
			.map((d) => ({ date: toDate(d), text: pick(EVENTS) })),
	};
};

export const makeSection = (id: number, key: SectionKey): SectionRow[] => {
	const details = makeDetails(id);
	if (!details) return [];

	faker.seed(id * 10 + SECTIONS.findIndex((s) => s.key === key));
	return Array.from({ length: details.counts[key] }, makers[key]);
};
