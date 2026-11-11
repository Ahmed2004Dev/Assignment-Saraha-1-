import Joi from "joi";
import { generalValidationFileds } from './../../../common/utils/validation.js';
import { fileFieldValidation } from "../../../common/utils/multer/local.multer.js";


export const sendMessageValidation = {
    params: Joi.object().keys({
        receiverId: generalValidationFileds.id.required(),
    }).required(),
    body: Joi.object().keys({
        content: Joi.string().min(2).max(10000).allow("", null)
    }),
    files: Joi.array().items(generalValidationFileds.file(fileFieldValidation.image)).min(0).max(2)
};

export const getMessageValidation = {
    params: Joi.object().keys({
        messageId: generalValidationFileds.id.required(),
    }).required(),
}