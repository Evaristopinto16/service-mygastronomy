  import {MongoClient} from "mongodb";

  export async function  connect(mongoConnectString,mongoDbName) {
     
    try {
        const client = new  MongoClient(mongoConnectString);
        await client.connect();
        const db =   client.db(mongoDbName);
 
        return "Connected to Mongodb";
    } catch (error) {
        
        console.log("error During mongo Connection", error)
    }
    
 
  }

 