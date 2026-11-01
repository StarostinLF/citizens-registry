import type {
	CitizenCategory,
	CitizenGender,
	CitizenMarital,
	CitizenRegion,
	CitizenStatus,
} from '@/lib/data/dictionaries';
import type { SectionKey } from '@/lib/data/sections';

export interface CitizenRow {
	id: number;
	lastName: string;
	firstName: string;
	middleName: string;
	gender: CitizenGender;
	birthDate: string;
	region: CitizenRegion;
	city: string;
	phone: string;
	category: CitizenCategory;
	status: CitizenStatus;
	registeredAt: string;
	appealsOpen: number;
}

export interface CitizenQuery {
	page: number;
	pageSize: number;
	search?: string;
	status?: CitizenStatus;
	gender?: CitizenGender;
	region?: CitizenRegion;
	category?: CitizenCategory;
	ageFrom?: number;
	ageTo?: number;
	sortBy?: keyof CitizenRow;
	sortDir?: 'asc' | 'desc';
}

export interface CitizenEvent {
	date: string;
	text: string;
}

export interface CitizenDetails extends CitizenRow {
	birthPlace: string;
	citizenship: string;
	maritalStatus: CitizenMarital;
	snils: string;
	inn: string;
	passportSeries: string;
	passportNumber: string;
	passportIssuedBy: string;
	passportIssuedAt: string;
	passportCode: string;
	email: string;
	workPhone: string;
	zip: string;
	street: string;
	house: string;
	apartment: string;
	manager: string;
	note: string;
	consentPd: boolean;
	extra: Record<string, string | boolean | string[]>;
	smsNotify: boolean;
	counts: Record<SectionKey, number>;
	events: CitizenEvent[];
}

export type SectionRow = Record<string, string>;
