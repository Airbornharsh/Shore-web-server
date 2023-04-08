// // import multer from "multer";
// // import { DbConnect2 } from "../../../Server/config/Db_Config";
// import uploadMiddle from "../../../Server/middlewares/upload";
// import upload from "../../../Server/middlewares/upload";

// const main = async (req: any, res: any, next: any) => {
//   try {

//     // const storage = new GridFsStorage({
//     //   url: process.env.DB_POST_URI1 as string,
//     //   options: { useNewUrlParser: true, useUnifiedTopology: true },
//     //   file: (req, file) => {
//     //     const match = ["image/png", "image/jpeg", "image/jpg"];

//     //     console.log("2");

//     //     const no = Math.floor(Math.random() * 10000000000);

//     //     if (match.indexOf(file.mimetype) === -1) {
//     //       const filename = `${Date.now()}-shore-${no}-${file.originalname}`;
//     //       return filename;
//     //     }

//     //     console.log(file);

//     //     return {
//     //       bucketName: "postfile",
//     //       filename: `${Date.now()}-shore-${no}-${file.originalname}`,
//     //     };
//     //   },
//     // });
//     //
//     // console.log("1");
//     //
//     // multer({ storage }).single("file");
//     // console.log("3");

//     // const data = upload.single("file")(req, res, next );

//     // console.log(data);

//     // upload.single("file");

//     console.log(req.file);
//     // console.log(req.files);

//     if (req.file === undefined) return res.send("you must select a file.");
//     const imgUrl = `http://localhost:3000/file/${req.file.filename}`;
//     return res.status(200).send({ imgUrl });
//   } catch (e) {
//     console.log(e);
//     res.status(500).send(e);
//   }
// };

// export default uploadMiddle(main);

const main = ()=>{

}

export default main;