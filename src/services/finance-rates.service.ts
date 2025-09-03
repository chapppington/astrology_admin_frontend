export interface CurrencyRate {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export interface FinanceRates {
  ton: CurrencyRate | null;
  stars: {
    usd: number;
    rub: number;
  };
  tonRub: number | null;
  usdtRub: number | null;
}

class FinanceRatesService {
  private readonly baseUrl = "https://api.binance.com/api/v3";

  async getFinanceRates(): Promise<FinanceRates> {
    try {
      // Получаем TON/USD и USDT/RUB с Binance
      const [tonUsdResponse, currencyResponse] = await Promise.all([
        fetch(`${this.baseUrl}/ticker/24hr?symbol=TONUSDT`),
        fetch(
          "https://www.binance.com/bapi/asset/v1/public/asset-service/product/currency"
        ),
      ]);

      if (!tonUsdResponse.ok || !currencyResponse.ok) {
        throw new Error(
          `HTTP error! status: ${tonUsdResponse.status} or ${currencyResponse.status}`
        );
      }

      const [tonUsdData, currencyData] = await Promise.all([
        tonUsdResponse.json(),
        currencyResponse.json(),
      ]);

      let tonRate: CurrencyRate | null = null;
      let tonRubRate: number | null = null;
      let usdtRubRate: number | null = null;

      if (tonUsdData.symbol === "TONUSDT") {
        const currentPrice = parseFloat(tonUsdData.lastPrice);
        const changePercent = parseFloat(tonUsdData.priceChangePercent);

        tonRate = {
          id: "ton-usdt",
          symbol: "TON",
          name: "The Open Network",
          current_price: currentPrice,
          price_change_percentage_24h: changePercent,
        };

        // Для TON/RUB используем реальный курс USDT/RUB из Binance API
        if (currencyData.success && currencyData.data) {
          const rubUsd = (currencyData.data as Array<{ pair: string; rate: number }>).find(
            (item) => item.pair === "RUB_USD"
          );
          if (rubUsd) {
            // Конвертируем: TON/RUB = TON/USDT × USDT/RUB
            tonRubRate = currentPrice * rubUsd.rate;
          }
        }
      }

      // Получаем курс USDT/RUB из Binance currency API
      if (currencyData.success && currencyData.data) {
        const rubUsd = (currencyData.data as Array<{ pair: string; rate: number }>).find(
          (item) => item.pair === "RUB_USD"
        );
        if (rubUsd) {
          usdtRubRate = rubUsd.rate;
        }
      }

      const result = {
        ton: tonRate,
        stars: {
          usd: 0.013, // Статичный курс STARS/USD
          rub: usdtRubRate ? 0.013 * usdtRubRate : 0, // STARS/RUB = STARS/USD * USDT/RUB
        },
        tonRub: tonRubRate,
        usdtRub: usdtRubRate,
      };

      return result;
    } catch (error) {
      console.error("Error fetching finance rates:", error);
      return {
        ton: null,
        stars: { usd: 0.013, rub: 0 },
        tonRub: null,
        usdtRub: null,
      };
    }
  }
}

export const financeRatesService = new FinanceRatesService();
