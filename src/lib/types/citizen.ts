import type {
	CitizenCategory,
	CitizenGender,
	CitizenRegion,
	CitizenStatus,
} from '@/lib/data/dictionaries';

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
