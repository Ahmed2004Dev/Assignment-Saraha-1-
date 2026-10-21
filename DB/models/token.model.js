import mongoose from "mongoose";



const tokenSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    jti: {
        type: String,
        required: false
    },
    expiresIn: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
})

tokenSchema.index("expiresIn" , {expireAfterSeconds:0})

export const tokenModel = mongoose.model.Token || mongoose.model("Token" , tokenSchema)