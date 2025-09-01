
import { Request, Response, NextFunction } from "express";
import { WalletService } from "./wallet.service";
import { catchAsync } from "../../utils/catchAsunc";
import { sendResponse } from "../../utils/sendRespons";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appErrors";
import { Types } from "mongoose";
import { Wallet } from "./wallet.model";

const addMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id; 
  const { amount } = req.body;

  if (!userId) throw new Error("Unauthorized");

  const wallet = await WalletService.addMoney(userId, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money added successfully",
    data: wallet,
  });
});

const withdrawMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;  
  const { amount } = req.body;

  if (amount <= 0) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Amount must be greater than zero",
    });
    return;  
  }

  const updatedWallet = await WalletService.withdrawMoney(userId, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money withdrawn successfully",
    data: updatedWallet,
  });
});


const sendMoneyToUser = catchAsync(async (req: Request, res: Response) => {
  const senderId = req.user?.id as string;
  const { recipientEmail, amount } = req.body;

  const result = await WalletService.sendMoney(senderId, recipientEmail, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money sent successfully",
    data: result,
  });
});



const getTransactionHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const role = req.user?.role;

  if (!userId) throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized", " ");

  const transactions = await WalletService.getTransactionHistory(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction history fetched successfully",
    data: transactions,
  });
});





const cashIn = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.user?.id; 
  const { recipientEmail, amount } = req.body;

 

  if (!agentId) throw new Error("Unauthorized");
  if (amount <= 0) throw new AppError(httpStatus.BAD_REQUEST, "Amount must be positive", " ");

  const wallet = await WalletService.cashIn(agentId, recipientEmail, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money added to user wallet successfully",
    data: wallet,
  });
});


const cashOut = catchAsync(async (req: Request, res: Response) => {
 const { agentEmail, amount } = req.body;
 const userId = req.user?.id;


const result = await WalletService.cashOut(userId, agentEmail, amount);

res.status(200).json({
  success: true,
  message: "Cash-out successful",
  data: result,
});

});


const getCommissionHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agentId = req.user?.id;

    console.log(agentId);

    const { commissions, totalCommission } = await WalletService.getCommissionHistory(agentId);

    res.status(200).json({
      success: true,
      message: "Commission history retrieved successfully",
      totalCommission,
      data: commissions
    });
  } catch (error) {
    next(error);
  }
};


const getWallet = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

     const result = await WalletService.getWallet();
        

     res.status(200).json({
      success: true,
      message: "show all wallte successfully",
     
      data: result
    });
    
}) 


const getMyWallet = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
        const userId = req.user?.id;
     const result = await WalletService.getMyWallet(userId);
        
     res.status(200).json({
      success: true,
      message: "show all wallte successfully",
     
      data: result
    });
    
}) 




export const WalletController = {
  addMoney,
  withdrawMoney,
  sendMoneyToUser,
  getTransactionHistory,
  cashIn,
  cashOut,
  getCommissionHistory,
  getWallet,
  getMyWallet
};
