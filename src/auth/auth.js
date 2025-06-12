import express from "express";
import jwt from "jsonwebtoken";
import passaprt from "passport"
import LocalStrategy from "passport-local";
import crypto from "crypto";
import { Mongo } from "../databases/mongo"; "../databases/mongo.js"
import {ObjectId} from "mongodb";

const collectionName = "users";

passaprt.use(new LocalStrategy( { usernameField: "email" },async(ElementInternals, password, callback)=>{
    
}
))
