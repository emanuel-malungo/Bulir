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
  IWalletBalance,
  ITransaction,
  ITransactionListResponse,
  IGetWalletResponse,
  IGetWalletBalanceResponse,
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
   * @returns Saldo do usuário
   */
  static async getWallet(): Promise<IWalletBalance> {
    const response = await api.get<IGetWalletBalanceResponse>('/wallet/balance');
    return response.data.data;
  }

  /**
   * Listar transações da carteira
   * ⚠️ Endpoint não implementado no backend ainda
   * @param filters - Paginação e filtros
   * @returns Lista paginada de transações
   */
  static async listTransactions(
    filters: ITransactionFilters = {}
  ): Promise<ITransactionListResponse> {
    // TODO: Implementar no backend
    console.warn('[WalletAPI] Endpoint /wallet/transactions não existe no backend');
    throw new Error('Funcionalidade de transações não está disponível no momento');
    
    // const validatedFilters = transactionFiltersSchema.parse(filters);
    // const response = await api.get<ITransactionListResponse>('/wallet/transactions', {
    //   params: validatedFilters,
    // });
    // return response.data;
  }

  /**
   * Obter detalhes de uma transação
   * ⚠️ Endpoint não implementado no backend ainda
   * @param id - ID da transação
   * @returns Detalhes da transação
   */
  static async getTransaction(id: number): Promise<ITransaction> {
    // TODO: Implementar no backend
    console.warn('[WalletAPI] Endpoint /wallet/transactions/:id não existe no backend');
    throw new Error('Funcionalidade de transações não está disponível no momento');
    
    // const response = await api.get<ITransactionResponse>(`/wallet/transactions/${id}`);
    // return response.data.data;
  }

  /**
   * Carregar saldo na carteira
   * ⚠️ Endpoint não implementado no backend ainda
   * @param data - Valor e método de pagamento
   * @returns Resultado da transação
   */
  static async loadBalance(
    data: ILoadBalanceRequest
  ): Promise<ILoadBalanceResponse> {
    // TODO: Implementar no backend
    console.warn('[WalletAPI] Endpoint /wallet/load-balance não existe no backend');
    throw new Error('Funcionalidade de carregar saldo não está disponível no momento');
    
    // const validatedData = loadBalanceSchema.parse(data);
    // const response = await api.post<ILoadBalanceResponse>(
    //   '/wallet/load-balance',
    //   validatedData
    // );
    // return response.data;
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
