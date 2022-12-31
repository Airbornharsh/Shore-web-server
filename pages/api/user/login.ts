import { compare } from "bcrypt";
import { Secret, sign } from "jsonwebtoken";
import { DbConnect1 } from "../../../Server/config/Db_Config";

const main = async (req: any, res: any) => {
  try {
    const DbModels = await DbConnect1();

    let tempUser;

    if (req.body.userName) {
      tempUser = await DbModels!.user.findOne({
        userName: req.body.userName.trim(),
      });
      if (!tempUser) {
        return res
          .status(400)
          .send({ message: `No Such ${req.body.userName} Exist` });
      }
    } else if (req.body.emailId) {
      tempUser = await DbModels!.user.findOne({
        userName: req.body.emailId.trim(),
      });
      if (!tempUser) {
        return res
          .status(400)
          .send({ message: `No Such ${req.body.emailId} Exist` });
      }
    } else if (req.body.phoneNumber) {
      tempUser = await DbModels!.user.findOne({
        userName: req.body.phoneNumber,
      });
      if (!tempUser) {
        return res
          .status(400)
          .send({ message: `No Such ${req.body.emailId} Exist` });
      }
    } else {
      return res
        .status(400)
        .send({ message: `Provide a Valid Authentication` });
    }

    const passwordSame = await compare(
      req.body.password.trim(),
      tempUser.password.trim()
    );

    if (!passwordSame) {
      return res.status(401).send({ message: "Wrong Password" });
    }

    const authUser = {
      userName: tempUser.userName,
      emailId: tempUser.emailId,
      phoneNumber: tempUser.phoneNumber,
      _id: tempUser._id,
    };

    const accessToken = sign(authUser, process.env.JWT_SECRET as Secret);

    res.send({ accessToken });
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
