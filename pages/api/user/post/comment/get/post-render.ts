import { ObjectId } from "mongodb";
import { DbConnect1 } from "../../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;

    if (!body.postId) {
      return res.status(406).send({ message: "Post Id Missing" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const commentDatas = await DbModels?.comment.find({
      postId: body.postId,
    });

    const userIds = commentDatas?.map((com) => com.commented);

    const userDatas = await DbModels?.user
      .find({
        _id: userIds,
      })
      .select("_id userName name imgUrl");

    return res.send(await userCommentData(commentDatas ?? [], userDatas ?? []));
  } catch (e: any) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};

const userCommentData = async (
  commentDatas: Array<any>,
  userDatas: Array<any>
) => {
  const datas: {
    _id: any;
    commented: any;
    description: any;
    to: any;
    reply: any;
    postId: any;
    likes: any;
    time: any;
    name: any;
    userName: any;
    imgUrl: any;
  }[] = [];

  await commentDatas.forEach(async (commentData) => {
    const user = userDatas.find(
      (userData) =>
        userData["_id"].toString() == commentData["commented"].toString()
    );

    await datas.push({
      _id: commentData["_id"],
      commented: commentData["commented"],
      description: commentData["description"],
      to: commentData["to"],
      reply: commentData["reply"],
      postId: commentData["postId"],
      likes: commentData["likes"],
      time: commentData["time"],
      name: user["name"],
      userName: user["userName"],
      imgUrl: user["imgUrl"],
    });
  });
  return datas;
};

export default main;
