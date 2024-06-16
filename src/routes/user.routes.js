import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, logoutUser, changePasssword, updateUser, refreshAcesstoken, registerUser } from "../controllers/user.controller.js"
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
userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/refresh-token").post(refreshAcesstoken)
userRouter.route("/change-password").post(verifyJWT, changePasssword)
userRouter.route("/update-account").patch(verifyJWT, updateUser)
export default userRouter