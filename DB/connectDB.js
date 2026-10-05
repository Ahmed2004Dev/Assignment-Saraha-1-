import mongoose from "mongoose";
import { URI } from "../config/config.service.js";
import { UserModel } from "./models/user.model.js";

export const connectDB = async () => {
    try {
        const result = await mongoose.connect(URI);
        console.log("Connect DB successfully👍");
        await UserModel.syncIndexes()

    } catch (error) {
        console.log(error);
        console.log("Fail to connect DB 👎");
    }
}