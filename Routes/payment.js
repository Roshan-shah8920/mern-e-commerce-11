import express from 'express'
import {
  checkout,
  verify,
  userOrder,
  allOrders,
} from "../Controllers/Payment.js";
import { Authenticated } from '../Middlewares/auth.js';

const router = express.Router();

// ✅ Checkout pe authentication add kiya
router.post('/checkout', Authenticated, checkout);

// Verify-payment & save to DB
router.post('/verify-payment', verify);

// User order
router.get("/userorder", Authenticated, userOrder);

// All orders
router.get("/orders", allOrders);

export default router;
