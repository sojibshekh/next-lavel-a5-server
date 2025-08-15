import mongoose, { Schema, model, Types } from "mongoose";

interface ITransaction {
  type: string;
  amount: number;
  date: Date;
}

export interface IWallet {
  userId: Types.ObjectId;
  balance: number;
  currency: string;
  isLocked: boolean;
  transactions: Types.ObjectId[];
}

// const transactionSchema = new Schema<ITransaction>({
//   type: { type: String, required: true },
//   amount: { type: Number, required: true },
//   date: { type: Date, required: true },
// }, { _id: false });





const transactionSchema = new Schema<ITransaction>({
  type: {
    type: String,
    required: true,
    enum: ['top-up', 'withdraw', 'send', 'cash-in', 'cash-out', 'transfer'], // ✅ শুধু এগুলোই valid
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
}, { _id: false });


const walletSchema = new Schema<IWallet>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "BDT" },
  isLocked: { type: Boolean, default: false },
  // transactions: { type: [transactionSchema], default: [] }
  transactions: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
  },
],

});

export const Wallet = model<IWallet>("Wallet", walletSchema);
