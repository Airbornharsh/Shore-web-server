import { ObjectId } from "mongodb";
import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;
    // const body = req.body;
      
    const DbModels = await DbConnect1();

    const userData = await DbModels?.user.findById(body.userId);

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
