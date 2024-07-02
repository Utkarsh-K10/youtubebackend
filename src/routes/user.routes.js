import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    loginUser, 
    logoutUser, 
    changePasssword, 
    updateUser, 
    refreshAcesstoken, 
    registerUser, 
    updateAvatar, 
    updateCoverImage,
    getUserChannelProfle,
    getUserWatchHistory,
    getCurrentUser,

} from "../controllers/user.controller.js"

// secured auth import
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
userRouter.route("/currentUser").post(verifyJWT, getCurrentUser)
userRouter.route("/update-account").patch(verifyJWT, updateUser)
userRouter.route("/update-avatar").patch(verifyJWT,upload.single("avatar"), updateAvatar)
userRouter.route("/update-coverImage").patch(verifyJWT, upload.single("/coverImage"), updateCoverImage)
userRouter.route("/c/:username").get(verifyJWT,getUserChannelProfle)
userRouter.route("/watchHistory").get(verifyJWT, getUserWatchHistory) //get because we are not getting sensitive data

export default userRouter