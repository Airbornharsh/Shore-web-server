import { DbConnect1 } from "../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    if (!req.body.postId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const postData = (await DbModels?.post.findById(req.body.postId)) || [];

    const userData =
      (await DbModels?.user.findById(AuthenticateDetail?._id)) || [];

    if (
      postData.likes.includes(AuthenticateDetail?._id) ||
      userData.postLiked.includes(req.body.postId)
    ) {
      await DbModels?.post.findByIdAndUpdate(req.body.poSstId, {
        $pull: { likes: AuthenticateDetail?._id },
      });

      await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
        $pull: { postLiked: req.body.postId },
      });

      return res.send({ message: "UnLiked" });
    } else {
      return res.send({ message: "Already UnLiked" });
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
