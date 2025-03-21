import express from "express"
import { addProduct, deleteProductById, getProduct, getProductById, updateProductById } from "../Controllers/Product.js";


const router = express.Router();

//add product
router.post("/add",addProduct)

//all Product
router.get("/all",getProduct)

//get Product
router.get("/:id",getProductById)

//get updateProductbyid
router.put("/:id",updateProductById)

//delete product
router.delete("/:id",deleteProductById)

export default router