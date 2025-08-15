import { Server } from 'http';

import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';
import { seedAdmin } from './app/utils/seedAdmin';



let server: Server;



const startServer = async () => {

   try{
    await mongoose.connect(envVars.DB_URL)

   console.log("Database connected successfully");

   server = app.listen(envVars.PORT, () => {
        console.log(`Server is running on port ${envVars.PORT}`);
   });
   } catch(error) {
    console.error("Database connection failed:", error);
    
   }

}

 (async()=>{
   await startServer();
    await seedAdmin()
})();

process.on('SIGTERM', () => {
    console.log("sigterm signal recieved. Shutting down the server...");

    if(server) {
        server.close(()=>{
             process.exit(1);
        });
        
    } 

    process.exit(1);

});


process.on('unhandledRejection', (err) => {
    console.log("Unhandled Rejection is detected. Shutting down the server...",err);

    if(server) {
        server.close(()=>{
             process.exit(1);
        });
        
    } 

    process.exit(1);

});





process.on('uncaughtException', (err) => {
    console.log("uncaught Exception  is detected. Shutting down the server...",err);

    if(server) {
        server.close(()=>{
             process.exit(1);
        });
        
    } 

    process.exit(1);

});
