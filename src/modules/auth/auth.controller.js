import { Router } from "express";
import { LoginJWT, SignupJWT } from "./auth.service.js";
import { successResponse } from './../../../common/utils/response/success.response.js';
import { ErrorException } from "../../../common/utils/response/error.handling.js";
import * as Validators from "./auth.validation.js";
import { validation } from "../../../middleware/validation.middleware.js";
const router = Router()

router.post("/signupjwt", validation(Validators.signupSechemValidators) , async (req, res, next) => {
   const account = await SignupJWT(req.body);
    return successResponse({ res, status: 201, data: account })

});

router.post("/loginjwt", validation(Validators.loginSechemValidators) , async (req, res, next) => {
    const credentials = await LoginJWT(req.body, `${req.protocol}://${req.host}`);
    return successResponse({ res, status: 201, message: "Login Successfully", data: credentials })
})


export default router