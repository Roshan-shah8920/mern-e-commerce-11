import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import Stripe from "stripe";
import dotenv from "dotenv"; 

dotenv.config(); 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });
  
  (async () => {
    try {
      const balance = await stripe.balance.retrieve();
      console.log("Stripe Balance:", balance);
    } catch (error) {
      console.error("Stripe Test Error:", error.message);
    }
  })();
// console.log("Stripe Secret Key (DEBUG):", process.env.STRIPE_SECRET_KEY);

import userRouter from './Routes/user.js';
import productsRouter from './Routes/product.js';
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import paymentRouter from "./Routes/payment.js";




// ✅ Check .env file se STRIPE_SECRET_KEY mil raha hai ya nahi
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY is missing in .env file!");
    process.exit(1);
}

mongoose.connect("mongodb+srv://rs20150190128:7lK5aLS9RaC84yyy@cluster0.ajsn1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((error) => console.log(error));

const app = express();
app.use(express.json());
app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(bodyParser.json());

// Routers
app.use("/api/user", userRouter);
app.use("/api/product", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/payment", paymentRouter);

// Home route
app.get("/", (req, res) => {
    res.json({ message: "This is home route" });
});

const port = 3000;
app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
