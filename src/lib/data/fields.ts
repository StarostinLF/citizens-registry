import type { CitizenDetails } from '@/lib/types/citizen';
import type { FieldPath } from 'react-hook-form';

import {
	CATEGORIES,
	GENDERS,
	MARITAL_STATUSES,
	REGIONS,
	STATUSES,
} from '@/lib/data/dictionaries';

type Option = { value: string; label: string };

export interface FieldDef {
	name: FieldPath<CitizenDetails>;
	label: string;
	type?:
		| 'date'
		| 'email'
		| 'multi'
		| 'number'
		| 'search'
		| 'select'
		| 'switch'
		| 'textarea';
	options?: readonly Option[];
	sample?: readonly string[] | string;
	min?: number;
	max?: number;
	future?: boolean;
}

export interface FieldGroup {
	title: string;
	fields: FieldDef[];
}

const opts = (...labels: string[]): Option[] =>
	labels.map((l) => ({ value: l, label: l }));

const f = (key: string, label: string, rest: Partial<FieldDef> = {}) =>
	({ name: `extra.${key}`, label, ...rest }) as FieldDef;
const text = (k: string, l: string, sample?: FieldDef['sample']) =>
	f(k, l, { sample });
const num = (k: string, l: string, min = 0, max = 10) =>
	f(k, l, { type: 'number', min, max });
const date = (k: string, l: string, future = false) =>
	f(k, l, { type: 'date', future });
const sel = (k: string, l: string, ...o: string[]) =>
	f(k, l, { type: 'select', options: opts(...o) });
const search = (k: string, l: string, ...o: string[]) =>
	f(k, l, { type: 'search', options: opts(...o) });
const multi = (k: string, l: string, ...o: string[]) =>
	f(k, l, { type: 'multi', options: opts(...o) });
const flag = (k: string, l: string) => f(k, l, { type: 'switch' });

const BANKS = [
	'Сбербанк',
	'ВТБ',
	'Газпромбанк',
	'Почта Банк',
	'Альфа-Банк',
	'Россельхозбанк',
];
const CLINICS = [
	'Поликлиника № 1',
	'Поликлиника № 3',
	'Городская больница № 2',
	'Центр здоровья',
	'Районная поликлиника',
];
const DEPARTMENTS = [
	'Центральное отделение',
	'Северное отделение',
	'Южное отделение',
	'Восточное отделение',
	'Западное отделение',
	'МФЦ «Мои документы»',
];

