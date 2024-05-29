import { Document } from "mongoose";
export interface IUser extends Document {
  email: string;
  fname: string;
  lname: string;
  password: string | number;
  phoneNumber: string;
  user_type: string;
}
