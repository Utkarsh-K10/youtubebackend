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
        fullName: {
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
        watchHistory: [{
            type: Schema.Types.ObjectId,
            ref: "Video"
        }],
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// checeking if user changed password with Mongo middleware 
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// mongoose methods to check password is correct 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// using methods to genreate the tokens 
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}



export const User = mongoose.model("User", userSchema);