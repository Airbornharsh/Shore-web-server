import { DbConnect1 } from "../../../Server/config/Db_Config";
import Authenticate from "../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = req.body;

    if (
      !(
        body.name ||
        body.imgUrl ||
        body.emailId ||
        body.gender ||
        body.userName ||
        body.phoneNumber
      )
    ) {
      return res.status(406).send({ message: "No Data Given" });
    }

    const DbModels = await DbConnect1();

    let tempUser = await DbModels?.user.findOne({
      userName: body.userName,
    });
    if (tempUser) {
      return res.status(400).send({ message: "UserName Exists!" });
    }
    tempUser = await DbModels?.user.findOne({
      emailId: body.emailId,
    });
    if (tempUser) {
      return res.status(400).send({ message: "Email Id Exists!" });
    }
    tempUser = await DbModels?.user.findOne({
      phoneNumber: body.phoneNumber,
    });
    if (tempUser) {
      return res.status(400).send({ message: "Phone Number Exists!" });
    }

    const AuthenticateDetail = await Authenticate(req, res);

      const userData = await DbModels?.user.findById(AuthenticateDetail?._id);
      
    await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
      name: body.name ? body.name : userData.name,
      imgUrl: body.imgUrl ? body.imgUrl : userData.imgUrl,
      gender: body.gender ? body.gender : userData.gender,
      emailId: body.emailId ? body.emailId : userData.emailId,
      userName: body.userName ? body.userName : userData.userName,
      phoneNumber: body.phoneNumber ? body.phoneNumber : userData.phoneNumber,
    });

    return res.send({ message: "Updated" });
  } catch (e: any) {
    res.status(500).send({message: e.message});
  }
};

export default main;
