import { Router } from "express";
import { LoginJWT, SignupJWT } from "./auth.service.js";
import { successResponse } from './../../../common/utils/response/success.response.js';
const router = Router()

router.post("/signupjwt" , async (req,res,next)=>{
    const result = await SignupJWT(req.body);
    return successResponse({res , status:201 , message:"Signup Successfully" , data:result})
});

router.post("/loginjwt" , async (req,res,next)=>{
    const result = await LoginJWT(req.body , `${req.protocol}://${req.host}`);
    return successResponse({res , status:201 , message:"Login Successfully" , data:result})
})


export default router