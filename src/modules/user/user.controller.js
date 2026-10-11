import { Router } from "express";
import { successResponse } from './../../../common/utils/response/success.response.js';
import { profile, rotateToken } from "./user.service.js";
import { authentication, authorization } from "../../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../../common/enums/user/security.enms.js";
import { RoleEnum } from "../../../common/enums/user/user.enum.js";
const router = Router()

router.get("/", authentication(TokenTypeEnum.Access), authorization([RoleEnum.user]), async (req, res, next) => {
    const account = await profile(req.user);
    return successResponse({ res, data: account })
});

router.get("/rotate", authentication(TokenTypeEnum.Refresh), async (req, res, next) => {
    const account = await rotateToken(req.user, `${req.protocol}://${req.host}`);
    return successResponse({ res, data: account });
});

export default router