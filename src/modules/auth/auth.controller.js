import { Router } from "express";
import { confirmEmail, LoginJWT, requestForgetPasswordOtp, resendConfirmEmail, resetForgetPassword, SignupJWT, verifyForgetPasswordOtp } from "./auth.service.js";
import { successResponse } from './../../../common/utils/response/success.response.js';
import * as Validators from "./auth.validation.js";
import { validation } from "../../../middleware/validation.middleware.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import geoip from "geoip-lite";
import { decr, deleteKey_redis, exists_redis, expire_redis, incr } from "../../../common/services/redis.service.js";

const router = Router()
const authLimiter = rateLimit({
        windowMs: 2 * 60 * 1000,
        limit: async function (req) {
            const { country } = geoip.lookup(req.ip)
            return country === "EG" ? 3 : 0
        },
        statusCode: 500,
        skipFailedRequests:true,
        message: "To many Tryal",
        legacyHeaders: false,
        requestPropertyName: "ratelimits",
        standardHeaders: "draft-8",
        handler: (req, res, next) => {
            res.status(300).json({ Message: "To many Tryal" })
        },
        keyGenerator: async (req, res, next) => {
            console.log(req.headers["x-forwarded-for"]);
            const ip = ipKeyGenerator(req.ip, 56)
            console.log(`${ip}-${req.path}`);
            await deleteKey_redis(`${ip}-${req.path}`);
            return `${ip}-${req.path}`;
        },
        store: {
            async incr(key, cb) { // get called by keyGenerator
                try {
                    const count = await incr(key);
                    if (count === 1) await expire_redis(key, 60); // 1 min TTL
                    cb(null, count);
                } catch (err) {
                    cb(err);
                }
            },
            async decrement(key) { // called by skipFailedRequests:true , skipSuccessfulRequests:true
                if (await exists_redis(key)) {
                    await decr(key);
                }
            },
        }
    })

router.post("/signupjwt" ,validation(Validators.signupSechemValidators), async (req, res, next) => {
    const account = await SignupJWT(req.body);
    return successResponse({ res, status: 201, data: account })

});

router.post("/loginjwt", authLimiter,validation(Validators.loginSechemValidators), async (req, res, next) => {
    const credentials = await LoginJWT(req.body, `${req.protocol}://${req.host}`);
    return successResponse({ res, status: 201, message: "Login Successfully", data: credentials })
})

router.patch(
    "/confirm-Email",
    validation(Validators.confirmEmail),
    async (req, res, next) => {
        const account = await confirmEmail(req.body)
        return successResponse({ res, status: 201, data: account })
    })

router.patch(
    "/resend-confirm-Email",
    authLimiter,
    validation(Validators.resendConfirmEmail),
    async (req, res, next) => {
        const account = await resendConfirmEmail(req.body)
        return successResponse({ res, status: 201, data: account })
    })

router.post(
    "/requset-forget-password-code",
    validation(Validators.resendConfirmEmail),
    async (req, res, next) => {
        await requestForgetPasswordOtp(req.body)
        return successResponse({ res })
    })

    router.patch(
    "/verify-forget-password-code",
    validation(Validators.confirmEmail),
    async (req, res, next) => {
        await verifyForgetPasswordOtp(req.body)
        return successResponse({ res })
    })

    router.patch(
    "/reset-forget-password-code",
    validation(Validators.resetForgetPassword),
    async (req, res, next) => {
        await resetForgetPassword(req.body)
        return successResponse({ res })
    })
 
export default router