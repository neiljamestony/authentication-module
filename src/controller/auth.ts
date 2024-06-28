import { Request, Response, NextFunction } from "express";
import { handleFieldValidation } from "../middleware/middleware";
import { findOneUser, insertOne } from "../utils/query/user";
import {
  generateHash,
  generateToken,
  validateHashed,
} from "../utils/interface/fn";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, fname, lname, password, phoneNumber, userType } = req.body;
  const fieldValidation = handleFieldValidation(req.body);
  if (!fieldValidation.length) {
    const isUserExists = await findOneUser({ email });
    if (isUserExists === null) {
      const hashedPassword = await generateHash(password);
      const user = await insertOne({
        fname: fname,
        lname: lname,
        email: email,
        phoneNumber: phoneNumber,
        user_type: userType,
        password: hashedPassword,
      });
      if (user) {
        res.status(201).json({
          data: [
            {
              _id: user._id,
              fname: user.fname,
              lname: user.fname,
              email: user.email,
              phoneNumber: user.phoneNumber,
              user_type: user.user_type,
              token: generateToken(user._id),
            },
          ],
          msg: "success",
        });
      } else {
        res.status(201).json({ data: [], msg: "Unexpected Error occured!" });
      }
    } else {
      res.status(201).json({ data: [], msg: "email exists" });
    }
  } else {
    res.status(422).json({ data: [], msg: fieldValidation });
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await findOneUser({ email });
    if (user && (await validateHashed(password, user.password))) {
      res.status(201).json({
        data: {
          _id: user._id,
          fname: user.fname,
          lname: user.fname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          user_type: user.user_type,
          token: generateToken(user._id),
        },
        msg: "success",
      });
    } else {
      res.status(422).json({ data: [], msg: "invalid credentials!" });
    }
    next();
  } catch (error) {
    if (error instanceof SyntaxError) {
      res.status(500).json({ data: [], msg: error.message });
      next(error.message);
    } else {
      res
        .status(500)
        .json({ data: [], msg: `An unexpected error occured: ${error}` });
      next(error);
    }
  }
};

export const logoutController = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token required for logout" });
  }
  try {
    res.json({ data: [], msg: "Logged out successfully" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ data: [], msg: "error logging out" });
  }
};
