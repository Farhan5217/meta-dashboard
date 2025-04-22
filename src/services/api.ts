
import axios from "axios";
import { API_BASE_URL } from "@/config/constants";
import type { InsightParams } from "@/types/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const url_API = axios.create({
  baseURL: "https://meta-dashboard-backend.onrender.com/api",
});


export const getAdAccounts = async () => {
  const response = await api.get("/adaccounts");
  return response.data;
};

export const getAdAccountInsights = async (
  adAccountId: string,
  params?: InsightParams
) => {
  const response = await api.get(`/adaccounts/${adAccountId}/insights`, { params });
  return response.data;
};

export const getCombinedAdAccountInsights = async (
  adAccountId: string,
  dateRange: { from: Date; to: Date }
) => {
  // Prepare date parameters
  const dateParams = {
    since: dateRange.from.toISOString().split('T')[0],
    until: dateRange.to.toISOString().split('T')[0],
  };

  // Make two separate API calls
  const [breakdownInsights, percentChangeInsights] = await Promise.all([
    // Get time series data with breakdown=true
    getAdAccountInsights(adAccountId, {
      ...dateParams,
      time_increment: 1,
      breakdown: true,
      include_percent_change: false
    }),
    
    // Get aggregated data with percentage changes
    getAdAccountInsights(adAccountId, {
      ...dateParams,
      breakdown: false,
      include_percent_change: true
    })
  ]);

  // Return both datasets
  return {
    timeSeriesData: breakdownInsights || [],
    percentChangeData: percentChangeInsights?.[0] || {}
  };
};



export const getCampaigns = async (adAccountId: string) => {
  const response = await api.get(`/adaccounts/${adAccountId}/campaigns`);
  return response.data;
};
export const getCombinedCampaignInsights = async (
  campaignId: string,
  dateRange: { from: Date; to: Date }
) => {
  // Prepare date parameters
  const dateParams = {
    since: dateRange.from.toISOString().split('T')[0],
    until: dateRange.to.toISOString().split('T')[0],
  };

  // Make two separate API calls
  const [breakdownInsights, percentChangeInsights] = await Promise.all([
    // Get time series data with breakdown=true
    getCampaignInsights(campaignId, {
      ...dateParams,
      time_increment: 1,
      breakdown: true,
      include_percent_change: false
    }),
    
    // Get aggregated data with percentage changes
    getCampaignInsights(campaignId, {
      ...dateParams,
      breakdown: false,
      include_percent_change: true
    })
  ]);

  // Return both datasets
  return {
    timeSeriesData: breakdownInsights || [],
    percentChangeData: percentChangeInsights?.[0] || {}
  };
};
export const getCampaignInsights = async (
  campaignId: string,
  params?: InsightParams
) => {
  const response = await api.get(`/campaigns/${campaignId}/insights`, { params });
  return response.data;
};

export const getAdSets = async (campaignId: string) => {
  const response = await api.get(`/campaigns/${campaignId}/adsets`);
  return response.data;
};

export const getAdSetInsights = async (
  adSetId: string,
  params?: InsightParams
) => {
  const response = await api.get(`/adsets/${adSetId}/insights`, { params });
  return response.data;
};

// export const getEnhancedInsights = async (adAccountId: string, params?: InsightParams) => {
//   // Construct base URL with required parameters
//   let url = `/adaccounts/${adAccountId}/enhanced-insights?include_placements=true&include_actions=true`;
  
//   // Add date parameters if provided
//   if (params?.since && params?.until) {
//     url += `&since=${params.since}&until=${params.until}`;
//   }
  
//   const response = await api.get(url);
//   return response.data;
// };



// Add this to services/api.ts

// export const getEnhancedInsights = async (
//   adAccountId: string,
//   params?: InsightParams & { include_placements?: boolean; include_actions?: boolean }
// ) => {
//   const response = await api.get(`/adaccounts/${adAccountId}/enhanced-insights`, { params });
//   return response.data;
// };



export const getEnhancedInsights = async (
  adAccountId: string,
  params?: InsightParams & { 
    include_placements?: boolean; 
    include_actions?: boolean;
    include_device?: boolean; // Changed from include_devices to include_device
  }
) => {
  const response = await api.get(`/adaccounts/${adAccountId}/enhanced-insights`, { params });
  return response.data;
};

// If you need to maintain backward compatibility, you can create a wrapper function
export const getDeviceInsights = async (
  adAccountId: string,
  dateRange: { from: Date; to: Date }
) => {
  const params = {
    since: dateRange.from.toISOString().split('T')[0],
    until: dateRange.to.toISOString().split('T')[0],
    include_device: true, // Using the correct parameter name
    include_placements: false,
    include_actions: false
  };
  
  const response = await api.get(`/adaccounts/${adAccountId}/enhanced-insights`, { params });
  return response.data;
};


// Add this to services/api.ts

export const getCampaignsWithCreatives = async (
  adAccountId: string,
  params?: { active_only?: boolean }
) => {
  const response = await api.get(`/adaccounts/${adAccountId}/campaigns-with-creatives`, { params });
  return response.data;
};


export const getCampaignCreatives = async (campaignId: string) => {
  const response = await api.get(`/campaigns/${campaignId}/creatives`);
  return response.data;
};