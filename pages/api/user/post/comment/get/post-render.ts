import { ObjectId } from "mongodb";
import { DbConnect1 } from "../../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;

    if (!body.postId) {
      return res.status(406).send({ message: "Post Id Missing" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const commentData = await DbModels?.comment.find({
      postId: body.postId,
    });

    return commentData;
  } catch (e: any) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};

export default main;