export const GROUPS: FieldGroup[] = [
	{
		title: 'Персональные данные',
		fields: [
			{ name: 'lastName', label: 'Фамилия' },
			{ name: 'firstName', label: 'Имя' },
			{ name: 'middleName', label: 'Отчество' },
			{ name: 'gender', label: 'Пол', type: 'select', options: GENDERS },
			{ name: 'birthDate', label: 'Дата рождения', type: 'date' },
			{ name: 'birthPlace', label: 'Место рождения' },
			{ name: 'citizenship', label: 'Гражданство' },
			{
				name: 'maritalStatus',
				label: 'Семейное положение',
				type: 'select',
				options: MARITAL_STATUSES,
			},
			{ name: 'snils', label: 'СНИЛС' },
			{ name: 'inn', label: 'ИНН' },
		],
	},
	{
		title: 'Паспорт',
		fields: [
			{ name: 'passportSeries', label: 'Серия' },
			{ name: 'passportNumber', label: 'Номер' },
			{ name: 'passportIssuedBy', label: 'Кем выдан' },
			{ name: 'passportIssuedAt', label: 'Дата выдачи', type: 'date' },
			{ name: 'passportCode', label: 'Код подразделения' },
		],
	},
	{
		title: 'Адрес регистрации',
		fields: [
			{
				name: 'region',
				label: 'Регион',
				type: 'search',
				options: REGIONS.map((r) => ({ value: r.value, label: r.label })),
			},
			{ name: 'city', label: 'Город' },
			{ name: 'zip', label: 'Индекс' },
			{ name: 'street', label: 'Улица' },
			{ name: 'house', label: 'Дом' },
			{ name: 'apartment', label: 'Квартира' },
		],
	},
	{
		title: 'Контакты',
		fields: [
			{ name: 'phone', label: 'Телефон' },
			{ name: 'workPhone', label: 'Рабочий телефон' },
			{ name: 'email', label: 'Email', type: 'email' },
		],
	},
	{
		title: 'Учёт',
		fields: [
			{
				name: 'category',
				label: 'Категория',
				type: 'select',
				options: CATEGORIES,
			},
			{ name: 'status', label: 'Статус', type: 'select', options: STATUSES },
			{ name: 'registeredAt', label: 'Дата постановки', type: 'date' },
			{ name: 'manager', label: 'Ответственный сотрудник' },
			{ name: 'smsNotify', label: 'Уведомления по SMS', type: 'switch' },
			{
				name: 'consentPd',
				label: 'Согласие на обработку персональных данных',
				type: 'switch',
			},
			{ name: 'note', label: 'Примечание', type: 'textarea' },
		],
	},
	{
		title: 'Дополнительные документы',
		fields: [
			text('foreignSeries', 'Серия загранпаспорта', '## ##'),
			text('foreignNumber', 'Номер загранпаспорта', '#######'),
			date('foreignUntil', 'Загранпаспорт действует до', true),
			text('driverLicense', 'Водительское удостоверение', '## ## ######'),
			multi(
				'driverCategories',
				'Категории прав',
				'A',
				'B',
				'C',
				'D',
				'BE',
				'CE',
			),
			text('omsNumber', 'Полис ОМС', '################'),
			search(
				'omsCompany',
				'Страховая компания ОМС',
				'Ингосстрах-М',
				'СОГАЗ-Мед',
				'Капитал МС',
				'РЕСО-Мед',
			),
			flag('dms', 'Есть полис ДМС'),
			text('birthCertificate', 'Свидетельство о рождении', 'I-ЮД №######'),
			text('militaryId', 'Военный билет', '?? #######'),
		],
	},
	{
		title: 'Фактический адрес проживания',
		fields: [
			flag('sameAddress', 'Совпадает с регистрацией'),
			search('liveRegion', 'Регион', ...REGIONS.map((r) => r.label)),
			text('liveCity', 'Город', [
				'Москва',
				'Казань',
				'Самара',
				'Томск',
				'Омск',
				'Тверь',
			]),
			text('liveStreet', 'Улица', [
				'Ленина',
				'Мира',
				'Советская',
				'Гагарина',
				'Победы',
				'Садовая',
			]),
			num('liveHouse', 'Дом', 1, 150),
			text('liveBuilding', 'Корпус', ['1', '2', 'А', 'Б']),
			num('liveEntrance', 'Подъезд', 1, 8),
			num('liveFloor', 'Этаж', 1, 25),
			num('liveApartment', 'Квартира', 1, 300),
			text('intercom', 'Код домофона', '###?'),
			sel(
				'housingType',
				'Тип жилья',
				'Квартира',
				'Частный дом',
				'Общежитие',
				'Комната',
				'Служебное жильё',
			),
			sel(
				'ownership',
				'Форма собственности',
				'Собственность',
				'Социальный наём',
				'Аренда',
				'Проживает у родственников',
			),
			num('livingArea', 'Площадь, м²', 12, 140),
			num('rooms', 'Число комнат', 1, 5),
			num('registeredCount', 'Прописано человек', 1, 7),
			date('registeredHomeAt', 'Дата регистрации по месту жительства'),
		],
	},
	{
		title: 'Семья и социальное положение',
		fields: [
			num('children', 'Количество детей', 0, 6),
			num('minorChildren', 'Несовершеннолетних детей', 0, 4),
			num('dependents', 'Иждивенцев', 0, 5),
			sel(
				'familyType',
				'Состав семьи',
				'Полная',
				'Неполная',
				'Многопоколенная',
				'Одиноко проживающий',
			),
			sel(
				'familyStatus',
				'Статус семьи',
				'Обычная',
				'Многодетная',
				'Малоимущая',
				'Молодая',
				'В трудной ситуации',
			),
			flag('singleParent', 'Одинокий родитель'),
			flag('pregnant', 'Беременность'),
			flag('guardian', 'Опекун / попечитель'),
			sel(
				'housingNeed',
				'Жилищные условия',
				'Удовлетворительные',
				'Нуждается в улучшении',
				'Аварийное жильё',
				'Нет жилья',
			),
			flag('housingQueue', 'Состоит в очереди на жильё'),
			date('queueDate', 'Дата постановки в очередь'),
			num('queueNumber', 'Номер в очереди', 1, 5000),
			flag('socialContract', 'Получатель соцконтракта'),
		],
	},
	{
		title: 'Образование и занятость',
		fields: [
			sel(
				'education',
				'Уровень образования',
				'Среднее',
				'Среднее специальное',
				'Бакалавриат',
				'Специалитет',
				'Магистратура',
				'Аспирантура',
			),
			text('school', 'Учебное заведение', [
				'Политехнический университет',
				'Педагогический колледж',
				'Государственный университет',
				'Технический колледж',
			]),
			text('specialty', 'Специальность', [
				'Экономика',
				'Право',
				'Строительство',
				'Педагогика',
				'Медицина',
				'Информатика',
			]),
			num('graduationYear', 'Год окончания', 1975, 2025),
			sel('degree', 'Учёная степень', 'Нет', 'Кандидат наук', 'Доктор наук'),
			multi(
				'languages',
				'Иностранные языки',
				'Английский',
				'Немецкий',
				'Французский',
				'Китайский',
				'Испанский',
				'Татарский',
			),
			multi(
				'skills',
				'Профессиональные навыки',
				'Бухгалтерия',
				'Вождение',
				'Сварка',
				'Программирование',
				'Преподавание',
				'Уход за больными',
				'Делопроизводство',
			),
			sel(
				'employment',
				'Статус занятости',
				'Работает',
				'Не работает',
				'Пенсионер',
				'Студент',
				'Самозанятый',
				'Безработный',
			),
			text('employer', 'Место работы', [
				'ООО «Альфа»',
				'МУП «Горсвет»',
				'АО «Заря»',
				'ГБУЗ «Городская больница»',
				'ИП Иванов',
			]),
			text('jobTitle', 'Должность', [
				'Инженер',
				'Бухгалтер',
				'Водитель',
				'Менеджер',
				'Учитель',
				'Рабочий',
			]),
			num('experience', 'Общий стаж, лет', 0, 45),
			num('experienceCont', 'Непрерывный стаж, лет', 0, 30),
			date('hiredAt', 'Дата трудоустройства'),
			flag('jobCenter', 'Состоит на учёте в ЦЗН'),
			flag('unemployedBenefit', 'Получает пособие по безработице'),
			flag('selfEmployed', 'Самозанятый'),
		],
	},
	{
		title: 'Доходы и финансы',
		fields: [
			num('incomePerCapita', 'Среднедушевой доход, ₽', 8000, 90000),
			num('incomeFamily', 'Доход семьи, ₽', 15000, 250000),
			multi(
				'incomeSources',
				'Источники дохода',
				'Заработная плата',
				'Пенсия',
				'Пособия',
				'Алименты',
				'Стипендия',
				'Предпринимательство',
				'Социальные выплаты',
			),
			sel(
				'pensionType',
				'Вид пенсии',
				'Нет',
				'По старости',
				'По инвалидности',
				'По потере кормильца',
				'Социальная',
			),
			num('pensionAmount', 'Размер пенсии, ₽', 9000, 55000),
			date('pensionAt', 'Дата назначения пенсии'),
			num('livingWage', 'Прожиточный минимум региона, ₽', 13000, 21000),
			sel(
				'taxStatus',
				'Налоговый статус',
				'Резидент',
				'Нерезидент',
				'Плательщик НПД',
				'Освобождён',
			),
			flag('utilityDebt', 'Есть задолженность по ЖКУ'),
			num('utilityDebtSum', 'Сумма задолженности, ₽', 0, 150000),
			search('bank', 'Банк для выплат', ...BANKS),
			text('account', 'Номер счёта', '####################'),
			text('bik', 'БИК', '04#######'),
			sel('cardType', 'Платёжная карта', 'Мир', 'Нет карты', 'Другая'),
		],
	},
	{
		title: 'Здоровье и инвалидность',
		fields: [
			sel(
				'disabilityGroup',
				'Группа инвалидности',
				'Нет',
				'I группа',
				'II группа',
				'III группа',
				'Ребёнок-инвалид',
			),
			sel(
				'disabilityCause',
				'Причина инвалидности',
				'Общее заболевание',
				'Трудовое увечье',
				'Военная травма',
				'С детства',
			),
			date('disabilityUntil', 'Инвалидность установлена до', true),
			date('msecAt', 'Дата освидетельствования МСЭ'),
			text('msecNumber', 'Номер справки МСЭ', 'МСЭ-######'),
			flag('ipra', 'Есть ИПРА'),
			flag('needCare', 'Нуждается в постороннем уходе'),
			sel(
				'healthGroup',
				'Группа здоровья',
				'I',
				'II',
				'IIIа',
				'IIIб',
				'IV',
				'V',
			),
			multi(
				'diseases',
				'Хронические заболевания',
				'Гипертония',
				'Диабет',
				'Артрит',
				'Астма',
				'Заболевания сердца',
				'Заболевания зрения',
				'Заболевания слуха',
			),
			sel('bloodType', 'Группа крови', 'I (0)', 'II (A)', 'III (B)', 'IV (AB)'),
			text('allergies', 'Аллергии', [
				'Нет',
				'Пыльца',
				'Пенициллин',
				'Пищевая',
				'Бытовая пыль',
			]),
			multi(
				'rehab',
				'Технические средства реабилитации',
				'Трость',
				'Костыли',
				'Ходунки',
				'Кресло-коляска',
				'Слуховой аппарат',
				'Протез',
			),
			search('clinic', 'Прикреплён к поликлинике', ...CLINICS),
			flag('dispensary', 'Диспансерный учёт'),
			date('checkupAt', 'Дата последней диспансеризации'),
			flag('freeMedicine', 'Льготное лекарственное обеспечение'),
		],
	},
	{
		title: 'Льготы и меры поддержки',
		fields: [
			search(
				'mainBenefit',
				'Основная льгота',
				'Льгота по ЖКУ',
				'Льгота на проезд',
				'Налоговая льгота',
				'Лекарственное обеспечение',
				'Санаторно-курортное лечение',
				'Земельный налог',
			),
			multi(
				'extraBenefits',
				'Дополнительные льготы',
				'ЖКУ',
				'Проезд',
				'Налоги',
				'Лекарства',
				'Санаторий',
				'Связь',
				'Протезирование',
			),
			sel(
				'benefitBasis',
				'Основание льготы',
				'Удостоверение',
				'Справка МСЭ',
				'Решение комиссии',
				'Заявление',
			),
			text('benefitCert', 'Номер удостоверения', '##-######'),
			date('benefitIssued', 'Дата выдачи удостоверения'),
			date('benefitUntil', 'Срок действия', true),
			flag('edv', 'Право на ЕДВ'),
			flag('nsu', 'Набор социальных услуг'),
			flag('spa', 'Санаторно-курортное лечение'),
			multi(
				'transport',
				'Бесплатный проезд',
				'Городской',
				'Пригородный',
				'Междугородний',
				'Железнодорожный',
			),
			sel(
				'housingCompensation',
				'Компенсация ЖКУ',
				'Нет',
				'Частичная',
				'Полная',
			),
			num('compensationPct', 'Размер компенсации, %', 0, 100),
			flag('combatVeteran', 'Ветеран боевых действий'),
			flag('homeFront', 'Труженик тыла'),
			flag('warChild', 'Дети войны'),
			multi(
				'awards',
				'Знаки отличия',
				'Ветеран труда',
				'Почётный донор',
				'Медаль за трудовую доблесть',
				'Грамота министерства',
			),
		],
	},
	{
		title: 'Воинский учёт',
		fields: [
			sel(
				'militaryRelation',
				'Отношение к воинской обязанности',
				'Не служил',
				'Служил',
				'Годен',
				'Не годен',
				'Освобождён',
			),
			sel(
				'rank',
				'Воинское звание',
				'Рядовой',
				'Сержант',
				'Прапорщик',
				'Лейтенант',
				'Капитан',
				'Майор',
			),
			sel('reserve', 'Категория запаса', '1', '2', '3'),
			search(
				'commissariat',
				'Военный комиссариат',
				'Центральный',
				'Северный',
				'Южный',
				'Восточный',
				'Западный',
			),
			text('vus', 'ВУС', '######?'),
			sel('fitness', 'Категория годности', 'А', 'Б', 'В', 'Г', 'Д'),
			date('deregisteredAt', 'Дата снятия с воинского учёта'),
			flag('svo', 'Участник СВО'),
			text('veteranCert', 'Удостоверение ветерана', 'Б №######'),
		],
	},
	{
		title: 'Коммуникация и представители',
		fields: [
			sel(
				'contactWay',
				'Предпочитаемый способ связи',
				'Телефон',
				'SMS',
				'Email',
				'Мессенджер',
				'Личный визит',
			),
			multi(
				'commLanguages',
				'Языки общения',
				'Русский',
				'Татарский',
				'Башкирский',
				'Якутский',
				'Английский',
				'Жестовый',
			),
			sel(
				'callTime',
				'Удобное время для звонка',
				'Утро (9–12)',
				'День (12–17)',
				'Вечер (17–20)',
				'Любое',
			),
			multi(
				'messengers',
				'Мессенджеры',
				'Telegram',
				'WhatsApp',
				'Max',
				'Viber',
			),
			f('notifyEmail', 'Email для уведомлений', { type: 'email' }),
			text('extraPhone', 'Дополнительный телефон', '+7 (9##) ###-##-##'),
			text('contactPerson', 'Контактное лицо', [
				'Иванова М. А.',
				'Петров С. В.',
				'Сидорова Е. П.',
				'Козлов Д. И.',
			]),
			text('contactPhone', 'Телефон контактного лица', '+7 (9##) ###-##-##'),
			sel(
				'contactRelation',
				'Кем приходится',
				'Супруг(а)',
				'Сын',
				'Дочь',
				'Сосед',
				'Социальный работник',
			),
			flag('agreeEmail', 'Согласие на email-рассылку'),
			flag('agreePush', 'Согласие на push-уведомления'),
			flag('agreeTransfer', 'Согласие на передачу данных'),
			flag('signLanguage', 'Нужен сурдопереводчик'),
			flag('escort', 'Нужен сопровождающий'),
			flag('hasRepresentative', 'Есть законный представитель'),
			text('representative', 'ФИО представителя', [
				'Иванова Мария Александровна',
				'Петров Сергей Викторович',
				'Сидорова Елена Павловна',
			]),
			text('powerOfAttorney', 'Номер доверенности', '77 АБ ######'),
			date('powerDate', 'Дата доверенности'),
		],
	},
	{
		title: 'Служебная информация',
		fields: [
			sel(
				'source',
				'Источник обращения',
				'Личный приём',
				'Портал госуслуг',
				'Телефон',
				'Почта',
				'МФЦ',
				'Соцзащита',
			),
			sel(
				'channel',
				'Канал регистрации',
				'Очно',
				'Онлайн',
				'Через представителя',
				'Межведомственный запрос',
			),
			search('department', 'Отделение', ...DEPARTMENTS),
			sel('priority', 'Приоритет', 'Низкий', 'Обычный', 'Высокий', 'Срочный'),
			sel('risk', 'Уровень риска', 'Низкий', 'Средний', 'Высокий'),
			multi(
				'tags',
				'Теги',
				'Одинокий',
				'Маломобильный',
				'Требует визита',
				'Проверить документы',
				'Повторное обращение',
				'VIP',
			),
			date('checkedAt', 'Дата последней проверки'),
			date('nextCheckAt', 'Дата следующего контроля', true),
			date('lastContactAt', 'Дата последнего контакта'),
			flag('verified', 'Данные верифицированы'),
			flag('smev', 'Проверен по СМЭВ'),
			num('satisfaction', 'Оценка удовлетворённости', 1, 5),
			text('caseNumber', 'Номер дела', 'Д-######'),
			text('archiveNumber', 'Архивный номер', 'А-####/##'),
			date('caseCreatedAt', 'Дата создания дела'),
			sel(
				'ownerDepartment',
				'Ответственный отдел',
				'Отдел учёта',
				'Отдел выплат',
				'Отдел опеки',
				'Юридический отдел',
			),
			f('internalNote', 'Внутренний комментарий', {
				type: 'textarea',
				sample: [
					'',
					'Требуется повторная проверка',
					'Ожидается пакет документов',
					'Связаться после 15:00',
				],
			}),
		],
	},
];
