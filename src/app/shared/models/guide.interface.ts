export interface GuideDetail {
	slug: string;
	title: string;
	destination: string;
	metaDescription: string;
	heroImageUrl: string;
	days: GuideDayResponse[];
}

export interface GuideDayResponse {
	dayNo: number | null;
	dayLabel: string;
	activities: GuideActivityResponse[];
}

export interface GuideActivityResponse {
	name: string;
	startTime: string | null;
	endTime: string | null;
	notes: string;
	sequence: number | null;
	isHiddenGem: boolean | null;
	reviewSnippet: string;
	latitude: number | null;
	longitude: number | null;
	photoReference: string;
}

export interface GuideSummary {
	slug: string;
	title: string;
	destination: string;
	metaDescription: string;
	heroImageUrl: string;
}