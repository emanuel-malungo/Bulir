import api from '@/utils/api.utils';
import {
  loadBalanceSchema,
  receivePaymentSchema,
  transactionFiltersSchema,
} from './wallet.schema';
import type {
  ILoadBalanceRequest,
  IReceivePaymentRequest,
  IWallet,
  ITransaction,
  ITransactionListResponse,
  IGetWalletResponse,
  ILoadBalanceResponse,
  IReceivePaymentResponse,
  ITransactionResponse,
  ITransactionFilters,
} from './wallet.types';

/**
 * Wallet API calls
 * - Chamadas autenticadas à API de carteira
 * - Gestão de saldo e transações
 * - Tipagem forte para wallet, transações, pagamentos
 */
export class WalletAPI {
  /**
   * Obter saldo atual da carteira
   * @returns Detalhes da carteira do usuário
   */
  static async getWallet(): Promise<IWallet> {
    const response = await api.get<IGetWalletResponse>('/wallet');
    return response.data.data;
  }

  /**
   * Listar transações da carteira
   * @param filters - Paginação e filtros
   * @returns Lista paginada de transações
   */
  static async listTransactions(
    filters: ITransactionFilters = {}
  ): Promise<ITransactionListResponse> {
    const validatedFilters = transactionFiltersSchema.parse(filters);

    const response = await api.get<ITransactionListResponse>('/wallet/transactions', {
      params: validatedFilters,
    });

    return response.data;
  }

  /**
   * Obter detalhes de uma transação
   * @param id - ID da transação
   * @returns Detalhes da transação
   */
  static async getTransaction(id: number): Promise<ITransaction> {
    const response = await api.get<ITransactionResponse>(`/wallet/transactions/${id}`);
    return response.data.data;
  }

  /**
   * Carregar saldo na carteira
   * @param data - Valor e método de pagamento
   * @returns Resultado da transação
   */
  static async loadBalance(
    data: ILoadBalanceRequest
  ): Promise<ILoadBalanceResponse> {
    const validatedData = loadBalanceSchema.parse(data);

    const response = await api.post<ILoadBalanceResponse>(
      '/wallet/load-balance',
      validatedData
    );

    return response.data;
  }

  /**
   * Receber pagamento na carteira (para provedores)
   * @param data - Valor e descrição
   * @returns Resultado da transação
   */
  static async receivePayment(
    data: IReceivePaymentRequest
  ): Promise<IReceivePaymentResponse> {
    const validatedData = receivePaymentSchema.parse(data);

    const response = await api.post<IReceivePaymentResponse>(
      '/wallet/receive-payment',
      validatedData
    );

    return response.data;
  }

  /**
   * Verificar saldo disponível
   * Útil para validar antes de operações
   * @returns Saldo disponível
   */
  static async checkBalance(): Promise<number> {
    const wallet = await this.getWallet();
    return wallet.balance;
  }

  /**
   * Validar se tem saldo suficiente
   * @param amount - Valor a debitar
   * @returns true se tem saldo, false caso contrário
   */
  static async hasEnoughBalance(amount: number): Promise<boolean> {
    const balance = await this.checkBalance();
    return balance >= amount;
  }
}
