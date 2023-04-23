import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;

    if (!body.userId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const userData =
      (await DbModels?.user.findById(AuthenticateDetail?._id)) || [];

    if (userData.closeFriends.includes(body.postId)) {
      await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
        $pull: { closeFriends: body.userId },
      });

      return res.send({ message: "Removed" });
    } else {
      return res.send({ message: "Already Removed" });
    }
  } catch (e: any) {
    res.status(500).send({message: e.message});
  }
};

export default main;
