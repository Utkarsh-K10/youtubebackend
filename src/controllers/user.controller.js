import { User } from "../models/user.models.js";
import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cloudinaryUploader } from "../utils/cloudinary.js";

// register user
const registerUser = asyncHandler(async (req, res) => {

    // when data is coming from JSON or FORM we use req.body
    const { fullName, email, username, password } = req.body
    // console.log("FullName: ", fullName)

    //check if fields are empty and use error handler utility
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiErrorHandler(400, "all fields are mandatory")
    }
    // find user with email or username
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    // check user already exists in database and throw new error
    if (existedUser) {
        throw new ApiErrorHandler(409, "User with this email or username already exists")
    }

    // console.log(req.files)
    // now take the localfile path from multer 
    const avatarLocalpath = req.files?.avatar[0]?.path

    // const profilePicLocalpath = req.files?.profilePic[0]?.path 
    // OR 
    let profilePicLocalpath
    if (req.files && Array.isArray(req.files.profilePic) && req.files.profilePic.length > 0) {
        profilePicLocalpath = req.files.profilePic[0].path
    }

    // check if avatar local path available
    if (!avatarLocalpath) {
        throw new ApiErrorHandler(400, "Avatar is Required")
    }

    // upload the avatar with the cloudinary uploader utility
    const avatar = await cloudinaryUploader(avatarLocalpath)
    if (!avatar) {
        throw new ApiErrorHandler(400, "Avatar is Required")
    }

    const profilePic = await cloudinaryUploader(profilePicLocalpath)

    // create user finally
    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatar.url,
        profilePic: profilePic?.url || ""
    })

    // removing password and refreshtoken from the created user response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiErrorHandler(500, "Something went wrong while Registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Created Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // DESTRUTURE THE REQ-BODY
    const { username, email, password } = req.body

    // CHECK EMAIL OR USERNAME EXISTS
    if (!(username || email)) {
        throw new ApiErrorHandler(409, "Username or email required")
    }

    // FIND USER WITH USERNAME OR EMAIL
    const user = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )

    // validate user exits  or not
    if (!user) {
        throw new ApiErrorHandler(404, "user with this email does not exsits")
    }

    // validate password
    const validatePassword = await User.isPasswordCorrect(password)

    // todo for login
    // ask user email & password
    // store acces token during register user and use that toekn to login
    // token varification
    // password and email verication with stired db data
    // return and redirect to profile page

})
export { registerUser }

// destructure user data from the forntend
// check if empty fields and various validation
// if user already registered
// check avatar file is already loaded in diskstorage 
//upload image to cloudinary and check.
// remove password and refresh token from response
// check user creation with object making
// return user creation succces response