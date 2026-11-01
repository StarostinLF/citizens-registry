export const SECTIONS = [
	{
		key: 'family',
		label: 'Члены семьи',
		columns: [
			{ key: 'name', label: 'ФИО' },
			{ key: 'relation', label: 'Родство' },
			{ key: 'birthDate', label: 'Дата рождения' },
			{ key: 'phone', label: 'Телефон' },
			{ key: 'dependent', label: 'Иждивенец' },
		],
	},
	{
		key: 'education',
		label: 'Образование',
		columns: [
			{ key: 'level', label: 'Уровень' },
			{ key: 'institution', label: 'Учреждение' },
			{ key: 'specialty', label: 'Специальность' },
			{ key: 'year', label: 'Год окончания' },
		],
	},
	{
		key: 'work',
		label: 'Работа',
		columns: [
			{ key: 'organization', label: 'Организация' },
			{ key: 'position', label: 'Должность' },
			{ key: 'from', label: 'С' },
			{ key: 'to', label: 'По' },
		],
	},
	{
		key: 'benefits',
		label: 'Льготы',
		columns: [
			{ key: 'type', label: 'Льгота' },
			{ key: 'basis', label: 'Основание' },
			{ key: 'from', label: 'Действует с' },
			{ key: 'to', label: 'Действует по' },
			{ key: 'status', label: 'Статус' },
		],
	},
	{
		key: 'payments',
		label: 'Выплаты',
		columns: [
			{ key: 'date', label: 'Дата' },
			{ key: 'type', label: 'Вид выплаты' },
			{ key: 'amount', label: 'Сумма' },
			{ key: 'status', label: 'Статус' },
		],
	},
	{
		key: 'documents',
		label: 'Документы',
		columns: [
			{ key: 'type', label: 'Документ' },
			{ key: 'number', label: 'Номер' },
			{ key: 'issuedBy', label: 'Кем выдан' },
			{ key: 'issuedAt', label: 'Дата выдачи' },
		],
	},
	{
		key: 'appeals',
		label: 'Обращения',
		columns: [
			{ key: 'number', label: '№' },
			{ key: 'topic', label: 'Тема' },
			{ key: 'date', label: 'Дата' },
			{ key: 'status', label: 'Статус' },
		],
	},
	{
		key: 'addresses',
		label: 'Адреса',
		columns: [
			{ key: 'type', label: 'Тип' },
			{ key: 'address', label: 'Адрес' },
			{ key: 'from', label: 'С' },
			{ key: 'to', label: 'По' },
		],
	},
	{
		key: 'property',
		label: 'Имущество',
		columns: [
			{ key: 'type', label: 'Вид' },
			{ key: 'object', label: 'Объект' },
			{ key: 'share', label: 'Доля' },
			{ key: 'cadastral', label: 'Кадастровый номер' },
			{ key: 'value', label: 'Стоимость' },
		],
	},
	{
		key: 'vehicles',
		label: 'Транспорт',
		columns: [
			{ key: 'brand', label: 'Марка' },
			{ key: 'plate', label: 'Госномер' },
			{ key: 'year', label: 'Год выпуска' },
			{ key: 'right', label: 'Право' },
		],
	},
	{
		key: 'military',
		label: 'Воинский учёт',
		columns: [
			{ key: 'date', label: 'Дата' },
			{ key: 'event', label: 'Событие' },
			{ key: 'commissariat', label: 'Военкомат' },
			{ key: 'document', label: 'Документ' },
		],
	},
	{
		key: 'disability',
		label: 'Инвалидность',
		columns: [
			{ key: 'group', label: 'Группа' },
			{ key: 'cause', label: 'Причина' },
			{ key: 'from', label: 'Установлена' },
			{ key: 'to', label: 'Действует до' },
			{ key: 'act', label: 'Акт МСЭ' },
		],
	},
	{
		key: 'medical',
		label: 'Медицина',
		columns: [
			{ key: 'date', label: 'Дата' },
			{ key: 'type', label: 'Вид' },
			{ key: 'institution', label: 'Учреждение' },
			{ key: 'result', label: 'Результат' },
		],
	},
	{
		key: 'income',
		label: 'Доходы',
		columns: [
			{ key: 'year', label: 'Год' },
			{ key: 'source', label: 'Источник' },
			{ key: 'amount', label: 'Сумма' },
			{ key: 'document', label: 'Подтверждение' },
		],
	},
	{
		key: 'housing',
		label: 'Жильё',
		columns: [
			{ key: 'address', label: 'Адрес' },
			{ key: 'type', label: 'Тип' },
			{ key: 'area', label: 'Площадь' },
			{ key: 'ownership', label: 'Основание' },
			{ key: 'status', label: 'Статус' },
		],
	},
	{
		key: 'services',
		label: 'Соцуслуги',
		columns: [
			{ key: 'service', label: 'Услуга' },
			{ key: 'provider', label: 'Поставщик' },
			{ key: 'from', label: 'С' },
			{ key: 'to', label: 'По' },
			{ key: 'status', label: 'Статус' },
		],
	},
	{
		key: 'courts',
		label: 'Судебные дела',
		columns: [
			{ key: 'number', label: 'Номер дела' },
			{ key: 'court', label: 'Суд' },
			{ key: 'category', label: 'Категория' },
			{ key: 'date', label: 'Дата' },
			{ key: 'result', label: 'Результат' },
		],
	},
	{
		key: 'files',
		label: 'Вложения',
		columns: [
			{ key: 'name', label: 'Файл' },
			{ key: 'kind', label: 'Тип' },
			{ key: 'size', label: 'Размер' },
			{ key: 'date', label: 'Загружен' },
			{ key: 'author', label: 'Автор' },
		],
	},
	{
		key: 'visits',
		label: 'Приёмы',
		columns: [
			{ key: 'date', label: 'Дата' },
			{ key: 'department', label: 'Отделение' },
			{ key: 'purpose', label: 'Цель' },
			{ key: 'employee', label: 'Сотрудник' },
			{ key: 'result', label: 'Результат' },
		],
	},
	{
		key: 'contacts',
		label: 'История контактов',
		columns: [
			{ key: 'date', label: 'Дата' },
			{ key: 'channel', label: 'Канал' },
			{ key: 'direction', label: 'Направление' },
			{ key: 'employee', label: 'Сотрудник' },
			{ key: 'summary', label: 'Суть' },
		],
	},
] as const;

export type SectionKey = (typeof SECTIONS)[number]['key'];
