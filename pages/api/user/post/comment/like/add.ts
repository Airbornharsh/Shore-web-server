import { DbConnect1 } from "../../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    if (!req.body.commentId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const commentData =
      (await DbModels?.comment.findById(req.body.commentId)) || [];

    if (commentData.likes.includes(AuthenticateDetail?._id)) {
      return res.send({ message: "Already Liked" });
    } else {
      await DbModels?.comment.findByIdAndUpdate(req.body.commentId, {
        $push: { likes: AuthenticateDetail?._id },
      });

      await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
        $push: { commentLiked: req.body.commentId },
      });

      return res.send({ message: "Liked" });
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
