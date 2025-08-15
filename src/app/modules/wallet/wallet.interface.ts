import { Types } from "mongoose";

export interface IWallet {
  userId: Types.ObjectId;
  balance: number;
  currency?: string;
  isLocked?: boolean;
  transactions: Types.ObjectId[];  

}


export interface ISendMoneyPayload {
  recipientEmail: string;
  amount: number;
}
