import { API_URL } from "@/constants";
import axios, { CreateAxiosDefaults } from "axios";
import { errorCatch, getContentType } from "./api.helper";
import authTokenService from "@/services/auth/auth-token.service";
import authService from "@/services/auth/auth.service";

interface ApiError {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
  message?: string;
}

const axiosOptions: CreateAxiosDefaults = {
  baseURL: API_URL,
  headers: getContentType(),
  withCredentials: true,
};

// Разница между default_axios и auth_axios
// в том что в дефолте нет прикрепленных токенов
// а в auth версии они автоматически прикреплены

export const default_axios = axios.create(axiosOptions);

export const auth_axios = axios.create(axiosOptions);

auth_axios.interceptors.request.use((config) => {
  const access_token = authTokenService.getAccessToken();

  if (config?.headers && access_token)
    config.headers.Authorization = `Bearer ${access_token}`;

  return config;
});

auth_axios.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error?.response?.status === 401 || error?.response?.status === 403) &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;

      try {
        await authService.getNewTokens();
        return auth_axios.request(originalRequest);
      } catch (error) {
        const errorMessage = errorCatch(error as ApiError);
        if (
          errorMessage &&
          (errorMessage.includes("Недействительный refresh_token") ||
            errorMessage.includes("Refresh token отсутствует"))
        ) {
          authTokenService.removeAccessToken();
        }
      }
    }

    throw error;
  }
);
