import { DbConnect1 } from "../../../Server/config/Db_Config";
import Authenticate from "../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = JSON.parse(req.body);
    // const body = req.body;

    const DbModels = await DbConnect1();

    const page = body.page ? body.page : 1;
    const limit = body.limit ? body.limit : 10;

    const userDatas = await DbModels?.user
      .find({ userName: { $regex: body.userName } })
      .skip((page - 1) * limit)
      .limit(limit);

    const newUserDatas: {
      id: any;
      userName: any;
      name: any;
      imgUrl: any;
      joinedDate: any;
      emailId: any;
      phoneNumberFirebaseId: any;
      emailIdFirebaseId: any;
      phoneNumber: any;
      gender: any;
      socketIds: any;
      isPrivate: any;
      deviceTokens: any;
      posts: any;
      followers: any;
      followings: any;
    }[] = [];

    userDatas?.forEach((user) => {
      newUserDatas.push({
        id: user._id,
        userName: user.userName,
        name: user.name,
        imgUrl: user.imgUrl,
        joinedDate: user.joinedDate,
        emailId: user.emailId,
        phoneNumberFirebaseId: user.phoneNumberFirebaseId,
        emailIdFirebaseId: user.emailIdFirebaseId,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        socketIds: user.socketIds,
        isPrivate: user.isPrivate,
        deviceTokens: user.deviceTokens ? user.deviceTokens : [],
        posts: user.posts,
        followers: user.followers,
        followings: user.followings,
      });
    });

    res.send(newUserDatas);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
