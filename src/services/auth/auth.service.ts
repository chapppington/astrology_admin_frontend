import { default_axios } from "@/api/axios";
import { IFormData, IAdmin } from "@/shared/types/auth.types";
import authTokenService from "./auth-token.service";

interface IAuthResponse {
  access_token: string;
  user: IAdmin;
}

class AuthService {
  async login(data: IFormData) {
    const response = await default_axios.post<IAuthResponse>(
      `/auth/login`,
      data
    );

    if (response.data.access_token) {
      authTokenService.saveAccessToken(response.data.access_token);
    }

    return response;
  }

  async getNewTokens() {
    const response = await default_axios.post<IAuthResponse>(`/auth/refresh`);

    if (response.data.access_token) {
      authTokenService.saveAccessToken(response.data.access_token);
    }

    return response;
  }

  async logout() {
    const response = await default_axios.post(`/auth/logout`);

    if (response.data) authTokenService.removeAccessToken();

    return response;
  }
}

const authService = new AuthService();
export default authService;
