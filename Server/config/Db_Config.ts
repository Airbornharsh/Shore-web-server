import mongoose, { mongo } from "mongoose";
import user from "../models/user";
import post from "../models/post";
import comment from "../models/comment";
import Grid from "gridfs-stream";

const Db_Uri = process.env.DB_URI1;
const Db_Post_Uri1 = process.env.DB_POST_URI1;

// let gfs: any;
// let bucket: any;

export const DbConnect1 = async () => {
  try {
    const connect = await mongoose.connect(Db_Uri as string);
    console.log("Db Connected");
    return {
      connect,
      user,
      post,
      comment,
    };
  } catch (e) {
    console.log(e);
  }
};

// export const DbConnect2 = async () => {
//   const connectionParams = {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//   };
//   try {
//     await mongoose.connect(Db_Post_Uri1 as string);
//     console.log("Connected to Database");
//     const conn = mongoose.connection;

//     // conn.on("connected", () => {
//     //   const db = mongoose.connections[0].db;
//     //   bucket = new mongoose.mongo.GridFSBucket(db, {
//     //     bucketName: "postfile",
//     //   });
//     // });
 
//     conn.once("open", () => {
//       console.log("Start");
//       gfs = Grid(conn.db, mongo);
//       gfs.collection("postfile");
//     });
//   } catch (e) {
//     console.log(e);
//   }
// };
