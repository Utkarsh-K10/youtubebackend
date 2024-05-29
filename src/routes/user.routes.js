import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const userRouter = Router()

userRouter.route("/register").post(
    upload.fields(                              // middleware injection
        {
            name: "avatar",
            maxCount : 1

        },
        {
            name : "profilePic",
            maxCount : 1
        }
    ),
    registerUser
)

export default userRouter