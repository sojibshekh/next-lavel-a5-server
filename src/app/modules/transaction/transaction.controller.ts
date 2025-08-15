// src/modules/transaction/transaction.controller.ts
import { Request, Response } from 'express';
import TransactionModel from './transaction.model';

export const getMyTransactions = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    const transactions = await TransactionModel.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).sort({ createdAt: -1 });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};
