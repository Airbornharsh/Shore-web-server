import { DbConnect1 } from "../../../../../Server/config/Db_Config";
import { setFirebase } from "../../../../../Server/config/Firebase_Config";
import Authenticate from "../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;

    if (!body.postId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();
    const FCM = await setFirebase();
    const AuthenticateDetail = await Authenticate(req, res);

    const postData = (await DbModels?.post.findById(body.postId)) || [];

    const user1Data = (await DbModels?.user.findById(postData.userId)) || [];

    const user2Data =
      (await DbModels?.user.findById(AuthenticateDetail?._id)) || [];

    if (
      postData.likes.includes(AuthenticateDetail?._id) ||
      user2Data.postLiked.includes(body.postId)
    ) {
      return res.send({ message: "Already Liked" });
    } else {
      await DbModels?.post.findByIdAndUpdate(body.postId, {
        $addToSet: { likes: AuthenticateDetail?._id },
      });

      await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
        $addToSet: { postLiked: body.postId },
      });

      const tempDeviceTokens = user1Data.deviceTokens;

      const message = {
        // to: token,
        // token,
        notification: {
          title: "Liked",
          body: `@${user2Data.userName.toString()} Liked your post`,
          image: postData.url ? postData.url : "",
        },
        // android: {
        //   notification: {
        //     imageUrl: "https://i.stack.imgur.com/ILTQq.png",
        //   },
        // },
        // apns: {
        //   payload: {
        //     aps: {
        //       "mutable-content": 1,
        //     },
        //   },
        //   fcm_options: {
        //     image: "https://i.stack.imgur.com/ILTQq.png",
        //   },
        // },
        // webpush: {
        //   headers: {
        //     image: "https://i.stack.imgur.com/ILTQq.png",
        //   },
        // },
        data: {
          postId: body.postId.toString(),
          time: Date.now().toString(),
          for: "like",
        },
      };

      await FCM.messaging().sendToDevice(tempDeviceTokens, message);

      return res.send({ message: "Liked" });
    }
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};

export default main;
