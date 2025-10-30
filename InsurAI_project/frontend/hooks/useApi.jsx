// src/hooks/useApi.js
import axios from 'axios';
import { useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false, // set true when using cookies
});

// Interceptor: attach token from localStorage (dev flow)
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (err) => Promise.reject(err));

export default function useApi() {
  const get = useCallback(async (url, config = {}) => {
    const res = await apiClient.get(url, config);
    return res.data;
  }, []);

  const post = useCallback(async (url, body = {}, config = {}) => {
    const res = await apiClient.post(url, body, config);
    return res.data;
  }, []);

  const put = useCallback(async (url, body = {}, config = {}) => {
    const res = await apiClient.put(url, body, config);
    return res.data;
  }, []);

  const patch = useCallback(async (url, body = {}, config = {}) => {
    const res = await apiClient.patch(url, body, config);
    return res.data;
  }, []);

  const del = useCallback(async (url, config = {}) => {
    const res = await apiClient.delete(url, config);
    return res.data;
  }, []);

  return { apiClient, get, post, put, patch, del };
}
