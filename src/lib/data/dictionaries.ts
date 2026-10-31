export const GENDERS = [
	{ value: 'male', label: 'Мужской' },
	{ value: 'female', label: 'Женский' },
] as const;

export const STATUSES = [
	{ value: 'active', label: 'На учёте' },
	{ value: 'review', label: 'На проверке' },
	{ value: 'suspended', label: 'Приостановлен' },
	{ value: 'removed', label: 'Снят с учёта' },
] as const;

export const CATEGORIES = [
	{ value: 'pensioner', label: 'Пенсионер' },
	{ value: 'large-family', label: 'Многодетная семья' },
	{ value: 'disabled', label: 'Инвалид' },
	{ value: 'veteran', label: 'Ветеран труда' },
	{ value: 'young-family', label: 'Молодая семья' },
	{ value: 'low-income', label: 'Малоимущий' },
	{ value: 'other', label: 'Другое' },
] as const;

export const REGIONS = [
	{ value: 'moscow', label: 'Москва', cities: ['Москва', 'Зеленоград'] },
	{
		value: 'spb',
		label: 'Санкт-Петербург',
		cities: ['Санкт-Петербург', 'Петергоф', 'Пушкин'],
	},
	{
		value: 'tatarstan',
		label: 'Татарстан',
		cities: ['Казань', 'Набережные Челны', 'Нижнекамск'],
	},
	{
		value: 'samara',
		label: 'Самарская область',
		cities: ['Самара', 'Тольятти', 'Сызрань'],
	},
	{
		value: 'sverdlovsk',
		label: 'Свердловская область',
		cities: ['Екатеринбург', 'Каменск-Уральский', 'Ирбит'],
	},
	{
		value: 'novosibirsk',
		label: 'Новосибирская область',
		cities: ['Новосибирск', 'Обь', 'Бердск'],
	},
	{
		value: 'krasnoyarsk',
		label: 'Красноярский край',
		cities: ['Красноярск', 'Ачинск', 'Железногорск'],
	},
	{
		value: 'khabarovsk',
		label: 'Хабаровский край',
		cities: ['Хабаровск', 'Комсомольск-на-Амуре', 'Амурск'],
	},
	{
		value: 'primorsky',
		label: 'Приморский край',
		cities: ['Владивосток', 'Находка', 'Арсеньев'],
	},
	{
		value: 'moscow-oblast',
		label: 'Московская область',
		cities: ['Балашиха', 'Химки', 'Подольск'],
	},
	{
		value: 'krasnodar',
		label: 'Краснодарский край',
		cities: ['Краснодар', 'Сочи', 'Новороссийск'],
	},
	{
		value: 'rostov',
		label: 'Ростовская область',
		cities: ['Ростов-на-Дону', 'Таганрог', 'Шахты'],
	},
	{
		value: 'nizhny-novgorod',
		label: 'Нижегородская область',
		cities: ['Нижний Новгород', 'Дзержинск', 'Арзамас'],
	},
] as const;

export type CitizenGender = (typeof GENDERS)[number]['value'];
export type CitizenStatus = (typeof STATUSES)[number]['value'];
export type CitizenCategory = (typeof CATEGORIES)[number]['value'];
export type CitizenRegion = (typeof REGIONS)[number]['value'];

export const labelOf = (
	dict: readonly { value: string; label: string }[],
	value: string,
) => dict.find((o) => o.value === value)?.label ?? value;
