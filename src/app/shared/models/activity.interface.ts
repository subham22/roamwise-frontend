export interface CreateActivityRequest {
	name: string;
	startTime: string;
	endTime: string;
	sequence: number;
	notes?: string;
	latitude: number;
	longitude: number;
	photoReference: string;
}


export interface FeasibilityIssue {
	activityId: number,
	message: string
}