import { auth_axios } from "@/api/axios";
import { IAdmin } from "@/shared/types/auth.types";
import {
  ICreatePartnerForm,
  IPartner,
  IPartnerListResponse,
  IUpdatePartnerForm,
} from "@/shared/types/partners.types";

class AdminsService {
  async getProfile() {
    const response = await auth_axios.get<IAdmin>(`/admin/profile`);
    return response;
  }

  // Partners
  private readonly PARTNERS_BASE = "/admin/partners";

  async listPartners(page = 1, page_size = 10, search?: string) {
    const response = await auth_axios.get<IPartnerListResponse>(
      `${this.PARTNERS_BASE}`,
      { params: { page, page_size, search } }
    );
    return response;
  }

  async getPartnerById(partnerId: number) {
    const response = await auth_axios.get<IPartner>(
      `${this.PARTNERS_BASE}/${partnerId}`
    );
    return response;
  }

  async createPartner(data: ICreatePartnerForm) {
    const response = await auth_axios.post<IPartner>(
      `${this.PARTNERS_BASE}`,
      data
    );
    return response;
  }

  async updatePartner(partnerId: number, data: IUpdatePartnerForm) {
    const response = await auth_axios.put<IPartner>(
      `${this.PARTNERS_BASE}/${partnerId}`,
      data
    );
    return response;
  }

  async togglePartner(partnerId: number) {
    const response = await auth_axios.patch<IPartner>(
      `${this.PARTNERS_BASE}/${partnerId}/toggle`
    );
    return response;
  }

  async deletePartner(partnerId: number) {
    const response = await auth_axios.delete<{ message: string; id: number }>(
      `${this.PARTNERS_BASE}/${partnerId}`
    );
    return response;
  }

  async updatePartnerProfile(data: IUpdatePartnerForm) {
    const response = await auth_axios.put<IPartner>(
      `${this.PARTNERS_BASE}/me/profile`,
      data
    );
    return response;
  }
}

const adminsService = new AdminsService();
export default adminsService;
