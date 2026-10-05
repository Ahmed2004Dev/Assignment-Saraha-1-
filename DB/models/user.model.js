import mongoose from "mongoose";
import { genderEnum, provideEnum } from "../../common/enums/user/user.enum.js";



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [2, `firstName cannot be less than 2 char but you have entered a {VALUE}`],
        maxLength: 25,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 25,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    gender: {
        type: Number,
        enum: Object.values(genderEnum),
        default: genderEnum.Male
    },
    providor: {
        type: Number,
        enum: Object.values(provideEnum),
        default: provideEnum.System
    },
    converProfilePicture: [String],
    confirmEmail:Date,
    changeCredentialTime : Date,
},
{
    collection:"Route_Users",
    timestamps:true,
    strict:true,
    strictQuery:true,
    optimisticConcurrency:true,
    autoIndex:true,
});

userSchema.virtual("username").set(function (value) {
    const [firstName , lastName] = value?.split(" ") || [];
    this.set({firstName , lastName})
}).get(function () {
    return this.firstName+" "+this.lastName
})

export const UserModel = mongoose.models.User || mongoose.model("User" , userSchema)