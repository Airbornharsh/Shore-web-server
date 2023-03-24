import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = JSON.parse(req.body);
    // const body = req.body;

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const user1Data = await DbModels?.user.findById(AuthenticateDetail?._id);

    if (
      user1Data.isPrivate &&
      user1Data.requestingFollowers.includes(body.userId)
    ) {
      await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
        $pull: { requestingFollowers: body.userId },
        $push: {
          followers: body.userId,
          acceptedFollowerRequests: body.userId,
        },
      });

      await DbModels?.user.findByIdAndUpdate(body.userId, {
        $pull: { requestingFollowing: AuthenticateDetail?._id },
        $push: {
          followings: AuthenticateDetail?._id,
          acceptedFollowingRequests: AuthenticateDetail?._id,
        },
      });

      return res.send({ message: "Approved" });
    } else {
      if (!user1Data.requestingFollowers.includes(body.userId))
        return res.send({ message: "User Has not Requested" });
      return res.send({ message: "Account is Public" });
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
