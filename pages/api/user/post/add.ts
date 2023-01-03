import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    if (!(req.body.description || req.body.url)) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const newPost = new DbModels!.post({
      userId: AuthenticateDetail?._id,
      description: req.body.description,
      url: req.body.url,
    });

    const postData = await newPost.save();

    await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
      $push: { posts: postData._id },
    });

    res.send(postData);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
