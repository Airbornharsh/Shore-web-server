import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = JSON.parse(req.body);

    if (!body.postId) {
      return res.status(406).send({ message: "No Post Id" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const postData = await DbModels?.post.findById(body.postId);

    if (
      AuthenticateDetail?._id.toString().trim() ===
      postData.userId.toString().trim()
    ) {
      await DbModels?.post.findByIdAndDelete(body.postId);

      await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
        $pull: { posts: body.postId },
      });

      return res.send({ message: "Deleted" });
    } else {
      return res.status(402).send({ message: "Not Authorized" });
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
