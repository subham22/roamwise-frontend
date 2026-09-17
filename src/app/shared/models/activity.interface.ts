export interface CreateActivityRequest {
	name: string;
	startTime: string;
	endTime: string;
	sequence: number;
	notes?: string;
}
