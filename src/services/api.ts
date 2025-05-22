
// import axios from "axios";
// import { API_BASE_URL } from "@/config/constants";
// import type { InsightParams } from "@/types/api";

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

// const url_API = axios.create({
//   baseURL: "https://meta-dashboard-backend.onrender.com/api",
// });


// export const getAdAccounts = async () => {
//   const response = await api.get("/adaccounts");
//   return response.data;
// };

// export const getAdAccountInsights = async (
//   adAccountId: string,
//   params?: InsightParams
// ) => {
//   const response = await api.get(`/adaccounts/${adAccountId}/insights`, { params });
//   return response.data;
// };

// export const getCombinedAdAccountInsights = async (
//   adAccountId: string,
//   dateRange: { from: Date; to: Date }
// ) => {
//   // Prepare date parameters
//   const dateParams = {
//     since: dateRange.from.toISOString().split('T')[0],
//     until: dateRange.to.toISOString().split('T')[0],
//   };

//   // Make two separate API calls
//   const [breakdownInsights, percentChangeInsights] = await Promise.all([
//     // Get time series data with breakdown=true
//     getAdAccountInsights(adAccountId, {
//       ...dateParams,
//       time_increment: 1,
//       breakdown: true,
//       include_percent_change: false
//     }),
    
//     // Get aggregated data with percentage changes
//     getAdAccountInsights(adAccountId, {
//       ...dateParams,
//       breakdown: false,
//       include_percent_change: true
//     })
//   ]);

//   // Return both datasets
//   return {
//     timeSeriesData: breakdownInsights || [],
//     percentChangeData: percentChangeInsights?.[0] || {}
//   };
// };



// export const getCampaigns = async (adAccountId: string) => {
//   const response = await api.get(`/adaccounts/${adAccountId}/campaigns`);
//   return response.data;
// };
// export const getCombinedCampaignInsights = async (
//   campaignId: string,
//   dateRange: { from: Date; to: Date }
// ) => {
//   // Prepare date parameters
//   const dateParams = {
//     since: dateRange.from.toISOString().split('T')[0],
//     until: dateRange.to.toISOString().split('T')[0],
//   };

//   // Make two separate API calls
//   const [breakdownInsights, percentChangeInsights] = await Promise.all([
//     // Get time series data with breakdown=true
//     getCampaignInsights(campaignId, {
//       ...dateParams,
//       time_increment: 1,
//       breakdown: true,
//       include_percent_change: false
//     }),
    
//     // Get aggregated data with percentage changes
//     getCampaignInsights(campaignId, {
//       ...dateParams,
//       breakdown: false,
//       include_percent_change: true
//     })
//   ]);

//   // Return both datasets
//   return {
//     timeSeriesData: breakdownInsights || [],
//     percentChangeData: percentChangeInsights?.[0] || {}
//   };
// };
// export const getCampaignInsights = async (
//   campaignId: string,
//   params?: InsightParams
// ) => {
//   const response = await api.get(`/campaigns/${campaignId}/insights`, { params });
//   return response.data;
// };

// export const getAdSets = async (campaignId: string) => {
//   const response = await api.get(`/campaigns/${campaignId}/adsets`);
//   return response.data;
// };

// export const getAdSetInsights = async (
//   adSetId: string,
//   params?: InsightParams
// ) => {
//   const response = await api.get(`/adsets/${adSetId}/insights`, { params });
//   return response.data;
// };


// export const getEnhancedInsights = async (
//   adAccountId: string,
//   params?: InsightParams & { 
//     include_placements?: boolean; 
//     include_actions?: boolean;
//     include_device?: boolean; // Changed from include_devices to include_device
//   }
// ) => {
//   const response = await api.get(`/adaccounts/${adAccountId}/enhanced-insights`, { params });
//   return response.data;
// };

// // If you need to maintain backward compatibility, you can create a wrapper function
// export const getDeviceInsights = async (
//   adAccountId: string,
//   dateRange: { from: Date; to: Date }
// ) => {
//   const params = {
//     since: dateRange.from.toISOString().split('T')[0],
//     until: dateRange.to.toISOString().split('T')[0],
//     include_device: true, // Using the correct parameter name
//     include_placements: false,
//     include_actions: false
//   };
  
//   const response = await api.get(`/adaccounts/${adAccountId}/enhanced-insights`, { params });
//   return response.data;
// };


// // Add this to services/api.ts

// export const getCampaignsWithCreatives = async (
//   adAccountId: string,
//   params?: { active_only?: boolean }
// ) => {
//   const response = await api.get(`/adaccounts/${adAccountId}/campaigns-with-creatives`, { params });
//   return response.data;
// };


