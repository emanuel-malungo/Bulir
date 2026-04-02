import ENV from "../config/env.config.js";

// ===== INTERFACES =====
export interface IBIResponse {
  error: boolean;
  name: string;
  endereco: string;
  data_de_nascimento: string;
}

export interface IBIDetails extends IBIResponse {}

export interface IAPIError {
  errors?: Array<{
    origin: string;
    code: string;
    maximum?: number;
    inclusive?: boolean;
    path: string[];
    message: string;
  }>;
}

// ===== NIF SERVICE =====
export class NIFService {
  private static readonly RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY = 1000;

  static formatNIF(nif: string): string {
    return nif.replace(/[^A-Z0-9]/g, "").toUpperCase().trim();
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async fetchBIDetails(bi: string, attempt: number = 1): Promise<IBIDetails> {
    try {
      const formattedNIF = this.formatNIF(bi);

      const response = await fetch(
        `${ENV.NIF_API_URL}/${formattedNIF}/bilhete`
      );

      if (!response.ok) {
        if (attempt < this.RETRY_ATTEMPTS && response.status >= 500) {
          await this.delay(this.RETRY_DELAY);
          return this.fetchBIDetails(bi, attempt + 1);
        }

        const errorData = (await response.json().catch(() => ({}))) as IAPIError;
        throw new Error(
          errorData.errors?.[0]?.message ||
            `Erro na API: ${response.status}`
        );
      }

      const data = (await response.json()) as IBIDetails;

      if (data.error) {
        throw new Error("NIF não encontrado na base de dados");
      }

      return data;
    } catch (error) {
      if (attempt < this.RETRY_ATTEMPTS && error instanceof Error && !error.message.includes("base de dados")) {
        await this.delay(this.RETRY_DELAY);
        return this.fetchBIDetails(bi, attempt + 1);
      }
      throw error;
    }
  }

  static async verifyNIF(nif: string): Promise<IBIDetails | null> {
    try {
      return await this.fetchBIDetails(nif);
    } catch {
      return null;
    }
  }
}
