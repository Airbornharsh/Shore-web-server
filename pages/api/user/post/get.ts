import { ObjectId } from "mongodb";
import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const userData = await DbModels?.user.findById(AuthenticateDetail?._id);

    const postIds = userData?.posts;

    if (postIds) {
      var postObjectIds = postIds.map((id: any) => new ObjectId(id));

      const postData = await DbModels?.post
        .find({
          _id: postObjectIds,
        })
        .sort({ $natural: -1 });
      
    return res.send(postData);
    } else {
    return res.send([]);
    }
  } catch (e: any) {
  return res.status(500).send({message: e.message});
  }
};

export default main;
