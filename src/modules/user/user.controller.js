import { Router } from "express";
import { successResponse } from './../../../common/utils/response/success.response.js';
import { Login, Signup } from "./user.service.js";
const router = Router()

router.post("/signup" , async (req,res,next)=>{
    const result = await Signup(req.body);
    return successResponse({res , status:201 , message:"Signup Successfully" , data:result})
});

router.post("/login" , async (req,res,next)=>{
    const result = await Login(req.body);
    return successResponse({res , status:201 , message:"Login Successfully" , data:result})
})

export default router