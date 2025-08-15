import { Router } from "express"
import { userRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { walletRoutes } from "../modules/wallet/wallet.route";



 export const router = Router();

const modulesRoute =[
    {
        path: '/user',
        route:userRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/wallet',
        route: walletRoutes
    }
]



modulesRoute.forEach((route) =>{
    router.use(route.path, route.route)
})