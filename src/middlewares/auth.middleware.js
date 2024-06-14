import { User } from "../models/user.models.js";
import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    // (req, res or _, next)
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.
            replace("Bearer ", "")
        if (!token) {
            throw new ApiErrorHandler(401, "Unauthorised Request !!")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).
        select("-password -refreshToken")
    
        if (!user) {
            throw new ApiErrorHandler(401, "Invalid Acess Token..")    
        }
        
        req.user = user
        next()
    
    } catch (error) {
        throw new ApiErrorHandler(401, error?.message || "Invalid Token")
    }
})
