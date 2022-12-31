import { model, models, Schema } from "mongoose";

const postSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  description: { type: String },
  url: { type: String },
  postedDate: { type: String, default: Date.now() },
  likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
});

export default models.Post || model("Post", postSchema);
