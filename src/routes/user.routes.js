import { Router } from "express";
import { refreshAcesstoken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {loginUser, logoutUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "profilePic",
            maxCount: 1
        }
    ]),                              // middleware injection
    registerUser
)

userRouter.route("/login").post(loginUser)

// Secure routes
userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("/refresh-token").post(refreshAcesstoken)

export default userRouter