
import axios from "axios";

const BASE_URL = "https://meta-dashboard-backend-8a3151f26465.herokuapp.com/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export const getAdAccounts = async () => {
  const response = await api.get("/adaccounts");
  return response.data;
};

export const getAdAccountInsights = async (
  adAccountId: string,
  params?: {
    since?: string;
    until?: string;
    time_increment?: number;
  }
) => {
  const response = await api.get(`/adaccounts/${adAccountId}/insights`, { params });
  return response.data;
};

export const getCampaigns = async (adAccountId: string) => {
  const response = await api.get(`/adaccounts/${adAccountId}/campaigns`);
  return response.data;
};

export const getCampaignInsights = async (campaignId: string, dateRange?: { since?: string; until?: string }) => {
  const params = new URLSearchParams();
  if (dateRange?.since) params.append("since", dateRange.since);
  if (dateRange?.until) params.append("until", dateRange.until);
  
  const response = await api.get(`/campaigns/${campaignId}/insights`, { params });
  return response.data;
};

export const getAdSets = async (campaignId: string) => {
  const response = await api.get(`/campaigns/${campaignId}/adsets`);
  return response.data;
};

export const getAdSetInsights = async (adSetId: string, dateRange?: { since?: string; until?: string }) => {
  const params = new URLSearchParams();
  if (dateRange?.since) params.append("since", dateRange.since);
  if (dateRange?.until) params.append("until", dateRange.until);
  
  const response = await api.get(`/adsets/${adSetId}/insights`, { params });
  return response.data;
};
