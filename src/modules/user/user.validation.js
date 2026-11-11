import Joi from "joi";
import { generalValidationFileds } from "../../../common/utils/validation.js";
import { fileFieldValidation } from "../../../common/utils/multer/local.multer.js";

export const shareProfileValidation = {
    params: Joi.object().keys({
        userID: generalValidationFileds.id.required()
    }).required()
}

export const profileImageValidation = {
    file: generalValidationFileds.file(fileFieldValidation.image).required()
}
 
export const profileCoverImageValidation = {
    files: Joi.array().items(
        generalValidationFileds.file(fileFieldValidation.image).required()
    ).min(1).max(5).required()
}

export const profileAttachment = {
    files:Joi.object().keys({
        profileImage : Joi.array().items(
            generalValidationFileds.file(fileFieldValidation.image).required()
        ).length(1).required(),

        profileCoverImage : Joi.array().items(
            generalValidationFileds.file(fileFieldValidation.image).required()
        ).min(1).max(5).required()
    }).required()
}

export const updatePassword = {
    body:Joi.object().keys({
        oldPassword:generalValidationFileds.password.required(),
        password:generalValidationFileds.password.not(Joi.ref("oldPassword")).required(),
        confirmPassword:generalValidationFileds.confirmPassword("password").required()
    }).required()
}




