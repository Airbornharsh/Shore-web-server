import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const user1Data =
      (await DbModels?.user.findById(AuthenticateDetail?._id)) || [];

    if (user1Data.isPrivate) {
      const requestIds = user1Data.requestingFollowers;

      await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
        $addToSet: { followers: requestIds },
        $pull: { requestingFollowers: requestIds },
        isPrivate: false,
      });

      await requestIds.forEach(async (userId: any) => {
        await DbModels?.user.findByIdAndUpdate(userId, {
          $addToSet: { followings: AuthenticateDetail?._id },
          $pull: { requestingFollowing: AuthenticateDetail?._id },
        });
      });

      return res.send({ message: "Set as Public" });
    } else {
      return res.send({ message: "Already Public" });
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
