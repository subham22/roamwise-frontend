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
}

export interface CreateTripRequest {
	origin: string;
	destination: string;
	startDate: string;
	endDate: string;
	budget: number;
}

export interface TripDraft {
	destination: string;
	duration: string;
	budget: string;
	vibe: string;
}