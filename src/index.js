import express from 'express';
import cors from 'cors';
import connectDB from './DB/DB.connect.js';
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";



const app = express();
dotenv.config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    // origin: "http://localhost:5173",
      origin: "http://localhost:3000", 
    credentials: true,
}));

connectDB()
import restRouter from "./Router/Router.RestApi.js"
app.use("/itemApi" , restRouter)

import videoRouter from "./Router/Router.Video.js"
app.use("/videoApi" , videoRouter)

import ShortenLinkRouter from './Router/Route.ShortenLink.js'
app.use("/LinkCovert" , ShortenLinkRouter)

import userRouter from "./Router/user.router.js"
app.use("/user",userRouter)

import aggragationPopulate from "./Router/aggragationPop.router.js"
app.use("/aggragationPopulate", aggragationPopulate)

import productionRouter  from "./Router/production.route.js"
app.use("/production",productionRouter)

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
  
export default app;
