export interface TripResponse {
	tripId: number;
	origin: string;
	destination: string;
	startDate: string;
	endDate: string;
	budget: number;
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