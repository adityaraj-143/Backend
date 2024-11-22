import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectDb = async () => {
    try {
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("\nMongoDB connected !! DB Host: ",ConnectionInstance.connection.host)
    } catch (error) {
        console.error("MongoDB connection Failed: ",error);
        process.exit(1); 
    }
}

export default ConnectDb;