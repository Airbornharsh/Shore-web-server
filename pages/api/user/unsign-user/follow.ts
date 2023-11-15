import { DbConnect1 } from "../../../../Server/config/Db_Config";
import { setFirebase } from "../../../../Server/config/Firebase_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;
    // const body = req.body;

    if (!body.userId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();
    const FCM = await setFirebase();
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

        await sendNotification(user1Data, user2Data, FCM);

        return res.send({ message: "Followed" });
      }
    }
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};

const sendNotification = async (user1: any, user2: any, FCM: any) => {
  const tempDeviceTokens = user1.deviceTokens;

  const message = {
    // to: token,
    // token,
    notification: {
      title: "Followed",
      body: `${user2.userName} followed you`,
    },
    // data: {
    //   senderUserId: AuthenticateDetail._id.toString(),
    //   time: body.currentTime.toString(),
    //   message: body.message.toString(),
    //   type: body.type ? body.type.trim() : "text",
    // },
  };

  FCM.sendToMultipleToken(
    message,
    tempDeviceTokens,
    (err: any, response: any) => {
      if (err) {
        console.log("Something has gone wrong!", err);
        console.log("Step 10");
      } else {
        console.log("Successfully sent with response: ", response);
        console.log("Step 11");
      }
    }
  );
};

export default main;
