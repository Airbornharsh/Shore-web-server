import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const user1Data =
      (await DbModels?.user.findById(AuthenticateDetail?._id)) || [];

    if (user1Data.isPrivate) {
      return res.send({ message: "Already Private" });
    } else {
      await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
        isPrivate: true,
      });

      return res.send({ message: "Set as Private" });
    }
  } catch (e: any) {
  return res.status(500).send({message: e.message});
  }
};

export default main;
