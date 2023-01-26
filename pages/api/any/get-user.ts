import { DbConnect1 } from "../../../Server/config/Db_Config";
import Authenticate from "../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = JSON.parse(req.body);

    const DbModels = await DbConnect1();

    const page = body.page ? body.page : 1;
    const limit = body.limit ? body.limit : 10;

    const userDatas = await DbModels?.user
      .find({ userName: { $regex: body.userName } })
      .limit(limit)
      .skip((page - 1) * limit);

    res.send(userDatas);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
