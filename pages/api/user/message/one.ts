import { DbConnect1 } from "../../../../Server/config/Db_Config";
import { setFirebase } from "../../../../Server/config/Firebase_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    // const body = JSON.parse(req.body);
    const body = req.body;

    if (!(body.message && body.recieverUserId && body.currentTime)) {
      return res.status(406).send({ message: "No Data Given" });
    }
    const DbModels = await DbConnect1();
    const FCM = await setFirebase();
    const AuthenticateDetail = await Authenticate(req, res);

    const recieverUserData = await DbModels?.user.findById(body.recieverUserId);

    if (!recieverUserData) {
      return res.status(404).send({ message: "User Not Found" });
    }

    // const newMessage = new DbModels!.message({
    //     senderId: AuthenticateDetail?._id,
    //     recieverId: body.userId,
    //     message: body.message,
    //     sentDate: Date.now(),
    // });

    // const messageData = await newMessage.save();

    // await DbModels?.user.findByIdAndUpdate(AuthenticateDetail?._id, {
    //     $push: { messages: messageData._id },
    // });

    const tempDeviceTokens = recieverUserData.deviceTokens;

    // recieverUserData.deviceTokens.forEach(async (token: any) => {

    const message = {
      // to: token,
      // token,
      notification: {
        title: AuthenticateDetail?.userName.toString(),
        body: body.message.toString(),
      },
      data: {
        senderUserId: AuthenticateDetail._id.toString(),
        time: body.currentTime.toString(),
        message: body.message.toString(),
        type: body.type ? body.type.trim() : "text",
      },
    };

    FCM.sendToMultipleToken(
      message,
      tempDeviceTokens,
      (err: any, response: any) => {
        if (err) {
          console.log("Something has gone wrong!", err);
          console.log("Step 10");
        } else {
          console.log("Successfully sent with response: ", response);
          console.log("Step 11");
        }
      }
    );

    const newMessage = new DbModels!.message({
      from: AuthenticateDetail?._id,
      message: body.message.toString(),
      to: body.recieverUserId.toString(),
      time: body.currentTime.toString(),
      type: body.type ? body.type.trim() : "text",
    });

    const data = await newMessage.save();

    return res.send({ message: "Message Sent" });
  } catch (e: any) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};

export default main;
