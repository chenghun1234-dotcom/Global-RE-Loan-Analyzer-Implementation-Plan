export type Language = 'ko' | 'en';

export const i18nMapping = {
  ko: {
    status: "상태",
    success: "성공",
    property_info: "부동산 정보",
    market_price: "시세",
    official_price: "공시지가",
    loan_analysis: "대출 분석",
    max_ltv_limit: "최대 대출 한도 (LTV)",
    applied_interest_rate: "적용 금리",
    monthly_payment: "월 상환액",
    total_interest: "총 이자",
    risk_index: "리스크 지수",
    repayment_capability: "상환 능력",
    collateral_stability: "담보 안정성",
    bond_analysis: "채권 분석",
    expected_yield: "예상 수익률 (IRR)",
    recovery_period: "회수 기간",
    risk_grade: "리스크 등급",
    source: "데이터 출처",
    unit_currency: "원 또는 달러"
  },
  en: {
    status: "status",
    success: "success",
    property_info: "Property Information",
    market_price: "Market Price",
    official_price: "Official Price",
    loan_analysis: "Loan Analysis",
    max_ltv_limit: "Max Loan Limit (LTV)",
    applied_interest_rate: "Applied Interest Rate",
    monthly_payment: "Monthly Payment",
    total_interest: "Total Interest",
    risk_index: "Risk Index",
    repayment_capability: "Repayment Capability",
    collateral_stability: "Collateral Stability",
    bond_analysis: "Bond Analysis",
    expected_yield: "Expected Yield (IRR)",
    recovery_period: "Recovery Period",
    risk_grade: "Risk Grade",
    source: "Data Source",
    unit_currency: "Currency (KRW/USD)"
  }
};

export function translate(key: keyof typeof i18nMapping['en'], lang: Language): string {
  return i18nMapping[lang][key] || i18nMapping['en'][key];
}
