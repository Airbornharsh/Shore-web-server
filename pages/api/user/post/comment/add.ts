import { DbConnect1 } from "../../../../../Server/config/Db_Config";
import { setFirebase } from "../../../../../Server/config/Firebase_Config";
import Authenticate from "../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;

    if (!(body.postId && body.description)) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();
    const FCM = await setFirebase();
    const AuthenticateDetail = await Authenticate(req, res);

    let toUserId;

    if (body.to) {
      toUserId = body.to;
    } else {
      toUserId = (await DbModels?.post.findById(body.postId))?.userId;
    }

    const newComment = new DbModels!.comment({
      commented: AuthenticateDetail?._id,
      description: body.description,
      to: toUserId,
      reply: body.reply ? body.reply : null,
      postId: body.postId,
      time: Date.now(),
    });

    const commentData = await newComment.save();

    const user1Data = await DbModels?.user.findById(toUserId);

    const user2Data = await DbModels?.user.findById(AuthenticateDetail?._id);

    await DbModels?.post.findByIdAndUpdate(body.postId, {
      $addToSet: { comments: commentData._id },
    });

    await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
      $addToSet: { commented: commentData._id },
    });

    const tempDeviceTokens = user1Data.deviceTokens;

    const message = {
      // to: token,
      // token,
      notification: {
        title: "Commented",
        body: `@${user2Data.userName.toString()} Commented "${
          body.description
        }"`,
      },
      data: {
        postId: body.postId.toString(),
        time: Date.now().toString(),
        for: "post",
      },
    };

    await FCM.messaging().sendToDevice(tempDeviceTokens, message);

    return res.send(commentData);
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};

export default main;
