import express from "express";
import { WalletController } from "./wallet.controller";
import { checkAuth } from "../../middelwares/checkAuth";
import { Role } from "../user/user.interface";


const router = express.Router();


router.get("/my-wallet", checkAuth("user", "agent", "admin"), WalletController.getMyWallet);

router.post("/add-money", checkAuth(Role.USER), WalletController.addMoney);
router.post("/withdraw", checkAuth(Role.USER, Role.AGENT), WalletController.withdrawMoney);

router.post("/send-money", checkAuth(Role.USER), WalletController.sendMoneyToUser);

router.get("/transactions", checkAuth(Role.USER , Role.ADMIN ), WalletController.getTransactionHistory);

router.post("/cash-in", checkAuth(Role.AGENT), WalletController.cashIn);

router.post("/cash-out", checkAuth(Role.AGENT), WalletController.cashOut);

router.get("/commission-history", checkAuth(Role.AGENT), WalletController.getCommissionHistory);

router.get("/", checkAuth("admin"), WalletController.getWallet);


export const walletRoutes = router;
