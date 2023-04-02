import { Secret, verify } from "jsonwebtoken";

const Authenticate = async (req: any, res: any) => {
  try {
    const accessToken = req.headers["authorization"].split(" ")[1];

    let tempErr: any;
    let tempUser: any;

    await verify(
      accessToken,
      process.env.JWT_SECRET as Secret,
      (err: any, user: any) => {
        tempErr = err;
        tempUser = user;
      }
    );

    if (tempErr)
      return res
        .status(402)
        .send({ message: "Not Authorized", isValid: false });

    return {
      emailId: tempUser.emailId,
      userName: tempUser.userName,
      phoneNumber: tempUser.phoneNumber,
      _id: tempUser._id,
      iat: tempUser.iat,
    };
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export default Authenticate;
