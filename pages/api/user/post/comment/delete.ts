import { ObjectId } from "mongodb";
import { DbConnect1 } from "../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;

    if (!body.commentId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const commentData = await DbModels?.comment.findById(body.commentId);

    if (
      commentData.commented.toString().trim() === AuthenticateDetail?._id.trim()
    ) {
      await DbModels?.comment.findByIdAndDelete(commentData._id);

      await DbModels?.post.findByIdAndUpdate(commentData.postId, {
        $pull: { comments: commentData._id },
      });

      await DbModels?.user.findByIdAndUpdate(commentData.commented, {
        $pull: { commented: commentData._id },
      });
    } else {
      return res.status(402).send({ message: "Not Authorized" });
    }

    res.send({ message: "Updated" });
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
