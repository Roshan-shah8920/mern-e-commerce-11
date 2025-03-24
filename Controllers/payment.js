import { Payment } from "../Models/Payment.js";
import Stripe from "stripe";
import dotenv from "dotenv";

// ✅ Load Environment Variables
dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("❌ STRIPE_SECRET_KEY is missing in .env file!");
  process.exit(1);
}

// Initialize Stripe with API version (update version as needed)
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2022-11-15", // aap yahan latest stable version de sakte hain
});

// ✅ Checkout Route (Create Stripe Checkout Session)
export const checkout = async (req, res) => {
  try {
    const { amount, cartItems, userShipping, userId } = req.body;

    if (!amount || !cartItems || !userShipping || !userId) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "INR",
          product_data: { name: item.title },
          unit_amount: item.price * 100, // Stripe requires amount in paise
        },
        quantity: item.qty,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: { userId },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    res.status(500).json({ message: "Stripe Payment Failed", error: error.message });
  }
};

// ✅ Verify Payment & Save to Database
export const verify = async (req, res) => {
  try {
    const { paymentIntentId, amount, orderItems, userId, userShipping } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: "Payment Intent ID required!" });
    }

    // ✅ Fetch PaymentIntent Details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment Not Successful", success: false });
    }

    // ✅ Save Order to Database
    let orderConfirm = await Payment.create({
      orderId: paymentIntent.id,
      amount,
      orderItems,
      userId,
      userShipping,
      payStatus: "paid",
      orderDate: new Date(),
    });

    res.json({ message: "Payment Successful", success: true, orderConfirm });
  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    res.status(500).json({ message: "Payment Verification Failed" });
  }
};

// ✅ Get Orders for a Specific User
export const userOrder = async (req, res) => {
  try {
    let userId = req.user._id.toString();
    let orders = await Payment.find({ userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Error Fetching User Orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ✅ Get All Orders (Admin)
export const allOrders = async (req, res) => {
  try {
    let orders = await Payment.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Error Fetching All Orders:", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};
