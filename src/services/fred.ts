export interface FredObservation {
  date: string;
  value: string;
}

export class FredService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getLatestMortgageRate(seriesId: string = "MORTGAGE30US"): Promise<number> {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${this.apiKey}&file_type=json&sort_order=desc&limit=1`;
    
    try {
      const response = await fetch(url);
      const data: any = await response.json();
      
      if (data && data.observations && data.observations.length > 0) {
        return parseFloat(data.observations[0].value);
      }
      return 6.5; // Fallback rate
    } catch (error) {
      console.error("FRED API Error:", error);
      return 6.5; // Fallback rate
    }
  }

  async getMortgageMetadata(seriesId: string = "MORTGAGE30US"): Promise<any> {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${this.apiKey}&file_type=json&sort_order=desc&limit=1`;
    const response = await fetch(url);
    return await response.json();
  }
}
