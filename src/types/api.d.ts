import type { DateRange as DayPickerDateRange } from "react-day-picker";

export interface DateRange extends DayPickerDateRange {
  from: Date;
  to: Date;
}

export interface InsightParams {
  since?: string;
  until?: string;
  time_increment?: number;
  breakdown?: boolean;
}

export interface AdAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
  amount_spent: string;
  balance: string;
  spend_cap: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED";
  objective: string;
}

export interface AdSet {
  id: string;
  name: string;
  optimization_goal: string;
  budget_remaining: string;
}

// export interface InsightData {
//   date_start: string;
//   date_stop: string;
//   impressions: string;
//   clicks: string;
//   spend: string;
//   reach: string;
//   frequency: string;
//   ctr: string;
//   cpc: string;
//   cpm: string;
//   age?: string;
//   gender?: string;
//   campaign_name?: string;
//   adset_name?: string;
// }
export interface InsightData {
  date_start: string;
  date_stop: string;
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  frequency: string;
  ctr: string;
  cpc: string;
  cpm: string;
  age?: string;
  gender?: string;
  campaign_name?: string;
  adset_name?: string;
  actions?: ActionValue[];
  cost_per_action_type?: ActionValue[];

  // Add percentage change fields
  impressions_pct_change?: number;
  clicks_pct_change?: number;
  spend_pct_change?: number;
  reach_pct_change?: number;
  frequency_pct_change?: number;
  ctr_pct_change?: number;
  cpc_pct_change?: number;
  cpm_pct_change?: number;
}


export interface TableMetrics {
  id: string;
  name: string;
  spend: string;
  impressions: string;
  reach: string;
  clicks: string;
  ctr: string;
  cpm: string;
  frequency: string;
  status?: string;
  objective?: string;
}

// Add these types to your api.d.ts file

export interface PlacementInsight extends InsightData {
  publisher_platform: string;
  platform_position: string;
  impression_device: string;
}

export interface ActionValue {
  action_type: string;
  value: string;
}

export interface ActionInsight extends InsightData {
  actions?: ActionValue[];
  cost_per_action_type?: ActionValue[];
}

// Update your InsightParams interface to include the enhanced parameters
export interface InsightParams {
  since?: string;
  until?: string;
  time_increment?: number;
  breakdown?: boolean;
  include_placements?: boolean;
  include_actions?: boolean;
  include_device?: boolean;
  include_percent_change?: boolean;

}

// api.d.ts
export interface InsightParams {
  since?: string;
  until?: string;
  time_increment?: number;
  breakdown?: boolean;
  include_placements?: boolean;
  include_actions?: boolean;
  include_device?: boolean; // Changed from include_devices to include_device
  include_percent_change?: boolean;

}


// Make sure ActionValue is defined
export interface ActionValue {
  action_type: string;
  value: string;
}


export interface DeviceInsight {
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  frequency: string;
  ctr: string;
  cpc: string;
  cpm: string;
  date_start: string;
  date_stop: string;
  publisher_platform?: string; // Made optional since it might not always be present
  impression_device: string;
}

export interface PlacementInsight {
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  frequency: string;
  ctr: string;
  cpc: string;
  cpm: string;
  date_start: string;
  date_stop: string;
  publisher_platform: string;
  platform_position: string;
}

export interface CreativeItem {
  ad_id: string;
  ad_name: string;
  creative_id: string;
  creative_name: string;
  creative_type: string; // "video", "image", etc.
  preview_url: string;   // thumbnail URL
  page_id: string;
  instagram_user_id?: string;
  video_url?: string;    // video URL if creative_type is "video"
}

export interface CampaignWithCreatives extends Campaign {
  creatives: CreativeItem[];
}