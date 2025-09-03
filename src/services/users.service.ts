import { auth_axios } from "@/api/axios";
import { UsersListResponse } from "@/shared/types/users.types";

class UsersService {
  private readonly BASE_URL = "/admin/users";

  async getUsers(
    page = 1,
    pageSize = 20,
    search?: string,
    partnerId?: number
  ): Promise<UsersListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search && search.trim()) {
      params.append("search", search.trim());
    }
    if (partnerId) {
      params.append("partner_id", String(partnerId));
    }

    const { data } = await auth_axios.get<UsersListResponse>(
      `${this.BASE_URL}?${params.toString()}`
    );
    return data;
  }

  async updateUser(
    telegramUserId: number,
    updateData: Partial<{
      account_status: "BASIC" | "PREMIUM";
      subscription_end: string | null;
      subscription_start?: string | null;
    }>
  ): Promise<boolean> {
    try {
      await auth_axios.put(`${this.BASE_URL}/${telegramUserId}`, updateData);
      return true;
    } catch {
      return false;
    }
  }
}

export const usersService = new UsersService();
