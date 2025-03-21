import express from "express"
import { addToCart, clearCart,  decreaseProductQty,  removeProductFromCart, userCart } from "../Controllers/cart.js";
import { Authenticated } from "../Middlewares/auth.js";

const router = express.Router();

//cart router
router.post("/add",Authenticated,addToCart);
//get user cart
router.get("/user",Authenticated,userCart)

//remove from product
router.delete("/remove/:productId",Authenticated,removeProductFromCart)

//clear
router.delete("/clear",Authenticated,clearCart)

//decrease item qty
router.post("/decrease",Authenticated,decreaseProductQty);


export default router
