import { Cart } from "../Models/cart.js";

// Add a product to cart
export const addToCart = async (req, res) => {
    try {
        console.log("🔹 User in request:", req.user); // Debugging user
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { productId, title, price, qty, imgSrc } = req.body;
        console.log("🔹 Received Data:", req.body);

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const userId = req.user._id; // ✅ Fixing req.user access

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        let existingItem = cart.items.find(item => item.productId?.toString() === productId);

        if (existingItem) {
            existingItem.qty += qty;
            existingItem.price += price;
        } else {
            cart.items.push({ productId, title, price, qty, imgSrc });
        }

        await cart.save();
        res.json({ message: "Item Added/Updated in Cart", cart });
    } catch (error) {
        console.error("❌ Backend Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

//Add to user
export const userCart = async (req,res) => {
    const userId = req.user;
    let cart = await Cart.findOne({userId});
    if(!cart) return res.json({message:"cart not found"}) 
        res.json({message:"user cart",cart})
}

//remove to cart
export const removeProductFromCart = async (req,res) => {
    const productId = req.params.productId;
    const userId = req.user;

    let cart = await Cart.findOne({userId})
    if(cart) return res.json({message:"Cart not found"})
        cart.items = cart.items.filter((item)=>item.productId.toString()!==productId)
    await cart.save()
    res.json({message:"product remove from cart",cart})
}

//clear for all data
export const clearCart = async (req,res) => {
    const userId = req.user
    let cart = await Cart.findOne({userId})
    if (!cart) {
        cart = new Cart({userId,items:[]})
    }else{
        cart.items = [];
    }
    await cart.save();
    res.json({message:"Product Clear form Cart"})
}

//decrease qty from cart
export const decreaseProductQty = async (req, res) => {
    try {
        const { productId, qty } = req.body; // ✅ Corrected spacing
        const userId = req.user; 

        if (!productId || !qty) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        let existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        let existingItem = cart.items[existingItemIndex];

        if (existingItem.qty > qty) {
            const pricePerUnit = existingItem.price / existingItem.qty; // ✅ Fixed calculation
            existingItem.qty -= qty;
            existingItem.price -= pricePerUnit * qty;
        } else {
            cart.items.splice(existingItemIndex, 1);
        }

        await cart.save();
        return res.json({ message: "Product quantity decreased", cart });
    } catch (error) {
        console.error("Error in decreaseProductQty:", error); // ✅ Debugging
        return res.status(500).json({ message: error.message });
    }
};
