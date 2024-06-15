import { User } from "../models/user.models.js";
import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cloudinaryUploader } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessToeknAndRefreshToken = async (UserId) => {

    try {
        const user = await User.findById(UserId)

        const accessToken = user.generateAccessToken()

        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiErrorHandler(500, "Somethig went wrong while generating tokens")
    }
}
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
    console.log("avatar path", avatarLocalpath)
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
});

const loginUser = asyncHandler(async (req, res) => {
    // DESTRUTURE THE REQ-BODY
    const { username, email, password } = req.body
    //.. Validata
    if (!username && !email) {
        throw new ApiErrorHandler(400, "Username or email required")
    }

    // FIND USER WITH USERNAME OR EMAIL
    const user = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )
    //.. validate user exits  or not
    if (!user) {
        throw new ApiErrorHandler(404, "user with this email does not exsits")
    }

    // Find and validate password
    const validatedPassword = await user.isPasswordCorrect(password)

    if (!validatedPassword) {
        throw new ApiErrorHandler(401, "Invalid Credentials")
    }

    // store acess and refresh token
    const { accessToken, refreshToken } = await
        generateAccessToeknAndRefreshToken(user._id)

    const loggedInuser = await User.findById(user._id) // object can also be updated
        .select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: accessToken, loggedInuser, refreshToken
                },
                "User Login Successfully"
            )
        )
    // todo for login
    // ask user email & password
    // store acces token during register user and use that toekn to login
    // token varification
    // password and email verication with stired db data
    // return and redirect to profile page

});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User loggedOut")
        )
});

const refreshAcesstoken = asyncHandler(async (req, res) => {

    const incomingToken = req.cookie.refreshToken || req.body.refreshToken

    if (!incomingToken) {
        throw new ApiErrorHandler(401, "Unauthrized Access")
    }

    try {
        const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id)

        if (!user) {
            throw new ApiErrorHandler(401, "Unauthorized Access")
        }

        if (incomingToken !== user?.refreshToken) {
            throw new ApiErrorHandler(401, "Invalid AccessToken or token lost")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newrefreshToken } = generateAccessToeknAndRefreshToken(user._id)

        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, refreshToken: newrefreshToken },
                "refreshToken Refreshed")
            )
    } catch (error) {
        throw new ApiErrorHandler(401, error?.message, "unauthorized Access")
    }
});

const changePasssword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordcorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordcorrect) {
        throw new ApiErrorHandler(401, "Incorrect Old Password")
    }

    user.password = newPassword

    await user.save({ validateBeforeSave: false })
    return res
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            200,
            req.user,
            "Curent User Fetched Sucessfully"
        )
});

const updateUser = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiErrorHandler(400, "All Fields are mandatory")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User Updated Successfully"
            )
        )
});

const updateAvatar = asyncHandler(async (req, res) => {
    const localAvatarFilepath = req.file?.path

    if (!localAvatarFilepath) {
        throw new ApiErrorHandler(400, "File is Required to Update Avatar")
    }

    const avatar = await cloudinaryUploader(localAvatarFilepath)

    if (!avatar) {
        throw new ApiErrorHandler(400, "Error while uploading Avatar")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: avatar.url } },
        { new: true })
        .select("-password")

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Avatar Updated Successfully"
            )
        )
});

const updateCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalpath = req.file?.path 

    if(!coverImageLocalpath){
        throw new ApiErrorHandler(400, "File is Required to Update Cover Image")
    }

    const coverImage = await cloudinaryUploader(coverImageLocalpath)

    if(!coverImage){
        throw new ApiErrorHandler(400, "Error while uploading Cover Image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        {coverImage: coverImage.url}, 
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Cover Image Updated Successfully"
        )
    )
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAcesstoken,
    changePasssword,
    getCurrentUser,
    updateUser,
    updateAvatar,
    updateCoverImage
}

// destructure user data from the forntend
// check if empty fields and various validation
// if user already registered
// check avatar file is already loaded in diskstorage 
//upload image to cloudinary and check.
// remove password and refresh token from response
// check user creation with object making
// return user creation succces response