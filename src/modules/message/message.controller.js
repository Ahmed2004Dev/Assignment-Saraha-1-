import { Router } from "express";
import { deleteMessage, getAllMessage, getMessage, sendMessage } from "./message.service.js";
import { successResponse } from './../../../common/utils/response/success.response.js';
import { validation } from './../../../middleware/validation.middleware.js';
import * as Validators from "./message.validation.js";
import { fileFieldValidation, localFieldUpload } from './../../../common/utils/multer/local.multer.js';
import { NotFoundException } from "../../../common/utils/response/error.handling.js";
import { decodToken } from "../../../common/utils/security/token.security.js";
import { TokenTypeEnum } from "../../../common/enums/user/security.enms.js";
import { authentication } from './../../../middleware/authentication.middleware.js';
const router = Router({caseSensitive:true , strict:true , mergeParams:true});

router.post(
    "/sendmessage/:receiverId",
    async (req, res, next) => {
    if (req.headers.authorization) {
        const { user, decoded } = await decodToken({ 
            token: req.headers.authorization.split(" ")[1], 
            tokenType: TokenTypeEnum.Access 
        });
        req.user = user;
        req.decoded = decoded;
    }
    next();
},
    localFieldUpload({ validation: fileFieldValidation.image, customPath: "Messages", lengthMax: 2 }).array("attachments", 2),
    validation(Validators.sendMessageValidation),
    async (req, res, next) => {
        if (!req.body?.content && !req.files?.length) {
            return NotFoundException({ message: "Validation error", extra: { key: "body", path: ['content'], message: "missing content" } })
        }
        const message = await sendMessage(req.params.receiverId, req.body, req.files , req.user)
        return successResponse({ res, status: 201, data: { message } })
    }
)

router.get(
    "/listMessages",
    authentication(),
    async (req, res, next) => {
        const messages = await getAllMessage(req.user);
        return successResponse({ res, data: { messages } });
    }
);

router.get(
    "/:messageId",
    authentication(),
    validation(Validators.getMessageValidation),
    async (req, res, next) => {
        const message = await getMessage(req.params.messageId, req.user);
        return successResponse({ res, data: { message } });
    }
);

router.delete(
    "/:messageId",
    authentication(),
    validation(Validators.getMessageValidation),
    async (req, res, next) => {
        const message = await deleteMessage(req.params.messageId, req.user);
        return successResponse({ res, data: { message } });
    }
);


export default router


