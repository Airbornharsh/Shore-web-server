import { ObjectId } from "mongodb";
import { DbConnect1 } from "../../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = JSON.parse(req.body);

    if (!body.postId) {
      return res.status(406).send({ message: "Post Id Missing" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const postData = await DbModels?.post.findById(body.postId);

    const commentIds = postData?.comments;

    if (commentIds) {
      var commentObjectIds = commentIds.map((id: any) => new ObjectId(id));

      const commentData = await DbModels?.comment.find({
        _id: commentObjectIds,
      });

      res.send(commentData);
    } else {
      res.send([]);
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
