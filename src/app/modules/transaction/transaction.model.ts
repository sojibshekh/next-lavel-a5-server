// src/modules/transaction/transaction.model.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export type TransactionType = 
  | 'registration' 
  | 'top-up' 
  | "transfer"
  | 'withdraw' 
  | 'send' 
  | 'cash-in' 
  | 'cash-out';


export type TransactionStatus = 'pending' | 'completed' | 'reversed';

export interface ITransaction extends Document {
  type: TransactionType;
  fromUserId?: Types.ObjectId;
  toUserId?: Types.ObjectId;
  amount: number;
  fee?: number;
  commission?: number;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, enum: ['registration','top-up','transfer', 'withdraw', 'send', 'cash-in', 'cash-out' ], required: true },
    fromUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    toUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true, min: 0 },
    fee: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'completed', 'reversed','success'], default: 'completed' },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default TransactionModel;
