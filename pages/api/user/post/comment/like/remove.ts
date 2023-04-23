import { DbConnect1 } from "../../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;

    if (!body.commentId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const commentData =
      (await DbModels?.comment.findById(body.commentId)) || [];

    if (commentData.likes.includes(AuthenticateDetail?._id)) {
      await DbModels?.comment.findByIdAndUpdate(body.commentId, {
        $pull: { likes: AuthenticateDetail?._id },
      });

      await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
        $pull: { commentLiked: body.commentId },
      });

      return res.send({ message: "UnLiked" });
    } else {
      return res.send({ message: "Already UnLiked" });
    }
  } catch (e: any) {
    res.status(500).send({message: e.message});
  }
};

export default main;
