import { model, models, Schema } from "mongoose";

const commentSchema = new Schema({
  commented: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  to: { type: Schema.Types.ObjectId, ref: "User" },
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
});

export default models.Comment || model("Comment", commentSchema);
