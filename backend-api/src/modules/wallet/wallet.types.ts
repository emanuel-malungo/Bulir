export interface IDepositRequest {
  amount: number;
}

export interface IBalance {
  userId: number;
  balance: number;
  updatedAt: Date;
}

export interface IDepositResponse {
  success: boolean;
  message: string;
  newBalance: number;
  depositAmount: number;
}

export interface IGetBalanceResponse {
  balance: number;
  userId: number;
  formatted: string;
}

export interface IWithdrawResponse {
  success: boolean;
  message: string;
  newBalance: number;
  withdrawAmount: number;
}

export interface IApiError {
  error: string;
  message: string;
  statusCode: number;
}
