import dotenv from "dotenv"
import ConnectDb from "./db/index.js";

dotenv.config({
    path: "./env"
})

ConnectDb();