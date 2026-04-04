// ===== ENUMS =====
export enum TransactionType {
  CREDIT = 'CREDIT',     // Crédito (adição de saldo)
  DEBIT = 'DEBIT',       // Débito (redução de saldo)
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

// ===== REQUEST TYPES =====
export interface ILoadBalanceRequest {
  amount: number; // Valor em reais
  paymentMethod?: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX'; // Método de pagamento
}

export interface IReceivePaymentRequest {
  amount: number;
  description: string;
}

// ===== RESPONSE TYPES =====
export interface IWalletBalance {
  balance: number;
  userId: number;
  formatted?: string;
}

export interface IWallet {
  id: number;
  userId: number;
  balance: number; // Saldo atual
  totalCredit: number; // Total creditado
  totalDebit: number; // Total debitado
  lastUpdate: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
}

export interface ITransaction {
  id: number;
  walletId: number;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description: string;
  relatedId?: number; // ID da reserva, saque, etc
  relatedType?: string; // RESERVATION, WITHDRAWAL, DEPOSIT, etc
  createdAt: string;
  updatedAt: string;
}

export interface IGetWalletResponse {
  data: IWallet;
}

export interface IGetWalletBalanceResponse {
  data: IWalletBalance;
}

export interface ITransactionListResponse {
  data: ITransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ITransactionResponse {
  data: ITransaction;
}

export interface ILoadBalanceResponse {
  message: string;
  data: {
    transactionId: number;
    amount: number;
    newBalance: number;
    status: TransactionStatus;
  };
}

export interface IReceivePaymentResponse {
  message: string;
  data: {
    transactionId: number;
    amount: number;
    newBalance: number;
  };
}

// ===== FILTER TYPES =====
export interface ITransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  relatedType?: string;
}

// ===== ERROR TYPES =====
export interface IApiError {
  error?: string;
  errors?: Array<{
    code: string;
    message: string;
    path: PropertyKey[];
  }>;
}
