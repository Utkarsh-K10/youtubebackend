import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema(
    {
        username: {
            type: String,
            reuqired: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true
        },
        email: {
            type: String,
            reuqired: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        fullname: {
            type: String,
            reuqired: true,
            trim: true,
            index: true
        },
        password: {
            type: String, //encryption
            reuqired: [true, 'Password is required']
        },
        avatar: {
            type: String, //image url 
        },
        profilePic: {
            type: String //image url
        },
        watchHistory: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function(next){
    if (!this.isModified ("password")) return next()
    
    this.password = bcrypt.hash(this.password, 10)
    next()  
})
export const User = mongoose.model("User", userSchema);