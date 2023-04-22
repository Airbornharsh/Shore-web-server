import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;

    if (!(body.description || body.url)) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const postData = await DbModels?.post.findById(body.postId);

    if (
      AuthenticateDetail?._id.toString().trim() ===
      postData.userId.toString().trim()
    ) {
      await DbModels?.post.findByIdAndUpdate(body.postId, {
        description: body.description
          ? body.description
          : postData.description,
        url: body.url ? body.url : postData.url,
      });

      return res.send({ message: "Updated" });
    } else {
      return res.status(402).send({ message: "Not Authorized" });
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
