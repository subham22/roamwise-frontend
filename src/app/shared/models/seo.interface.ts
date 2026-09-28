export interface SeoConfig {
  title: string;        // keep under ~60 chars; " | Roamwise" is appended
  description: string;  // ~150-160 chars
  path: string;         // '/' or '/guides/jaipur-3-day-itinerary'
  image?: string;       // absolute URL, or a path that gets siteUrl prepended
  type?: 'website' | 'article';
  noindex?: boolean;
}