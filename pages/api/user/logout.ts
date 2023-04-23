import { DbConnect1 } from "../../../Server/config/Db_Config";
import Authenticate from "../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;
    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    await DbModels?.user.findByIdAndUpdate(AuthenticateDetail._id, {
      $pull: { deviceTokens: body.deviceToken },
    });

    res.send({ message: "Logged Out" });
  } catch (e: any) {
    console.log(e);
    res.status(500).send({message: e.message});
  }
};

export default main;
