"use server";

import { ITokenInside } from "@/shared/types/auth.types";
import * as jose from "jose";

export async function jwtVerifyServer(accessToken: string) {
  try {
    const { payload }: { payload: ITokenInside } = await jose.jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY),
      {
        issuer: undefined,
        audience: undefined, // Отключаем проверку audience как в backend
      }
    );

    return payload;
  } catch (error) {
    // Обработка ошибок, связанных с верификацией JWT
    if (
      error instanceof Error &&
      error.message.includes("exp claim timestamp check failed")
    ) {
      // Токен истек
      console.log("Токен истек");
      return null;
    }

    console.log("Ошибка при верификации токена: ", error);
    return null;
  }
}
