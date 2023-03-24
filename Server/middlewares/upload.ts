import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
// import { DbConnect2 } from "../config/Db_Config";

const uploadMiddle = (handler: any) => {
  console.log("call");
  return async (req: any, res: any, next: any) => {
    console.log("1");
    // await DbConnect2();

    const storage = new GridFsStorage({
      url: process.env.DB_POST_URI1 as string,
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"];

        // console.log("2");

        const no = Math.floor(Math.random() * 10000000000);

        if (match.indexOf(file.mimetype) === -1) {
          const filename = `${Date.now()}-shore-${no}-${file.originalname}`;
          return filename;
        }

        return {
          bucketName: "postfile",
          filename: `${Date.now()}-shore-${no}-${file.originalname}`,
        };
      },
    });

    await multer({ storage: storage }).single("file")(req, res, () => {
      console.log(req.file);
    });

    console.log("3");

    return handler(req, res);
  };
};

export default uploadMiddle;
