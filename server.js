import express from "express"
const app = express();
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from './Routes/user.js'
import productsRouter from './Routes/product.js'
import cartRouter from "./Routes/cart.js"
import addressRouter from "./Routes/address.js"
import paymentRouter from "./Routes/payment.js"

mongoose.connect("mongodb+srv://rs20150190128:7lK5aLS9RaC84yyy@cluster0.ajsn1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log("MongoDB connected")).catch((error)=>console.log(error)
)
app.use(express.json())
app.use(cors({
    origin:true,
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));
app.use(bodyParser.json());

//user Router
app.use("/api/user",userRouter)

//add Product
app.use("/api/product",productsRouter)

//cart Router
app.use("/api/cart",cartRouter);

//address Router
app.use("/api/address",addressRouter)

//payment
app.use("/api/payment",paymentRouter)

//home testing
app.get("/",(req,res)=>{
    res.json({message:"This is home route"})
})


const port = 3000;
app.listen(port,()=>console.log(`server is running on port ${port}`))


// usename = rs20150190128
//Password = 7lK5aLS9RaC84yyy
//mongodb+srv://rs20150190128:7lK5aLS9RaC84yyy@cluster0.ajsn1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0