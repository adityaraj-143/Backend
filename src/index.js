import dotenv from "dotenv";
import ConnectDb from "./db/index.js";

dotenv.config({
  path: "./env",
});

ConnectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port: ${process.env.PORT}`);
    }); 
  })
  .catch((err) => {
    console.log("MONGODB Connection failed !!! ", err);
  });
