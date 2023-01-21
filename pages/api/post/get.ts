import { ObjectId } from "mongodb";
import { DbConnect1 } from "../../../Server/config/Db_Config";
import Authenticate from "../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const DbModels = await DbConnect1();

    const postData = await DbModels?.post.find({});

    res.send(postData);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
