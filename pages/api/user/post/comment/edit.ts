import { ObjectId } from "mongodb";
import { DbConnect1 } from "../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;

    if (!(body.postId && body.commentId && body.description)) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const commentData = await DbModels?.comment.findById(body.commentId);

    if (
      commentData.commented.toString().trim() === AuthenticateDetail?._id.trim()
    ) {
      await DbModels?.comment.findByIdAndUpdate(commentData._id, {
        description: body.description,
      });
    } else {
      return res.status(402).send({ message: "Not Authorized" });
    }

  return res.send({ message: "Updated" });
  } catch (e: any) {
  return res.status(500).send({message: e.message});
  }
};

export default main;
