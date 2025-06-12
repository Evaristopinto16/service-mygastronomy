import express from "express";
import jwt from "jsonwebtoken";
import passaprt from "passport"
import LocalStrategy from "passport-local";
import crypto from "crypto";
import { Mongo } from   "../databases/mongo.js"
import {ObjectId} from "mongodb";

const collectionName = "users";
/*
Parte de controle do Usuario e da DeteCriptogracao

*/
passaprt.use(new LocalStrategy( { usernameField: "email" },async(email, password, callback)=>{
    
    const user = await Mongo.db
    .collection(collectionName)
    .findOne(
        {email: email}
    )

    if(!user){
        return callback(null, false)
    }
    const saltBuffer = user.salt.buffer;

    crypto.pbkdf2(password, saltBuffer, 310000, 16,"sha256", (err, hashedPassword)=>{
        if(err){
            return callback(null, false)
        }

        const userPasswordBuffer = Buffer.from(user.password.buffer)
        if(!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword))
        {
            return callback(null, false)
        }

        const {password, salt, ...rest} = user;

        return callback(null, rest)
   
    })


}
))


const authRouter = express.Router();

authRouter.post("/signup", async (req, res)=>{
    const ckeckUser = await Mongo.db
    .collection(collectionName)
    .findOne({email: req.body.email});

    if(ckeckUser)
    {
        return res.status(500)
        .send(
            {
                success: false,
                statusCode: 500,
                body: {
                    text: "User already exists"
                }
            }
        )
    }

    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(req.body.password, salt, 310000, 16, "sha256", async (err, hashedPassword)=>{
        if(err){
            return res.status(500)
        .send(
            {
                success: false,
                statusCode: 500,
                body: {
                    text: "User on crypto password",
                    text: err
                }
            })
        }
        const resut = await Mongo.db
                    .collection(collectionName)
                    .insertOne(
                        {
                            email: req.body.email,
                            password: hashedPassword,
                            salt
                        }
                    )

                    if(resut.insertedId)
                    {
                        const user = await Mongo.db
                                    .collection(collectionName)
                                    .findOne({_id: new ObjectId(resut.insertedId)})
                        const token = jwt.sign(user, "secret")
                        

                        return res.send(
                            {
                                success: true,
                                statusCode: 200,
                                body: {
                                    text: "User registered correctly",
                                    token,
                                    user,
                                    logged: true
                                }
                            }
                        )
                        
                    }
    })
})

authRouter.post("/login", (req, res)=>{
    
    passaprt.authenticate('local', (error, user)=>{
        if(error){
            return res.status(500).
            send(
                {
                    success: false,
                    statusCode: 500,
                    body: {
                        text: "Error during authentication",
                        error
                    }
                }

            )
        }
          if(!user){
            return res.status(400).
            send(
                {
                    success: false,
                    statusCode: 400,
                    body: {
                        text: "user not Found",
                        error
                    }
                }

            )
        }

        const token = jwt.sign(user, 'secret');
        return res.status(200).
            send(
                {
                    success: true,
                    statusCode: 200,
                    body: {
                        text: "User logged in correctly",
                        user,
                        token
                    }
                }

            )
    })(req, res)
})


export default authRouter