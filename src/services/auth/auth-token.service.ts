import { AuthToken } from "@/shared/types/auth.types";
import Cookies from "js-cookie";

class AuthTokenService {
  getAccessToken() {
    const accessToken = Cookies.get(AuthToken.ACCESS_TOKEN);
    return accessToken || null;
  }

  saveAccessToken(accessToken: string) {
    Cookies.set(AuthToken.ACCESS_TOKEN, accessToken, {
      domain: "localhost",
      sameSite: "strict",
      expires: 1,
    });
  }

  removeAccessToken() {
    Cookies.remove(AuthToken.ACCESS_TOKEN);
  }
}

const authTokenService = new AuthTokenService();
export default authTokenService;
