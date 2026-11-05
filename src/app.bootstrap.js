import express from "express"
import { APPLICATION_NAME, EMAIL_APP, PORT } from "../config/config.service.js";
import { userRouter } from "./modules/user/index.js";
import { authRouter } from "./modules/auth/index.js";
import { connectDB } from "../DB/connectDB.js";
import { GlobalErrorHandling } from "../common/utils/response/error.handling.js";
import cors from "cors"
import { connectRedis } from "../DB/redis.connection.db.js";
import { sendEmail } from "../common/utils/email/index.js";
import { resolve } from "node:path";

const bootstrap = async () => {
    // Express
    const app = express();
    app.use(cors())
    app.use(express.json());
    app.use('/uploads', express.static('../uploads'));

    // Connect DB
    await connectDB()
    await connectRedis()

    // Routers
    app.use("/user", userRouter);
    app.use("/auth", authRouter);


    app.use(GlobalErrorHandling)
    app.use("{/*dummy}", (req, res) => { return res.status(404).json({ Massage: "Invalid routing please try again" }) })
    app.listen(PORT, () => {
        console.log(`The Server is working at Port ${PORT}👍`);
    })
}

export default bootstrap