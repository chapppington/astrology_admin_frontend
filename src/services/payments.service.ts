import { auth_axios } from "@/api/axios";
import { PaymentsListResponse } from "@/shared/types/payments.types";

class PaymentsService {
  private readonly BASE_URL = "/admin/payments";

  async getPayments(
    page = 1,
    pageSize = 20,
    search?: string,
    partnerId?: number
  ): Promise<PaymentsListResponse> {
    const params: Record<string, string | number> = {
      page,
      page_size: pageSize,
    };
    if (search) params.search = search;
    if (partnerId) params.partner_id = partnerId;
    const { data } = await auth_axios.get<PaymentsListResponse>(
      `${this.BASE_URL}`,
      { params }
    );
    return data;
  }
}

export const paymentsService = new PaymentsService();
