import { model, models, Schema } from "mongoose";

const commentSchema = new Schema({
  commented: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  to: { type: Schema.Types.ObjectId, ref: "User" },
  reply: [{ type: Schema.Types.ObjectId, ref: "Comment", default: "" }],
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  time: { type: String, required: true },
});

export default models.Comment || model("Comment", commentSchema);
