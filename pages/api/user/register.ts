import { hash } from "bcrypt";
import { DbConnect1 } from "../../../Server/config/Db_Config";

const main = async (req: any, res: any) => {
  try {
    const DbModels = await DbConnect1();

    let tempUser = await DbModels?.user.findOne({
      userName: req.body.userName,
    });
    if (tempUser) {
      return res.status(400).send({ message: "UserName Exists!" });
    }
    tempUser = await DbModels?.user.findOne({
      emailId: req.body.emailId,
    });
    if (tempUser) {
      return res.status(400).send({ message: "Email Id Exists!" });
    }
    tempUser = await DbModels?.user.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (tempUser) {
      return res.status(400).send({ message: "Phone Number Exists!" });
    }

    const hashPassword = await hash(req.body.password.trim(), 10);

    const newUser = new DbModels!.user({
      emailId: req.body.emailId.trim(),
      userName: req.body.userName.trim(),
      phoneNumber: req.body.phoneNumber,
      name: req.body.name.trim(),
      password: hashPassword,
      deviceTokens: [req.body.deviceToken],
      emailIdFirebaseId: req.body.emailIdFirebaseId,
      phoneNumberFirebaseId: req.body.phoneNumberFirebaseId,
    });

    const data = await newUser.save();

    console.log(data);

    return res.send(data);
  } catch (e: any) {
    console.log(e);
    res.status(500).send(e.message);
  }
};

export default main;
