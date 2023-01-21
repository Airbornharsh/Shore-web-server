import { ObjectId } from "mongodb";
import { DbConnect1 } from "../../../../../../Server/config/Db_Config";
import Authenticate from "../../../../../../Server/middlewares/Authenticate";

const main = async (req: any, res: any) => {
  try {
    const body = JSON.parse(req.body);

    if (!body.postId) {
      return res.status(406).send({ message: "Post Id Missing" });
    }

    const DbModels = await DbConnect1();

    const AuthenticateDetail = await Authenticate(req, res);

    const userData = await DbModels?.user.findById(AuthenticateDetail?._id);

    const commentIds = userData?.commented;

    if (commentIds) {
      var commentObjectIds = commentIds.map((id: any) => new ObjectId(id));

      const commentData = await DbModels?.comment.find({
        _id: commentObjectIds,
      });

      const postCommentData: { post: any; comment: any }[] = [];

      const postIds: any[] = [];

      commentData?.forEach((com) => {
        postIds.push(com.postId);
      });
      var postObjectIds = postIds.map((id: any) => new ObjectId(id));

      const postData = await DbModels?.post.find({
        _id: postObjectIds,
      });

      //   commentData?.forEach((com) => {
      //     postData?.forEach((pos) => {
      //       if (pos._id.toString().trim() === com.postId.toString().trim()) {
      //         postCommentData.push({
      //           post: pos,
      //           comment: com,
      //         });
      //       }
      //     });
      //   });

      postData?.forEach((pos) => {
        const tempPost = pos;
        const comments: any[] = [];
        commentData?.forEach((com) => {
          if (pos.comments.includes(com._id)) comments.push(com);
        });
        tempPost.comments = comments;
        postCommentData.push(tempPost);
      });

      return res.send(postCommentData);
    } else {
      return res.send([]);
    }
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};

export default main;
