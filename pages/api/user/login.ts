import { compare } from "bcrypt";
import { Secret, sign } from "jsonwebtoken";
import { DbConnect1 } from "../../../Server/config/Db_Config";

const Login = async (req: any, res: any) => {
  try {
    const DbModels = await DbConnect1();

    let tempUser;

    if (req.body.userName) {
      tempUser = await DbModels!.user.findOne({
        userName: req.body.userName,
      });
      if (!tempUser) {
        return res.status(400).send(`No Such ${req.body.userName} Exist`);
      }
    } else if (req.body.emailId) {
      tempUser = await DbModels!.user.findOne({
        userName: req.body.emailId,
      });
      if (!tempUser) {
        return res.status(400).send(`No Such ${req.body.emailId} Exist`);
      }
    } else {
      return res.status(400).send(`Provide a Valid Authentication`);
    }

    const passwordSame = await compare(req.body.password, tempUser.password);

    if (!passwordSame) {
      return res.status(401).send("Wrong Password");
    }

    const authUser = {
      userName: tempUser.userName,
      emailId: tempUser.emailId,
      phoneNumber: tempUser.phoneNumber,
    };

    const accessToken = sign(authUser, process.env.JWT_SECRET as Secret);

    res.send({ accessToken });
  } catch (e: any) {
    res.send(e.message);
  }
};

export default Login;
