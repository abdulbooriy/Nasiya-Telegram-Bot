import axios from "axios";
import { IPrepaidRecordsResponse } from "../types/IPrepaidRecord";

const API_URL =
  import.meta.env.VITE_API_URL || "https://api.craftly.uz/api/bot";

const prepaidApi = axios.create({
  baseURL: `${API_URL}/prepaid`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token'ni har bir request'ga qo'shish
prepaidApi.interceptors.request.use((config) => {
  const token =
    sessionStorage.getItem("accessToken") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Mijozning barcha zapas tarihini olish
 */
export const getPrepaidRecords = async (
  customerId: string,
  contractId?: string,
): Promise<IPrepaidRecordsResponse> => {
  const params = new URLSearchParams();
  if (contractId) {
    params.append("contractId", contractId);
  }

  const response = await prepaidApi.get(`/history/${customerId}`, { params });
  return response.data;
};

/**
 * Barcha prepaid recordlarni olish (statistika uchun)
 */
export const getPrepaidRecordsByContract = async (
  contractId: string,
): Promise<IPrepaidRecordsResponse> => {
  const response = await prepaidApi.get(`/contract/${contractId}`);
  return response.data;
};

export default prepaidApi;
