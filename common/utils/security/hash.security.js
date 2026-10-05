import { hash } from "bcrypt"
import { SALT_RANDOM } from "../../../config/config.service.js"

export const generateHash = async ({
    plainText,
    SALT = SALT_RANDOM,
}) => {
    return await hash(plainText, SALT)
}