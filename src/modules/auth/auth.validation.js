import Joi from "joi"
import { generalValidationFileds } from "../../../common/utils/validation.js"

export const loginSechemValidators = {
    body: Joi.object().keys({
        email: generalValidationFileds.email.required(),
        password: generalValidationFileds.password.required(),
    }).required()
}


export const signupSechemValidators = {
    body: loginSechemValidators.body.append().keys({
        username: generalValidationFileds.username.required(),
        phone: generalValidationFileds.phone.required(),
        confirmPassword: generalValidationFileds.confirmPassword("password").required()
    }).required(),
}

export const resendConfirmEmail = {
    body: Joi.object().keys({
        email: generalValidationFileds.email.required(),
    }).required()
}

export const confirmEmail = {
    body: resendConfirmEmail.body.append({
        otp: generalValidationFileds.otp.required()
    }).required()
}