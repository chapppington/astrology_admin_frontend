export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface DashboardStatistics {
  total_revenue: number;
  total_withdrawn_to_partners: number;
  net_profit: number;
  new_users_last_30_days: number;
  total_users: number;
  users_chart: ChartDataPoint[];
  payments_chart: ChartDataPoint[];
}

export interface PartnerStatistics {
  users_chart: ChartDataPoint[];
  payments_chart: ChartDataPoint[];
}
