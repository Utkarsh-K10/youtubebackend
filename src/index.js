import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: './env'
})

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("mongoDB Connection failed...", error)
            throw error
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`app is running.. on the PORT ${process.env.PORT}`)
        })

    })
    .catch((error) => {
        console.log("MongoDB Error: Connection falid!!", error)
    })






















    
/*
const app = express();

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error)=>{
            console.log("Error: ",error)
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is runnig on ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR:", error);
        throw error;
    }
})();
*/
