import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  emailId: {
    type: String,
    unique: true,
    required: true,
  },
  emailIdFirebaseId: {
    type: String,
    unique: true,
  },
  phoneNumberFirebaseId: {
    type: String,
    // unique: true,
  },
  gender: {
    type: String,
    default: "",
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
  isPrivate: {
    type: Boolean,
    required: true,
    default: false,
  },
  deviceTokens: [{ type: String, default: [] }],
  socketIds: [{ type: String, default: [] }],
  chats: [{ type: Schema.Types.ObjectId, default: [] }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  followings: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  closeFriends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  acceptedFollowerRequests: [
    { type: Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  declinedFollowerRequests: [
    { type: Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  requestingFollowers: [
    { type: Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  acceptedFollowingRequests: [
    { type: Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  declinedFollowingRequests: [
    { type: Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  requestingFollowing: [
    { type: Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  postLiked: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
  commentLiked: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
  commented: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
  fav: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
});

export default models.User || model("User", userSchema);
