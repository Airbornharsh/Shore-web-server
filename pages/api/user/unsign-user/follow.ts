import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = JSON.parse(req.body);
    // const body = req.body;

    if (!body.userId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const user1Data = (await DbModels?.user.findById(body.userId)) || [];

    const user2Data =
      (await DbModels?.user.findById(AuthenticateDetail?._id)) || [];

    if (
      user2Data.followings.includes(user1Data._id) &&
      user1Data.followers.includes(user2Data._id)
    ) {
      return res.send({ message: "Already Followed" });
    } else {
      if (user1Data.isPrivate) {
        if (
          user1Data.acceptedFollowerRequests.includes(user1Data._id) ||
          user1Data.declinedFollowerRequests.includes(user1Data._id)
        ) {
          await DbModels?.user.findByIdAndUpdate(user2Data._id, {
            $pull: {
              acceptedFollowingRequests: user1Data._id,
              declinedFollowingRequests: user1Data._id,
            },
          });
        }

        if (!user2Data.requestingFollowing.includes(user1Data._id)) {
          await DbModels?.user.findByIdAndUpdate(user2Data._id, {
            $addToSet: { requestingFollowing: user1Data._id },
          });
        }

        if (
          user2Data.acceptedFollowingRequests.includes(user2Data._id) ||
          user2Data.declinedFollowingRequests.includes(user2Data._id)
        ) {
          await DbModels?.user.findByIdAndUpdate(user1Data._id, {
            $pull: {
              acceptedFollowerRequests: user2Data._id,
              declinedFollowerRequests: user2Data._id,
            },
          });
        }

        if (!user1Data.requestingFollowing.includes(user2Data._id)) {
          await DbModels?.user.findByIdAndUpdate(user1Data._id, {
            $addToSet: { requestingFollowers: user2Data._id },
          });
        }

        return res.send({ message: "Requested" });
      } else {
        await DbModels?.user.findByIdAndUpdate(user2Data._id, {
          $addToSet: { followings: user1Data._id },
        });

        await DbModels?.user.findByIdAndUpdate(user1Data._id, {
          $addToSet: { followers: user2Data._id },
        });

        return res.send({ message: "Followed" });
      }
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
