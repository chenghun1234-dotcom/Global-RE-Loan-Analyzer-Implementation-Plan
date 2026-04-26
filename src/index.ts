import { FinanceEngine, KR_REGULATION_CONFIG } from './math';
import { i18nMapping, translate, Language } from './i18n';
import { FredService } from './services/fred';
import { KoreaDataService } from './services/korea_data';
import { EcosService } from './services/ecos';
import { landingPageHTML } from './landing';

export interface Env {
  FRED_API_KEY: string;
  ECOS_API_KEY?: string;
  KOREA_DATA_SERVICE_KEY?: string;
  RATE_CACHE?: KVNamespace; // Cloudflare KV for caching
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;
    const lang = (searchParams.get('lang') || 'en') as Language;
    const t = i18nMapping[lang] || i18nMapping.en;

    // Helper to return JSON
    const jsonRes = (data: any, status = 200) => {
      return new Response(JSON.stringify({ status: "success", data }, null, 2), {
        status,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    };

    // Serve Landing Page for Root
    if (pathname === '/' || pathname === '/index.html') {
      const accept = request.headers.get("Accept") || "";
      if (accept.includes("text/html")) {
        return new Response(landingPageHTML, {
          headers: { "Content-Type": "text/html" }
        });
      }
    }

    try {
      // 1. /valuation/property-value
      if (pathname === '/valuation/property-value') {
        const address = searchParams.get('address') || "Seoul";
        const koreaService = new KoreaDataService(env.KOREA_DATA_SERVICE_KEY);
        const { market, official } = await koreaService.getMarketPrice(address);
        
        return jsonRes({
          address,
          market_price: market,
          official_price: official,
          currency: lang === 'ko' ? 'KRW' : 'USD equivalent',
          labels: t
        });
      }

      // 2. /valuation/ltv-check
      if (pathname === '/valuation/ltv-check') {
        const address = searchParams.get('address') || "Seoul";
        const price = parseFloat(searchParams.get('price') || "1000000000");
        const koreaService = new KoreaDataService(env.KOREA_DATA_SERVICE_KEY);
        const region = await koreaService.getRegionRegulation(address);
        
        // Edge Processing using Static JSON
        const { limit, ltv } = FinanceEngine.getKoreanLimit(price, region);
        
        return jsonRes({
          address,
          input_price: price,
          region_type: region,
          max_ltv_limit: limit,
          applied_ltv_ratio: ltv,
          regulation_source: "Static Edge JSON (KR_REGULATION_CONFIG)",
          labels: t
        });
      }

      // 3. /loan/amortization
      if (pathname === '/loan/amortization') {
        const country = searchParams.get('country') || "US";
        const principal = parseFloat(searchParams.get('principal') || "500000000");
        const years = parseInt(searchParams.get('years') || "30");
        const rateParam = searchParams.get('rate');
        
        let rate = rateParam ? parseFloat(rateParam) : 0;
        let dataSource = rateParam ? "Manual Input" : "Automatic API";

        if (!rateParam) {
          if (country === 'KR') {
            // Check KV Cache first
            const cacheKey = "KR_MORTGAGE_RATE";
            const cached = await env.RATE_CACHE?.get(cacheKey);
            if (cached) {
              rate = parseFloat(cached);
              dataSource = "Rate Cache (Bank of Korea)";
            } else {
              const ecos = new EcosService(env.ECOS_API_KEY);
              rate = await ecos.getMortgageRate();
              dataSource = "Bank of Korea (ECOS)";
              // Store in KV for 12 hours
              await env.RATE_CACHE?.put(cacheKey, rate.toString(), { expirationTtl: 43200 });
            }
          } else {
            const fred = new FredService(env.FRED_API_KEY);
            rate = await fred.getLatestMortgageRate();
            dataSource = "St. Louis Fed (FRED)";
          }
        }

        const monthlyPayment = FinanceEngine.calculateMonthlyPayment(principal, rate, years);
        const schedule = FinanceEngine.getAmortizationSchedule(principal, rate, years).slice(0, 12); // First 12 months

        return jsonRes({
          loan_details: {
            principal,
            rate,
            years,
            data_source: dataSource
          },
          monthly_payment: monthlyPayment,
          total_interest: Math.round((monthlyPayment * years * 12 - principal) * 100) / 100,
          sample_schedule: schedule,
          labels: t
        });
      }

      // 4. /bond/yield-calculator
      if (pathname === '/bond/yield-calculator') {
        const buyPrice = parseFloat(searchParams.get('buy_price') || "800000000");
        const recoveryAmount = parseFloat(searchParams.get('recovery_amount') || "1000000000");
        const periodMonths = parseInt(searchParams.get('months') || "24");

        // Simple cashflow: [-buyPrice, 0, 0, ..., recoveryAmount]
        const cashflows = new Array(periodMonths + 1).fill(0);
        cashflows[0] = -buyPrice;
        cashflows[periodMonths] = recoveryAmount;

        const monthlyIrr = FinanceEngine.calculateIRR(cashflows) || 0;
        const annualIrr = Math.round((Math.pow(1 + monthlyIrr, 12) - 1) * 10000) / 100;

        return jsonRes({
          investment: {
            purchase_price: buyPrice,
            expected_recovery: recoveryAmount,
            period_months: periodMonths
          },
          expected_yield_annual: `${annualIrr}%`,
          yield_raw: annualIrr / 100,
          labels: t
        });
      }

      // Default: Landing Page (JSON Info)
      return jsonRes({
        message: "PropFinance-Insight-Korea API is running.",
        available_endpoints: [
          "/valuation/property-value",
          "/valuation/ltv-check",
          "/loan/amortization",
          "/bond/yield-calculator"
        ],
        documentation: "https://rapidapi.com/your-username/api/global-re-loan-analyzer"
      });

    } catch (error: any) {
      return new Response(JSON.stringify({ status: "error", message: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
