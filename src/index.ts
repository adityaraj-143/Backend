import "dotenv/config"
import ConnectDb from "./db/index.js";
import {app} from "./app.js"

ConnectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port: ${process.env.PORT}`);
    }); 
  })
  .catch((err) => {
    console.log("MONGODB Connection failed !!! ", err);
  });
