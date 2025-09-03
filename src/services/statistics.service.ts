import { auth_axios } from "@/api/axios";
import {
  DashboardStatistics,
  PartnerStatistics,
} from "@/shared/types/statistics.types";

class StatisticsService {
  private readonly BASE_URL = "/statistics";

  async getDashboardStatistics(): Promise<DashboardStatistics> {
    const { data } = await auth_axios.get<DashboardStatistics>(
      `${this.BASE_URL}/dashboard`
    );
    return data;
  }

  async getPartnerStatistics(): Promise<PartnerStatistics> {
    const { data } = await auth_axios.get<PartnerStatistics>(
      `${this.BASE_URL}/partner`
    );
    return data;
  }
}

export const statisticsService = new StatisticsService();
