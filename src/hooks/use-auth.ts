"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/ui/shadcn/sonner";
import authService from "@/services/auth/auth.service";
import { IFormData, UserRole } from "@/shared/types/auth.types";
import { ADMIN_PAGES } from "@/config/pages/admin.config";
import { PARTNER_PAGES } from "@/config/pages/partner.config";

interface ApiError {
  response?: {
    status?: number;
    data?: {
      detail?: string;
    };
  };
  message?: string;
}

// Функция для получения понятного сообщения об ошибке
const getErrorMessage = (error: ApiError): string => {
  // Проверяем статус код
  if (error?.response?.status === 401) {
    return "Неверные учетные данные";
  }

  if (error?.response?.status === 400) {
    return "Неверный формат данных";
  }

  if (error?.response?.status === 500) {
    return "Ошибка сервера. Попробуйте позже";
  }

  if (error?.response?.status === 404) {
    return "Сервис недоступен";
  }

  // Проверяем сообщение из ответа сервера
  if (error?.response?.data?.detail) {
    return error.response.data.detail;
  }

  // Проверяем общее сообщение об ошибке
  if (error?.message) {
    // Если это стандартное сообщение axios, заменяем на понятное
    if (error.message.includes("Request failed with status code")) {
      return "Ошибка подключения к серверу";
    }
    return error.message;
  }

  // Дефолтное сообщение
  return "Ошибка входа в систему";
};

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: IFormData) => authService.login(data),
    onSuccess: (response) => {
      // После успешного логина определяем роль и перенаправляем
      const userRole = response.data.user.role;
      toast.success("Успешный вход в систему");

      // Инвалидируем профиль пользователя
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });

      if (userRole === UserRole.ADMIN) {
        router.push(ADMIN_PAGES.HOME);
      } else if (userRole === UserRole.PARTNER) {
        router.push(PARTNER_PAGES.HOME);
      } else {
        // Если роль не определена, редиректим на логин
        console.error("Неизвестная роль пользователя:", userRole);
        router.push("/login");
      }
    },
    onError: (error: ApiError) => {
      console.error("Login error:", error);
      // Показываем понятное сообщение об ошибке
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Перенаправляем на страницу логина после успешного logout
      toast.success("Успешный выход из системы");
      router.push("/login");
    },
    onError: (error: ApiError) => {
      console.error("Logout error:", error);
      // Даже если произошла ошибка, очищаем токены и перенаправляем
      toast.error("Ошибка при выходе из системы");
      router.push("/login");
    },
  });

  const refreshTokenMutation = useMutation({
    mutationFn: () => authService.getNewTokens(),
    onError: (error: ApiError) => {
      console.error("Refresh token error:", error);
      // Если не удалось обновить токен, перенаправляем на логин
      toast.error("Сессия истекла. Пожалуйста, войдите снова");
      router.push("/login");
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    refreshToken: refreshTokenMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isRefreshLoading: refreshTokenMutation.isPending,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    refreshError: refreshTokenMutation.error,
  };
};
