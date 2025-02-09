
export interface InsightParams {
    since?: string;
    until?: string;
    time_increment?: number;
  }
  
  export interface InsightData {
    date_start: string;
    impressions: string;
    reach: string;
    clicks: string;
    spend: string;
    ctr: string;
  }
  
  export interface DateRange {
    from: Date;
    to: Date;
  }
  
  