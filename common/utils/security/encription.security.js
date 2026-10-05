import crypto from "node:crypto";
import { ENC_SECRET_KEY, IVE_LENGTH } from "../../../config/config.service.js";

export const generateEncription = async (plainText) => {
    const iv = crypto.randomBytes(IVE_LENGTH);
    console.log(iv.toString("hex"));
    const CipherIV = crypto.createCipheriv("aes-256-cbc", ENC_SECRET_KEY, iv)
    let cipherText = CipherIV.update(plainText, "utf8", "hex");
    cipherText += CipherIV.final("hex");
    console.log({ iv, ivT: iv.toString('hex'), CipherIV, cipherText });
    return `${iv.toString("hex")}:${cipherText}`
};


export const generateDecryption = async (cipherText)=>{
    const [iv , EncryptData] = cipherText.split(":") || [];
    const ivLikeBinary = Buffer.from(iv , "hex");
    const deCipherText = crypto.createDecipheriv("aes-256-cbc" , ENC_SECRET_KEY , ivLikeBinary);
    let plainText = deCipherText.update(EncryptData , "hex" , "utf8");
    plainText += deCipherText.final("utf8");
    console.log({iv , EncryptData , ivLikeBinary , deCipherText , plainText});
    
    return plainText
}