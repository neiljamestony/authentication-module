import { Schema, model } from "mongoose";
import { IUser } from "../utils/interface/main";
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    required: true,
  },
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
