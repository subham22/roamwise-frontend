export interface JobStatusResponse {
	jobId: number;
	status: string;
	resultTripId: number;
	errorMessage: string;
}