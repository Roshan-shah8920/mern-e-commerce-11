import express from "express"
import { getAddress, userAddress } from "../Controllers/address.js";
import { Authenticated } from "../Middlewares/auth.js";

const route = express.Router();

//add to address
route.post("/add",Authenticated,userAddress)

//get address
route.get("/get",Authenticated,getAddress)

export default route;