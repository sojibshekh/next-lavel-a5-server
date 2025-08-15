import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middelwares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAcessToken); 
router.post("/logout", AuthControllers.logOut); 
router.post("/reset-password", checkAuth(...Object.values(Role)),AuthControllers.resetPassword);


export const AuthRoutes = router;