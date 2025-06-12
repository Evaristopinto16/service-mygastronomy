  import {MongoClient} from "mongodb";


  export const Mongo = {

     async  connect({mongoConnectString,mongoDbName}) {
     
    try {
        const client = new  MongoClient(mongoConnectString);
        
        await client.connect();
        const db =   client.db(mongoDbName);

        this.client = client;
        this.db = db
        return "Connected to Mongodb";
    } catch (error) {
        
        console.log("error During mongo Connection", error)
    }
    
 
  }

  }
 

 