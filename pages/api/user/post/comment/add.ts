import { DbConnect1 } from "../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    if (!(req.body.postId && req.body.description)) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    let toUserId;

    if (req.body.to) {
      toUserId = req.body.to;
    } else {
      toUserId = (await DbModels?.post.findById(req.body.postId))?.userId;
    }
    
    const newComment = new DbModels!.comment({
      commented: AuthenticateDetail?._id,
      description: req.body.description,
      to: toUserId,
      postId: req.body.postId,
    });
    
    const commentData = await newComment.save();

    await DbModels?.post.findByIdAndUpdate(req.body.postId, {
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
