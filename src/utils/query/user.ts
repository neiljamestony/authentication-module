import UserModel from "../../model/User";

export const findOneUser = async (field: { [key: string]: string }) =>
  await UserModel.findOne(field);

export const insertOne = async (data: { [key: string]: string }) =>
  await UserModel.create(data);
