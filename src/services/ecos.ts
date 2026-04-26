/**
 * Bank of Korea (ECOS) API Service
 * Used to fetch Korean base rates and bank mortgage rates.
 */

export class EcosService {
  private apiKey: string | undefined;
  private baseUrl = "https://ecos.bok.or.kr/api";

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  /**
   * Fetch Korean Base Rate (한국은행 기준금리)
   * Stat Code: 722Y001 (한국은행 기준금리 및 여수신금리)
   * Item Code: 0101000 (한국은행 기준금리)
   */
  async getLatestBaseRate(): Promise<number> {
    if (!this.apiKey) return 3.5; // Default fallback

    const url = `${this.baseUrl}/StatisticSearch/${this.apiKey}/json/kr/1/1/722Y001/D/20240101/20241231/0101000`;
    
    try {
      const response = await fetch(url);
      const data: any = await response.json();
      
      if (data && data.StatisticSearch && data.StatisticSearch.row) {
        return parseFloat(data.StatisticSearch.row[0].DATA_VALUE);
      }
      return 3.5;
    } catch (error) {
      console.error("ECOS API Error:", error);
      return 3.5;
    }
  }

  /**
   * Fetch Average Bank Mortgage Rate (예금은행 담보대출금리)
   * Stat Code: 901Y001
   * Item Code: 1.3.1.2 (신규취급액 기준 - 주택담보대출)
   */
  async getMortgageRate(): Promise<number> {
    if (!this.apiKey) return 4.8; // Default mock average

    const url = `${this.baseUrl}/StatisticSearch/${this.apiKey}/json/kr/1/1/901Y001/M/202301/202412/1.3.1.2`;
    
    try {
      const response = await fetch(url);
      const data: any = await response.json();
      
      if (data && data.StatisticSearch && data.StatisticSearch.row) {
        return parseFloat(data.StatisticSearch.row[0].DATA_VALUE);
      }
      return 4.8;
    } catch (error) {
      console.error("ECOS API Error:", error);
      return 4.8;
    }
  }
}
