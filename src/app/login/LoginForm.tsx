"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/shadcn/card";
import { Input } from "@/ui/shadcn/input";
import { Button } from "@/ui/shadcn/button";
import { Label } from "@/ui/shadcn/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormData } from "@/shared/types/auth.types";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { toast } from "@/ui/shadcn/sonner";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormData>();

  const { login, isLoginLoading } = useAuth();

  const onSubmit: SubmitHandler<IFormData> = (data) => {
    // Проверяем наличие ошибок валидации
    if (Object.keys(errors).length > 0) {
      toast.error("Пожалуйста, исправьте ошибки в форме");
      return;
    }
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 transition-all duration-300 relative">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <Card className="w-full max-w-md py-7 shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            Вход в систему
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Имя пользователя
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  className="h-11 px-4 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  placeholder="Введите имя пользователя"
                  {...register("username", {
                    required: "Имя пользователя обязательно",
                  })}
                />
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Пароль
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="h-11 px-4 pr-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Пароль обязателен",
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
