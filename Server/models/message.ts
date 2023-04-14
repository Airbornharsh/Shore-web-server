import { Schema, model, models } from "mongoose";

const messageSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true,
  },
});

export default models.Message || model("Message", messageSchema);
