import { DbConnect1 } from "../../../Server/config/Db_Config";
import Authenticate from "../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const userData = await DbModels?.user.findById(AuthenticateDetail?._id);

    if (!userData) {
      return res.status(400).send({ isValid: false, user: null });
    }

    res.send({ isValid: true, user: userData });
  } catch (e: any) {
    res.status(500).send({ message: e.message, isValid: false, user: null });
  }
};

export default main;
