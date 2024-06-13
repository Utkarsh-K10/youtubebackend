import { User } from "../models/user.models";
import { ApiErrorHandler } from "../utils/ApiErrorHandler";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.
            replace("Bearer ", "")
    
        if (!token) {
            throw new ApiErrorHandler(401, "unAuthorised Request !!")
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
