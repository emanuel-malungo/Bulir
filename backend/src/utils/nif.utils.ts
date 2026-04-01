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

   // Remove caracteres especiais e formata o NIF
   // Mantém apenas números e letras
  static formatNIF(nif: string): string {
    return nif.replace(/[^A-Z0-9]/g, "").toUpperCase().trim();
  }

   // Valida o comprimento do NIF
  static validateNIFLength(nif: string): boolean {
    const formattedNIF = this.formatNIF(nif);
    return formattedNIF.length <= 12;
  }

  
   // Busca detalhes do BI/NIF na API
  static async fetchBIDetails(bi: string): Promise<IBIDetails> {
    try {

      const formattedNIF = this.formatNIF(bi);

      if (!this.validateNIFLength(formattedNIF)) {
        throw new Error(`NIF não pode exceder 12 caracteres. Recebido: ${formattedNIF}`);
      }

      const response = await fetch(
        `${ENV.NIF_API_URL}/${formattedNIF}/bilhete`
      );

      if (!response.ok) {
        const errorData = (await response.json()) as IAPIError;
        throw new Error(
          errorData.errors?.[0]?.message ||
            `API Error: ${response.status}`
        );
      }

      const data = (await response.json()) as IBIDetails;
      
      if (data.error) {
        throw new Error("NIF não encontrado");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

   // Verifica se o NIF é válido e existe na API
  static async verifyNIF(nif: string): Promise<IBIDetails | null> {
    try {
      const biDetails = await this.fetchBIDetails(nif);
      return biDetails;
    } catch (error) {
      console.error("Erro ao verificar NIF:", error);
      return null;
    }
  }
}
