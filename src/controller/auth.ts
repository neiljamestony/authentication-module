import { Request, Response, NextFunction } from "express";
import { handleFieldValidation } from "../middleware/middleware";
import {
  generateHash,
  generateToken,
  validateHashed,
} from "../utils/interface/fn";
import UserModel from "../model/User";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, fname, lname, password, phoneNumber, userType } = req.body;
    const fieldValidation = handleFieldValidation(req.body);
    if (!fieldValidation.length) {
      const isUserExists = await UserModel.findOne({ email });
      const isPhoneNumberExists = await UserModel.findOne({ phoneNumber });
      if (isUserExists === null || isPhoneNumberExists === null) {
        const hashedPassword = await generateHash(password);
        const user = await UserModel.create({
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
          res.status(201).json({
            data: [],
            msg: "Unexpected Error occured, please try again!",
          });
        }
      } else {
        res
          .status(201)
          .json({ data: [], msg: "Its either email or phone number exists!" });
      }
    } else {
      res.status(422).json({ data: [], msg: fieldValidation });
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      res.status(500).json({ data: [], msg: error.message });
      next(error.message);
    } else {
      res
        .status(500)
        .json({ data: [], msg: `An unexpected error occured: ${error}` });
    }
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user && (await validateHashed(password, user.password))) {
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
      res.status(422).json({ data: [], msg: "Invalid credentials!" });
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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { id } = res.locals.user;
    let { password } = req.body;
    let newForm = { password: await generateHash(password) };
    // update info based in id
    const updatedData = await UserModel.updateOne(
      { _id: id },
      { $set: newForm }
    );

    if (!id) {
      res.json({ data: [], msg: "Unauthorized request" });
    }

    res.json({
      data: [
        {
          acknowledged: updatedData?.acknowledged,
        },
      ],
      msg: "updated successfully",
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      res.status(500).json({ data: [], msg: error.message });
    } else {
      res
        .status(500)
        .json({ data: [], msg: `An unexpected error occured: ${error}` });
    }
  }
};

export const verifyIfEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (user === null) {
      res.json({ data: [], msg: "user not exists" });
    } else {
      res.json({
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
    }
    next();
  } catch (error) {
    if (error instanceof SyntaxError) {
      res.status(500).json({ data: [], msg: error.message });
    } else {
      res
        .status(500)
        .json({ data: [], msg: `An unexpected error occured: ${error}` });
    }
  }
};
