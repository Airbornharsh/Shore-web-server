import { DbConnect1 } from "../../../../Server/config/Db_Config";
import { setFirebase } from "../../../../Server/config/Firebase_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    // const body = JSON.parse(req.body);
    const body = req.body;

    console.log("Step 1");

    if (!(body.message && body.recieverUserId && body.currentTime)) {
      return res.status(406).send({ message: "No Data Given" });
    }
    console.log("Step 2");

    const DbModels = await DbConnect1();
    console.log("Step 3");

    const FCM = await setFirebase();
    console.log("Step 4");

    const AuthenticateDetail = await Authenticate(req, res);

    console.log("Step 5");

    const recieverUserData = await DbModels?.user.findById(body.recieverUserId);

    console.log("Step 6");

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

    console.log("Step 7");

    const tempDeviceTokens = recieverUserData.deviceTokens;

    // recieverUserData.deviceTokens.forEach(async (token: any) => {

    console.log("Step 8");

    const message = {
      // to: token,
      // token,
      notification: {
        title: AuthenticateDetail?.userName,
        body: body.message,
      },
      data: {
        senderUserId: AuthenticateDetail._id.toString(),
        time: body.currentTime,
        message: body.message.toString(),
        type: body.type ? body.type.trim() : "text",
      },
    };

    console.log("Step 9");

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
    console.log("Step 12");

    const newMessage = new DbModels!.message({
      from: AuthenticateDetail?._id,
      message: body.message.toString(),
      to: body.recieverUserId.toString(),
      time: body.currentTime,
      type: body.type ? body.type.trim() : "text",
    });

    console.log("Step 13");

    const data = await newMessage.save();

    console.log("Step 14");

    return res.send({ message: "Message Sent" });
  } catch (e: any) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};

export default main;
