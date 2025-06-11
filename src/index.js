import express from "express";
import cors from "cors";
import {connect}  from "./databases/mongo.js";
import {config} from "dotenv";
config()


async function main() {
     
    const hostName = "localhost";
    const PORT = 3000;
    let mongoConnectString = process.env.mongoConnectString

    console.log(mongoConnectString)
    const mongoConnect = await connect(mongoConnectString, process.env.mongoDbName)
   console.log(mongoConnect)
   
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.get("/", (req, res)=>{
        res
            .send(
                {
                    success: true,
                    statusCode: 200,
                    body: "Welcome to MyGastronomy"
                }
            )
    })

    app.listen(PORT, hostName, ()=>{
        console.log(`Server running on: http://${hostName}:${PORT}`)
    })

   
} 



main()