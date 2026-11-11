import multer from "multer"
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from 'node:path';


export const fileFieldValidation = {
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
    pdf: ['application/pdf'],
};



export const localFieldUpload = ({
    customPath = "general",
    lengthMax = 1
} = {}) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const fullPath = resolve(`../uploads/${customPath}`);
            if (!existsSync(fullPath)) {
                mkdirSync(fullPath, { recursive: true })
            }
            cb(null, fullPath)
        },
        filename: function (req, file, cb) {
            const uniqeFileName = randomUUID() + "_" + file.originalname;
            file.finalPath =  `uploads/${customPath}/${uniqeFileName}`
            cb(null, uniqeFileName)
        }
    })
    return multer({ storage , limits:{files:lengthMax}})
}



