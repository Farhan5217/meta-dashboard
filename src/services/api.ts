
import axios from "axios";
import { API_BASE_URL } from "@/config/constants";
import type { InsightParams } from "@/types/api";

const api = axios.create({
  baseURL: API_BASE_URL,
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

export const getCampaigns = async (adAccountId: string) => {
  const response = await api.get(`/adaccounts/${adAccountId}/campaigns`);
  return response.data;
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
