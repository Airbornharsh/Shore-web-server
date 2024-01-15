import { DbConnect1 } from "../../../../Server/config/Db_Config";
import { setFirebase } from "../../../../Server/config/Firebase_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;

    if (!body.userId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();
    const FCM = await setFirebase();
    const AuthenticateDetail = await Authenticate(req, res);

    const user1Data =
      (await DbModels?.user.findById(AuthenticateDetail?._id)) || [];

    const user2Data = (await DbModels?.user.findById(body.userId)) || [];

    if (
      user1Data.followings.includes(body.userId) &&
      user2Data.followers.includes(AuthenticateDetail?._id)
    ) {
      await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
        $pull: { followings: body.userId },
      });

      await DbModels?.user.findByIdAndUpdate(body.userId, {
          $pull: { followers: AuthenticateDetail?._id },
      });

      // const tempDeviceTokens = user2Data.deviceTokens;

      // const message = {
      //   // to: token,
      //   // token,
      //   notification: {
      //     title: "UnFollowed",
      //     body: `@${user1Data.userName.toString()} unfollowed you`,
      //     image: user1Data.imgUrl ? user1Data.imgUrl : "",
      //   },
      //   data: {
      //     userId: user1Data._id.toString(),
      //     time: Date.now().toString(),
      //     for: "follow"
      //   },
      // };

      // await FCM.messaging().sendToDevice(
      //   tempDeviceTokens,
      //   message
      // );


      return res.send({ message: "Unfollowed" });
    } else {
      return res.send({ message: "Already Unfollowed" });
    }
  } catch (e: any) {
  return res.status(500).send({message: e.message});
  }
};

export default main;
