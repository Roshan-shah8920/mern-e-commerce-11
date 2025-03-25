import { Products } from "../Models/Product.js";

//add product
export const addProduct = async (req,res) => {
    const {title,description,price,category,qty,imgSrc} = req.body;
    try {
        let product = await Products.create({title,description,price,category,qty,imgSrc})
        res.json({message:"Product added successfully...!",product})
    } catch (error) {
        res.json(error.message)
    }
}

//get all product
export const getProduct = async (req,res) => {
    try {
        let product = await Products.find().sort({createdAt:-1})
        res.json({message:"All Product Add Success",product})
    } catch (error) {
        res.json(error.message)
    }
}

//findbyId in product
export const getProductById = async (req,res) => {
    try {
        const id = req.params.id;
        let products = await Products.findById(id);
        if(!products) return res.json({message:"Invalid Id"})
        res.json({message:"Specific Product",products})
    } catch (error) {
        res.json(error.message)
    }
}

//findbyId in product
export const updateProductById = async (req,res) => {
    try {
        const id = req.params.id;
        let products = await Products.findByIdAndUpdate(id,req.body,{new:true});
        if(!products) return res.json({message:"Invalid Id"})
        res.json({message:"Product has been update",products})
    } catch (error) {
        res.json(error.message)
    }
}

//delete product
export const deleteProductById = async (req,res) => {
    try {
        const id = req.params.id;
        let products = await Products.findByIdAndDelete(id);
        if(!products) return res.json({message:"Invalid Id"})
        res.json({message:"Product has been Delete",products})
    } catch (error) {
        res.json(error.message)
    }
}
