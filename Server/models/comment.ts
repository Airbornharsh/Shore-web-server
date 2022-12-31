import { model, models, Schema } from "mongoose";

const postSchema = new Schema({
  commented: { type: Schema.Types.ObjectId, ref: "User" },
  description: { type: String },
  to: { type: String },
  postId: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
});

export default models.Post || model("Comment", postSchema);
