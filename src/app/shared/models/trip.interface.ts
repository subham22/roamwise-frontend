export interface TripResponse {
	tripId: number;
	origin: string;
	destination: string;
	startDate: string;
	endDate: string;
	budget: number;
	myRole?: TripRole;
}

export type TripRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface TripMember {
	id: number | null; // null for the owner row
	email: string;
	role: TripRole;
}

export interface VoteSummary {
	up: number;
	down: number;
	mine: -1 | 0 | 1;
}

export interface TripDetail {
	budget: number;
	days: TripDay[];
	destination: string;
	endDate: string;
	origin: string;
	startDate: string;
	tripId: number;
	accommodations: AccommodationResponse[]
	budgetStayPct: string;
	budgetFoodPct: string;
	budgetActivitiesPct: string;
	budgetTransportPct: string;
	travelModeSuggestion?: string;
	myRole?: TripRole;
	memberCount?: number;
	
}

export interface AccommodationResponse {
	id: number;
	hotelName: string;
	checkInDate: string;
	checkOutDate: string;
	pricePerNight: number;
	notes: string;
}

export interface TripDay {
	activities: TripActivity[];
	dayDate: string;
	dayNo: number;
	id: number;
}

export interface TripActivity {
	endTime: string;
	id: number;
	name: string;
	notes: string;
	sequence: number;
	startTime: string;
	latitude: number;
	longitude: number;
	photoReference: string;
	isHiddenGem?: boolean,
	reviewSnippet?: string | null
}

export interface CreateTripRequest {
	origin: string;
	destination: string;
	startDate: string;
	endDate: string;
	budget: number;
	interests?: string
}

export interface TripDraft {
	destination: string;
	duration: string;
	budget: string;
	vibe: string;
}