import { DbConnect1 } from "../../../../Server/config/Db_Config";
import Authenticate from "../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const userData = await DbModels?.user.findById(AuthenticateDetail?._id);
    const followings = userData.followings;
    const followers = userData.followers;

    const getCommon = async (arr1: string[], arr2: string[]) => {
      var common = []; // Array to contain common elements
      for (var i = 0; i < arr1.length; ++i) {
        for (var j = 0; j < arr2.length; ++j) {
          if (arr1[i].toString() == arr2[j].toString()) {
            // If element is in both the arrays
            common.push(arr1[i]); // Push to common array
          }
        }
      }

      return common; // Return the common elements
    };

    const friends = await getCommon(followings, followers);

    const userDatas = await DbModels?.user
      .find({
        _id: friends,
      })
      .sort({ $natural: -1 });

    const FromMessages = await DbModels?.message.find({
      from: AuthenticateDetail?._id,
      read: true,
    });

    const ToMessages = await DbModels?.message.find({
      to: AuthenticateDetail?._id,
      read: true,
    });

    const MessageData = new Map();

    FromMessages?.forEach((FromMessage) => {
      if (MessageData.has(FromMessage.to?.toString())) {
        const tempMessage = MessageData.get(FromMessage.to?.toString());
        tempMessage?.push(FromMessage);
        MessageData.set(FromMessage.to?.toString(), tempMessage);
      } else {
        MessageData.set(FromMessage.to?.toString(), [FromMessage]);
      }
    });

    ToMessages?.forEach((ToMessage) => {
      if (MessageData.has(ToMessage.from?.toString())) {
        const tempMessage = MessageData.get(ToMessage.from?.toString());
        tempMessage?.push(ToMessage);
        MessageData.set(ToMessage.from?.toString(), tempMessage);
      } else {
        MessageData.set(ToMessage.form?.toString(), [ToMessage]);
      }
    });

    const messageDataKeys = Array.from(MessageData.keys());

    for (let i = 0; i < messageDataKeys.length; i++) {
      const temp = MessageData.get(messageDataKeys[i]);

      temp.sort((a: { time: string }, b: { time: string }) => {
        return parseInt(a.time) - parseInt(b.time);
      });
    }

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
      isPrivate: any;
      socketIds: any;
      deviceTokens: any;
      posts: any;
      followers: any;
      followings: any;
      messages: any;
    }[] = [];

    userDatas?.map((user) => {
      newUserDatas.push({
        id: user._id,
        userName: user.userName,
        name: user.name,
        imgUrl: user.imgUrl,
        joinedDate: user.joinedDate,
        emailId: user.emailId,
        phoneNumberFirebaseId: user.phoneNumberFirebaseId ?? "",
        emailIdFirebaseId: user.emailIdFirebaseId ?? "",
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        socketIds: user.socketIds ?? [],
        isPrivate: user.isPrivate,
        deviceTokens: user.deviceTokens ? user.deviceTokens : [],
        posts: user.posts,
        followers: user.followers,
        followings: user.followings,
        messages: MessageData.get(user._id.toString()) ?? [],
      });
    });

    res.send(newUserDatas);
  } catch (e: any) {
    console.log(e);
    res.status(500).send({message: e.message});
  }
};

export default main;
