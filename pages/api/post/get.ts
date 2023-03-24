import { DbConnect1 } from "../../../Server/config/Db_Config";

const main = async (req: any, res: any) => {
  try {
    const body = JSON.parse(req.body);
    // const body = req.body;

    const DbModels = await DbConnect1();

    const page = body.page ? body.page : 1; 
    const limit = body.limit ? body.limit : 20;

    const postData = await DbModels?.post
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ $natural: -1 });

    const postsUserIds: any[] = [];

    postData?.forEach((post) => {
      postsUserIds.push(post.userId);
    });

    const userDatas = await DbModels?.user.find({
      _id: postsUserIds,
    });

    const newPostData: {
      _id: any;
      userId: any;
      description: any;
      url: any;
      profileUrl: any;
      profileName: any;
      profileUserName: any;
      postedDate: any;
      likes: any;
      comments: any;
    }[] = [];

    postData?.forEach((post, i) => {
      const temp = {
        _id: post._id,
        userId: post.userId,
        description: post.description,
        url: post.url,
        profileUrl: getUserData(userDatas, post.userId).imgUrl,
        profileName: getUserData(userDatas, post.userId).name,
        profileUserName: getUserData(userDatas, post.userId).userName,
        postedDate: post.postedDate,
        likes: post.likes,
        comments: post.comments,
      };

      newPostData.push(temp);
    });

    res.send(newPostData);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

const getUserData = (userDatas: any, userId: String) => {
  return userDatas.find(
    (user: { _id: String }) => user._id.toString() == userId.toString()
  );
};

export default main;
