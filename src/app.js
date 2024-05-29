import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

// cross useage and setup
app.use(cors({ origin:process.env.CROS_ORIGIN, credentials: true}));

// JSON data config
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser())

// import routers here
import userRouter from "./routes/user.routes.js";


//routes decleration
app.use("/api/v1/users", userRouter) 
export {app}