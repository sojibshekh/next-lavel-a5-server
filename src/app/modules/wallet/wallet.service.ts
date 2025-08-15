import { Wallet } from "./wallet.model";
import AppError from "../../errorHelpers/appErrors";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { ISendMoneyPayload } from "./wallet.interface";
import TransactionModel from "../transaction/transaction.model";

const addMoney = async (userId: string, amount: number) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID", " ");
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found", " ");
  }

  if (wallet.isLocked) {
    throw new AppError(httpStatus.FORBIDDEN, "Wallet is locked", " ");
  }

  wallet.balance += amount;

  const transaction = await TransactionModel.create({
    type: "top-up",
    amount,
    date: new Date(),
    toUserId: wallet.userId,
    status: "completed",
  });

    wallet.transactions.push(transaction._id as Types.ObjectId);


  await wallet.save();

  return wallet;
};

const withdrawMoney = async (userId: string, amount: number) => {
  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found", " ");
  }

  if (wallet.isLocked) {
    throw new AppError(httpStatus.FORBIDDEN, "Wallet is locked", " ");
  }

  if (wallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance", " ");
  }

  wallet.balance -= amount;

  const transaction = await TransactionModel.create({
    type: "withdraw",
    amount,
    date: new Date(),
    toUserId: wallet.userId,
    status: "completed",
  });

    wallet.transactions.push(transaction._id as Types.ObjectId);


  await wallet.save();

  return wallet;
};


const sendMoney = async ( senderId: string, recipientEmail: string, amount: number) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount must be positive", " ");
  }

  const senderWallet = await Wallet.findOne({ userId: senderId });
  if (!senderWallet || senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance", " ");
  }

  
   
  const recipientUser = await User.findOne({ email: recipientEmail });

  if (!recipientUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Recipient not found", " ");
  }

  const recipientWallet = await Wallet.findOne({ userId: recipientUser._id });
  if (!recipientWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Recipient wallet not found", " ");
  }

  const transaction = await TransactionModel.create({
    type: "transfer",
    fromUserId: senderWallet.userId,
    toUserId: recipientWallet.userId,
    amount,
    status: "success",
    date: new Date(),
  });

   senderWallet.balance -= amount;
   recipientWallet.balance += amount;
   
   senderWallet.transactions.push(transaction._id as Types.ObjectId);
   recipientWallet.transactions.push(transaction._id as Types.ObjectId);

   await senderWallet.save();
   await recipientWallet.save();

  

  return {
    senderWallet,
    recipientWallet,
    transaction,
  };
};



const getTransactionHistory = async (userId: string, role: string) => {
  if (role === "admin") {
  
    return await TransactionModel.find()
      .populate("fromUserId", "email")
      .populate("toUserId", "email")
      .select("type amount date status fromUserId toUserId")
      .lean();
  }


  const wallet = await Wallet.findOne({ userId })
    .populate({
      path: "transactions",
      model: "Transaction",
      select: "type amount date status fromUserId toUserId",
      populate: [
        { path: "fromUserId", select: "email" },
        { path: "toUserId", select: "email" },
      ],
    })
    .lean();

  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found", " ");

  return wallet.transactions;
};





const cashIn = async (agentId: string, recipientEmail: string, amount: number) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount must be positive", " ");
  }

  // ✅ Recipient user find 
  const recipientUser = await User.findOne({ email: recipientEmail });
  if (!recipientUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Recipient not found", " ");
  }

  // ✅ Recipient wallet find
  const recipientWallet = await Wallet.findOne({ userId: recipientUser._id });
  if (!recipientWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Recipient wallet not found", " ");
  }
  if (recipientWallet.isLocked) {
    throw new AppError(httpStatus.FORBIDDEN, "Recipient wallet is locked", " ");
  }

  // ✅ Agent wallet (Commission tracking)
  const agentWallet = await Wallet.findOne({ userId: agentId });
  if (!agentWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found", " ");
  }

  // 💰 Commission 
  const commission = Math.round(amount * 0.01); // 1%
  const netAmount = amount - commission;

  // ✅ Recipient wallet add
  recipientWallet.balance += netAmount;

  // 📜 Transaction create
  const transaction = await TransactionModel.create({
    type: "cash-in",
    amount: netAmount,
    fromUserId: agentId,
    toUserId: recipientUser._id,
    commission,
    status: "success",
    date: new Date(),
  });

  // Transaction log দুই দিকেই
  recipientWallet.transactions.push(transaction._id as Types.ObjectId);
  agentWallet.transactions.push(transaction._id as Types.ObjectId);

  // ✅ Save করা
  await recipientWallet.save();
  await agentWallet.save();

  return {
    recipientWallet,
    agentWallet,
    transaction,
  };
};



const cashOut = async (agentId: string, recipientEmail: string, amount: number) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount must be positive", " ");
  }

  // ✅ Recipient user খুঁজে বের করো
  const recipientUser = await User.findOne({ email: recipientEmail });
  if (!recipientUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Recipient not found", " ");
  }

  // ✅ Recipient wallet খুঁজে বের করো (যেখান থেকে টাকা কাটা হবে)
  const recipientWallet = await Wallet.findOne({ userId: recipientUser._id });
  if (!recipientWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Recipient wallet not found", " ");
  }
  if (recipientWallet.isLocked) {
    throw new AppError(httpStatus.FORBIDDEN, "Recipient wallet is locked", " ");
  }
  if (recipientWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance", " ");
  }

  // ✅ Agent wallet (Commission এর জন্য)
  const agentWallet = await Wallet.findOne({ userId: agentId });
  if (!agentWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found", " ");
  }

  // 💰 Commission হিসাব (Agent পাবে)
  const commission = Math.round(amount * 0.01); // 1%
  const totalDeduction = amount + commission; // user এর থেকে কাটা হবে amount+commission

  if (recipientWallet.balance < totalDeduction) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance for cash-out + commission", " ");
  }

  // ✅ User wallet থেকে টাকা কাটা
  recipientWallet.balance -= totalDeduction;

  // ✅ Agent wallet এ টাকা যোগ করা (commission অংশ)
  agentWallet.balance += commission;

  // 📜 Transaction create
  const transaction = await TransactionModel.create({
    type: "cash-out",
    amount,
    fromUserId: recipientUser._id,
    toUserId: agentId,
    commission,
    status: "success",
    date: new Date(),
  });

  // Transaction log দুই দিকেই
  recipientWallet.transactions.push(transaction._id as Types.ObjectId);
  agentWallet.transactions.push(transaction._id as Types.ObjectId);

  // ✅ Save করা
  await recipientWallet.save();
  await agentWallet.save();

  return {
    recipientWallet,
    agentWallet,
    transaction,
  };
};


const getCommissionHistory = async (agentId: string) => {
  const commissions = await TransactionModel.find({
    $or: [
      { fromUserId: agentId }, 
      { toUserId: agentId }
    ],
    type: { $in: ["cash-in", "cash-out"] },
    commission: { $gt: 0 },
  }).sort({ createdAt: -1 });

  console.log(commissions)
  // মোট কমিশন হিসাব
  const totalCommission = commissions.reduce((sum, tx) => sum + (tx.commission || 0), 0);

  return { commissions, totalCommission };
};


const getWallet = async () => {
   const wallet = await Wallet.find({});
  const totalWallet = await Wallet.countDocuments({});
  return {
    data: wallet,
    meta: {
      total: totalWallet
    }
  }
};





export const WalletService = {
  addMoney,
  withdrawMoney,
  sendMoney,
  getTransactionHistory,
  cashIn,
  cashOut,
  getCommissionHistory,
  getWallet
};
