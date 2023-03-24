import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const userData = await DbModels?.user.findById(AuthenticateDetail?._id);

    const userDatas = await DbModels?.user
      .find({
        _id: userData.followers,
      })
      .sort({ $natural: -1 });

    const newUserDatas: {
      id: any;
      userName: any;
      name: any;
      imgUrl: any;
      joinedDate: any;
      phoneNumber: any;
      gender: any;
      isPrivate: any;
      posts: any;
      followers: any;
      followings: any;
    }[] = [];

    userDatas?.map((user) => {
      newUserDatas.push({
        id: user._id,
        userName: user.userName,
        name: user.name,
        imgUrl: user.imgUrl,
        joinedDate: user.joinedDate,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        posts: user.posts,
        isPrivate: user.isPrivate,
        followers: user.followers,
        followings: user.followings,
      });
    });

    return res.send(newUserDatas);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export default main;
