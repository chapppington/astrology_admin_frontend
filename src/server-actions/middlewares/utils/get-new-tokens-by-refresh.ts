"use server";

import { API_URL } from "@/constants";
import { IAdmin } from "@/shared/types/auth.types";

interface IAuthResponse {
  user: IAdmin;
  access_token: string;
}

export async function getNewTokensByRefresh(refreshToken: string) {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `refresh_token=${refreshToken}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("invalid token");
  }

  const data: IAuthResponse = await response.json();
  return data;
}
