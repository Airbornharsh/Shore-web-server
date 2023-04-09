import { DbConnect1 } from "../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = JSON.parse(req.body);

    if (!body.postId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const postData = (await DbModels?.post.findById(body.postId)) || [];

    const userData =
      (await DbModels?.user.findById(AuthenticateDetail?._id)) || [];

    if (
      postData.likes.includes(AuthenticateDetail?._id) ||
      userData.postLiked.includes(body.postId)
    ) {
      return res.send({ message: "Already Liked" });
    } else {
      await DbModels?.post.findByIdAndUpdate(body.postId, {
        $addToSet: { likes: AuthenticateDetail?._id },
      });

      await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
        $addToSet: { postLiked: body.postId },
      });

      return res.send({ message: "Liked" });
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
