export interface CreateDayRequest {
    dayNo: number;
    dayDate: string
}

export interface ActivityResponse {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    sequence: number;
    notes: string;
}

export interface DayResponse {
    id: number;
    dayDate: string;
    dayNo: number;
    activities: ActivityResponse[];
}