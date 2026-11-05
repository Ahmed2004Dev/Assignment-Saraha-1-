import { Types } from "mongoose"
import Joi from "joi";
export const generalValidationFileds = {
    // Otp validatoin
    otp:Joi.string().pattern(new RegExp(/^\d{6}$/)) ,
    // Login & Sinup Validation (authentication)
    email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ["com", "net"] } }),
    password: Joi.string().pattern(new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/)),
    // Signup
    username: Joi.string().pattern(new RegExp(/^[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,24}$/)).messages({
        "any.required": "username is required",
        "string.empty": "username cannot be empty"
    }),
    phone: Joi.string().pattern(new RegExp(/^(00201|\+201|01) (0|1|2|5)\d{8}$/)),
    confirmPassword: function (path = "password") {
        return Joi.string().valid(Joi.ref(path))
    },




    // User Validation
    id: Joi.string().custom((value, helper) => {
        // console.log({value , helper});
        return Types.ObjectId.isValid(value) ? true : helper.message("Inavalid userid")
    }),



    // file validation

    file: function (validation = []) {
      return  Joi.object().keys({
            "fieldname": Joi.string().required(),
            "originalname": Joi.string().required(),
            "encoding": Joi.string().required(),
            "mimetype": Joi.string().valid(...Object.values(validation)).required(),
            // "finalPath": Joi.string().required(),
            "path": Joi.string().required(),
            "destination": Joi.string().required(),
            "filename": Joi.string().required(),
            "size": Joi.number().required(),
        })
    }
}
