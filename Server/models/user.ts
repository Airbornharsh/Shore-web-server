import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  emailId: {
    type: String,
    unique: true,
    required: true,
  },
  gender: {
    type: String,
  },
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  joinedDate: {
    type: String,
    default: Date.now(),
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
  friends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  closeFriends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  requestingFriends: [
    {
      status: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  requestedFriends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  postLiked: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
  commentLiked: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
  commented: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
  fav: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
});

export default models.User || model("User", userSchema);
