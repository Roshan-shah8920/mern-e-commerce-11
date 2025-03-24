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

// ✅ Stripe balance check (Optional, sirf debugging ke liye)
(async () => {
    try {
        const balance = await stripe.balance.retrieve();
        console.log("✅ Stripe Balance:", balance);
    } catch (error) {
        console.error("❌ Stripe Test Error:", error.message);
    }
})();

// ✅ Check .env file for missing keys
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY is missing in .env file!");
    process.exit(1);
}

// ✅ MongoDB Connection with database name
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://rs20150190128:7lK5aLS9RaC84yyy@cluster0.ajsn1.mongodb.net/ecommerceDB?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((error) => console.log("❌ MongoDB Connection Error:", error));

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// ✅ CORS Configuration (Fix frontend issue)
const allowedOrigins = [
    "https://mern-e-commerce-frontend-m5yq.vercel.app", // Your current frontend
    "https://mern-e-commerce-frontend.vercel.app",      // Alternate frontend
    "http://localhost:5173" // For local development
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

// ✅ Handle preflight CORS requests
app.options("*", cors());

// ✅ Routes
import userRouter from './Routes/user.js';
import productsRouter from './Routes/product.js';
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import paymentRouter from "./Routes/payment.js";

app.use("/api/user", userRouter);
app.use("/api/product", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/payment", paymentRouter);

// ✅ Home route
app.get("/", (req, res) => {
    res.json({ message: "✅ Server is running successfully!" });
});

// ✅ Dynamic Port (for Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
