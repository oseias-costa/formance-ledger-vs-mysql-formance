export interface Transaction {
  id: number;
  transactionType: TransactionType;
  reference: string;
  description: string;
  amount: number;
  source: string;
  destination: string;
}

export const typeId = {
  V2_ACCOUNT_RECEIVE: 1,
  V2_EXCHANGE: 2,
  V2_CHARGEBACK: 3,
  V2_ACCOUNT_SEND: 4,
  V2_ADD_POINTS: 5,
  V2_REMOVE_POINTS: 6,
  V2_USER_TO_VENDOR: 7,
  V2_POINTS_FROM_USER: 8,
  V2_CREDIT_BY_API: 9,
};

export type TransactionType =
  | "V2_ACCOUNT_RECEIVE"
  | "V2_EXCHANGE"
  | "V2_CHARGEBACK"
  | "V2_ACCOUNT_SEND"
  | "V2_ADD_POINTS"
  | "V2_REMOVE_POINTS"
  | "V2_USER_TO_VENDOR"
  | "V2_POINTS_FROM_USER"
  | "V2_CREDIT_BY_API";
