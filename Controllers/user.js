import { User } from '../Models/user.js'; 
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//user register
export const register = async (req,res) => {
    const {name,email,password} = req.body;
    try {
        let user = await User.findOne({email})
        if (user) 
            return res.json({message:"User Alreadly Exist",success:false})
        const hashpass = await bcrypt.hash(password,10);
         user = await User.create({name,email,password: hashpass});
        res.json({message:"User Register successfully...!",user,success:true})
    } catch (error) {
        res.json({message:error.message})
    }
}
//user login
export const login = async (req,res) => {
 const {email,password} = req.body;
 try {
    let user = await User.findOne({email})
    if (!user) 
        return res.json({message:"User Not Found",success:false})
        const validPassword = await bcrypt.compare(password,user.password)
        if (!validPassword) 
            return res.json ({message:"Invalid Credential",success:false})
        const token = jwt.sign({userId:user._id},"!@#$%^&*()",{
            expiresIn:"365d"
        })
        res.json({message:`Welcome ${user.name}`,token,success:true})
    
 } catch (error) {
    res.json({message:error.message})
 }   
}
//all user 
export const users = async (req,res) => {
    try {
        let users = await User.find().sort({createdAt:-1});
        res.json(users)
    } catch (error) {
        res.json(error.message)
    }
}
//User profile
export const profile = async (req,res) => {
    res.json({user:req.user})
}