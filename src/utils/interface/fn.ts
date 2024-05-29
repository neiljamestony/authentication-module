import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { SECRET } from "../../config/uri";

export const isValidEmail = (email: string) =>
  RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email);

export const generateHash = async (data: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(data, salt);
};

export const generateToken = (id: string) =>
  jwt.sign({ id }, SECRET, { expiresIn: "30d" });

export const validateHashed = async (input: string, reference: any) =>
  await bcrypt.compare(input, reference);
