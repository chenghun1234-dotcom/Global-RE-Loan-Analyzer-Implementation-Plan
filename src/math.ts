/**
 * Financial calculation engine for Global-RE-Loan-Analyzer.
 * These are deterministic mathematical formulas to ensure reliability and zero cost.
 */

export interface AmortizationSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export const KR_REGULATION_CONFIG = {
  speculation_zone: { // 투기과열지구 (강남3구, 용산 등)
    ltv_max_single_home: 0.50, // 50%
    dsr_max: 0.40 // 40%
  },
  non_regulated_zone: { // 비규제 지역
    ltv_max_single_home: 0.70, // 70%
    dsr_max: 0.40 
  }
};

export class FinanceEngine {
  /**
   * Monthly Amortization calculation (Fixed-rate mortgage)
   * Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
   */
  static calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    const monthlyPayment = (principal * monthlyRate * x) / (x - 1);
    return Math.round(monthlyPayment * 100) / 100;
  }

  static getAmortizationSchedule(principal: number, annualRate: number, years: number): AmortizationSchedule[] {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    const monthlyPayment = this.calculateMonthlyPayment(principal, annualRate, years);
    
    let balance = principal;
    const schedule: AmortizationSchedule[] = [];

    for (let m = 1; m <= numberOfPayments; m++) {
      const interest = Math.round(balance * monthlyRate * 100) / 100;
      const principalPaid = Math.round((monthlyPayment - interest) * 100) / 100;
      balance = Math.round((balance - principalPaid) * 100) / 100;
      
      schedule.push({
        month: m,
        payment: monthlyPayment,
        principal: principalPaid,
        interest: interest,
        remainingBalance: Math.max(0, balance)
      });
    }

    return schedule;
  }

  /**
   * DSR (Debt Service Ratio) / DTI Calculation
   */
  static calculateDSR(annualIncome: number, totalAnnualDebtService: number): number {
    if (annualIncome <= 0) return 100;
    return Math.round((totalAnnualDebtService / annualIncome) * 100 * 100) / 100;
  }

  /**
   * IRR (Internal Rate of Return) - Newton-Raphson approximation
   * Used for Bond Yield analysis.
   */
  static calculateIRR(cashFlows: number[], guess: number = 0.1): number | null {
    const maxIters = 100;
    const precision = 0.00001;
    let rate = guess;

    for (let i = 0; i < maxIters; i++) {
      let npv = 0;
      let dNpv = 0;
      for (let t = 0; t < cashFlows.length; t++) {
        const factor = Math.pow(1 + rate, t);
        npv += cashFlows[t] / factor;
        dNpv -= (t * cashFlows[t]) / (factor * (1 + rate));
      }

      if (Math.abs(dNpv) < 1e-10) break;
      const nextRate = rate - npv / dNpv;
      if (Math.abs(nextRate - rate) < precision) return Math.round(nextRate * 10000) / 10000;
      rate = nextRate;
    }
    return null;
  }

  /**
   * Korean LTV/DSR Regulation Engine (Static JSON based Edge Processing)
   */
  static getKoreanLimit(propertyValue: number, region: 'speculation_zone' | 'non_regulated_zone'): { limit: number, ltv: number } {
    const config = KR_REGULATION_CONFIG[region];
    const ltv = config.ltv_max_single_home;
    return {
      limit: propertyValue * ltv,
      ltv: ltv
    };
  }
}