// export const getCampaignCreatives = async (campaignId: string) => {
//   const response = await api.get(`/campaigns/${campaignId}/creatives`);
//   return response.data;
// };



import axios from "axios";
import { API_BASE_URL } from "@/config/constants";
import type { InsightParams } from "@/types/api";

// Setup API instances
const api = axios.create({
  baseURL: API_BASE_URL,
});

const url_API = axios.create({
  baseURL: "https://meta-dashboard-backend.onrender.com/api",
});

// Cache configuration
const apiCache = new Map();
const CACHE_DURATION = {
  ACCOUNT: 4 * 60 * 60 * 1000,  // 4 hours for account data
  CAMPAIGN: 2 * 60 * 60 * 1000, // 2 hours for campaign data
  ADSET: 2 * 60 * 60 * 1000,    // 2 hours for ad set data
  CREATIVE: 2 * 60 * 60 * 1000, // 2 hours for creative data (reduced from 24 hours)
  INSIGHT: 30 * 60 * 1000       // 30 minutes for insight data
};

// Separate shorter cache duration for empty creative results
const EMPTY_CREATIVE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for empty creative results

// Generic caching wrapper function with improved empty result handling
const withCache = async (cacheType, cacheKey, fetchFn) => {
  const fullCacheKey = `${cacheType}_${cacheKey}`;
  const cachedItem = apiCache.get(fullCacheKey);
  
  // For creatives, check if we have an empty result and use shorter cache duration
  if (cachedItem && cacheType === 'CREATIVE') {
    const isEmptyCreativeResult = Array.isArray(cachedItem.data) && 
                                 cachedItem.data.length === 0 || 
                                 (cachedItem.data && Object.keys(cachedItem.data).length === 0);
    
    const cacheDuration = isEmptyCreativeResult ? 
                         EMPTY_CREATIVE_CACHE_DURATION : 
                         CACHE_DURATION[cacheType];
                         
    if ((Date.now() - cachedItem.timestamp) < cacheDuration) {
      console.log(`Using cached ${cacheType} data for ${cacheKey}${isEmptyCreativeResult ? ' (empty result)' : ''}`);
      return cachedItem.data;
    }
  } else if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_DURATION[cacheType]) {
    console.log(`Using cached ${cacheType} data for ${cacheKey}`);
    return cachedItem.data;
  }
  
  try {
    console.log(`Fetching ${cacheType} data for ${cacheKey}`);
    const data = await fetchFn();
    
    // For creatives, add a flag to indicate if the result was empty
    if (cacheType === 'CREATIVE') {
      const isEmptyCreativeResult = Array.isArray(data) && 
                                    data.length === 0 || 
                                    (data && Object.keys(data).length === 0);
      apiCache.set(fullCacheKey, {
        data,
        timestamp: Date.now(),
        isEmptyCreativeResult
      });
    } else {
      apiCache.set(fullCacheKey, {
        data,
        timestamp: Date.now()
      });
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${cacheType} data for ${cacheKey}:`, error);
    
    // For errors with creatives, use a very short cache time
    if (cacheType === 'CREATIVE') {
      apiCache.set(fullCacheKey, {
        data: [],
        timestamp: Date.now(),
        isEmptyCreativeResult: true,
        isError: true
      });
    }
    
    return cacheType === 'CREATIVE' ? [] : null; 
  }
};

// Ad Accounts
export const getAdAccounts = async () => {
  return withCache('ACCOUNT', 'all', async () => {
    const response = await api.get("/adaccounts");
    return response.data;
  });
};

export const getAdAccountInsights = async (
  adAccountId: string,
  params?: InsightParams
) => {
  const paramsKey = params ? JSON.stringify(params) : 'default';
  return withCache('INSIGHT', `account_${adAccountId}_${paramsKey}`, async () => {
    const response = await api.get(`/adaccounts/${adAccountId}/insights`, { params });
    return response.data;
  });
};

export const getCombinedAdAccountInsights = async (
  adAccountId: string,
  dateRange: { from: Date; to: Date  
    include_actions?: boolean;
  }
) => {
  // Prepare date parameters
  const dateParams = {
    since: dateRange.from.toISOString().split('T')[0],
    until: dateRange.to.toISOString().split('T')[0],
    include_actions: dateRange.include_actions || false
  };

  const cacheKey = `combined_${adAccountId}_${dateParams.since}_${dateParams.until}_${dateParams.include_actions}`;
  
  return withCache('INSIGHT', cacheKey, async () => {
    // Make two separate API calls
    const [breakdownInsights, percentChangeInsights] = await Promise.all([
      // Get time series data with breakdown=true
      getAdAccountInsights(adAccountId, {
        ...dateParams,
        time_increment: 1,
        breakdown: true,
        include_percent_change: false,
        include_actions: dateParams.include_actions

      }),
      
      // Get aggregated data with percentage changes
      getAdAccountInsights(adAccountId, {
        ...dateParams,
        breakdown: false,
        include_percent_change: true,
        include_actions: dateParams.include_actions

      })
    ]);

    // Return both datasets
    return {
      timeSeriesData: breakdownInsights || [],
      percentChangeData: percentChangeInsights?.[0] || {}
    };
  });
};

// Campaigns
export const getCampaigns = async (adAccountId: string) => {
  return withCache('CAMPAIGN', `list_${adAccountId}`, async () => {
    const response = await api.get(`/adaccounts/${adAccountId}/campaigns`);
    return response.data;
  });
};

export const getCampaignInsights = async (
  campaignId: string,
  params?: InsightParams
) => {
  const paramsKey = params ? JSON.stringify(params) : 'default';
  return withCache('INSIGHT', `campaign_${campaignId}_${paramsKey}`, async () => {
    const response = await api.get(`/campaigns/${campaignId}/insights`, { params });
    return response.data;
  });
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

  const cacheKey = `combined_${campaignId}_${dateParams.since}_${dateParams.until}`;
  
  return withCache('INSIGHT', cacheKey, async () => {
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
  });
};


// Ad Sets
// export const getAdSets = async (campaignId: string) => {
//   return withCache('ADSET', `list_${campaignId}`, async () => {
//     const response = await api.get(`/campaigns/${campaignId}/adsets`);
//     return response.data;
//   });
// };

// export const getAdSetInsights = async (
//   adSetId: string,
//   params?: InsightParams
// ) => {
//   const paramsKey = params ? JSON.stringify(params) : 'default';
//   return withCache('INSIGHT', `adset_${adSetId}_${paramsKey}`, async () => {
//     const response = await api.get(`/adsets/${adSetId}/insights`, { params });
//     return response.data;
//   });
// };

// Enhanced Insights
export const getEnhancedInsights = async (
  adAccountId: string,
  params?: InsightParams & { 
    include_placements?: boolean; 
    include_actions?: boolean;
    include_device?: boolean;
  }
) => {
  const paramsKey = params ? JSON.stringify(params) : 'default';
  return withCache('INSIGHT', `enhanced_${adAccountId}_${paramsKey}`, async () => {
    const response = await api.get(`/adaccounts/${adAccountId}/enhanced-insights`, { params });
    return response.data;
  });
};

// Device Insights
export const getDeviceInsights = async (
  adAccountId: string,
  dateRange: { from: Date; to: Date }
) => {
  const params = {
    since: dateRange.from.toISOString().split('T')[0],
    until: dateRange.to.toISOString().split('T')[0],
    include_device: true,
    include_placements: false,
    include_actions: false
  };
  
  const paramsKey = JSON.stringify(params);
  return withCache('INSIGHT', `device_${adAccountId}_${paramsKey}`, async () => {
    const response = await api.get(`/adaccounts/${adAccountId}/enhanced-insights`, { params });
    return response.data;
  });
};

// Campaigns with Creatives
export const getCampaignsWithCreatives = async (
  adAccountId: string,
  params: { active_only?: boolean } = { active_only: true },
  options?: { retries?: number; timeout?: number }
) => {
  const paramsKey = params ? JSON.stringify(params) : 'default';

  return withCache(
    'CREATIVE',
    `campaigns_with_creatives_${adAccountId}_${paramsKey}`,
    async () => {
      const MAX_RETRIES = options?.retries ?? 2;
      const TIMEOUT = options?.timeout ?? 15000;

      let attempts = 0;
      let lastError;

      while (attempts <= MAX_RETRIES) {
        try {
          const response = await url_API.get(
            `/adaccounts/${adAccountId}/campaigns-with-creatives`,
            {
              params,
              timeout: TIMEOUT,
            }
          );

          const campaigns = response.data;

          return campaigns.map((campaign: any) => ({
            ...campaign,
            creatives: Array.isArray(campaign.creatives) ? campaign.creatives : [],
          }));
        } catch (error) {
          console.error(
            `Error fetching creatives (attempt ${attempts + 1}/${MAX_RETRIES + 1}):`,
            error
          );
          lastError = error;
          attempts++;

          if (attempts <= MAX_RETRIES) {
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * Math.pow(2, attempts - 1))
            );
          }
        }
      }

      throw lastError;
    }
  );
};



// Campaign Creatives
export const getCampaignCreatives = async (campaignId: string) => {
  return withCache('CREATIVE', `campaign_creatives_${campaignId}`, async () => {
    const response = await api.get(`/campaigns/${campaignId}/creatives`);
    return response.data;
  });
};
