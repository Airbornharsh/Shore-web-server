import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    // const body = JSON.parse(req.body);
    const body = req.body;

    if (!body.userId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const user1Data = (await DbModels?.user.findById(body.userId)) || [];

    const user2Data =
      (await DbModels?.user.findById(AuthenticateDetail?._id)) || [];

    if (
      user2Data.followings.includes(body.userId) &&
      user1Data.followers.includes(AuthenticateDetail?._id)
    ) {
      return res.send({ message: "Already Followed" });
    } else {
      if (user1Data.isPrivate) {
        if (
          user1Data.acceptedFollowerRequests.includes(body.userId) ||
          user1Data.declinedFollowerRequests.includes(body.userId)
        ) {
          await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
            $pull: {
              acceptedFollowerRequests: body.userId,
              declinedFollowerRequests: body.userId,
            },
          });

          if (!user2Data.requestingFollowing.includes(body.userId)) {
            await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
              $push: { requestingFollowers: body.userId },
            });
          }
        } else {
          if (!user2Data.requestingFollowing.includes(body.userId)) {
            await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
              $push: { requestingFollowers: body.userId },
            });
          }
        }

        if (
          user2Data.acceptedFollowingRequests.includes(
            AuthenticateDetail?._Id
          ) ||
          user2Data.declinedFollowingRequests.includes(AuthenticateDetail?._id)
        ) {
          await DbModels?.user.findByIdAndUpdate(body.userId, {
            $pull: {
              acceptedFollowerRequests: AuthenticateDetail?._id,
              declinedFollowerRequests: AuthenticateDetail?._id,
            },
          });

          if (
            !user1Data.requestingFollowing.includes(AuthenticateDetail?._id)
          ) {
            await DbModels?.user.findByIdAndUpdate(body.userId, {
              $push: { requestingFollowing: AuthenticateDetail?._id },
            });
          }
        } else {
          if (
            !user1Data.requestingFollowing.includes(AuthenticateDetail?._id)
          ) {
            await DbModels?.user.findByIdAndUpdate(body.userId, {
              $push: { requestingFollowing: AuthenticateDetail?._id },
            });
          }
        }
        return res.send({ message: "Follow Requested" });
      } else {
        await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
          $push: { followings: body.userId },
        });

        await DbModels?.user.findByIdAndUpdate(body.userId, {
          $push: { followers: AuthenticateDetail?._id },
        });

        return res.send({ message: "Followed" });
      }
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
