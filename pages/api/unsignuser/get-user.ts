import { DbConnect1 } from "../../../Server/config/Db_Config";
import Authenticate from "../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;
    // const body = req.body;

    if (!body.userId) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    const userData = await DbModels?.user.findById(body.userId);

    const newUserData = {
      id: userData._id,
      userName: userData.userName,
      name: userData.name,
      imgUrl: userData.imgUrl,
      joinedDate: userData.joinedDate,
      phoneNumber: userData.phoneNumber,
      gender: userData.gender,
      isPrivate: userData.isPrivate,
      posts: userData.posts,
      followers: userData.followers,
      followings: userData.followings,
    };

  return res.send(newUserData);
  } catch (e: any) {
  return res.status(500).send({message: e.message});
  }
};

export default main;
