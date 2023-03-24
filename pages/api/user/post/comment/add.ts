import { DbConnect1 } from "../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = JSON.parse(req.body);

    if (!(body.postId && body.description)) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

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
      postId: body.postId,
    });

    const commentData = await newComment.save();

    await DbModels?.post.findByIdAndUpdate(body.postId, {
      $push: { comments: commentData._id },
    });

    await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
      $push: { commented: commentData._id },
    });

    res.send(commentData);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
