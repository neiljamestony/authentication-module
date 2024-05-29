import { isValidEmail } from "../utils/interface/fn";
import { Request, Response, NextFunction } from "express";
import jwt, {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from "jsonwebtoken";
import { SECRET } from "../config/uri";

const isTokenExpiredError = (error: any): error is TokenExpiredError => {
  return error instanceof TokenExpiredError;
};

export const handleFieldValidation = (formData: any) => {
  let stringLength: number = 40;
  let passwordLength: number = 100;
  let phoneNumberLength: number = 11;
  let errors: string[] = [];
  Object.keys(formData).forEach((v) => {
    const value = formData[v];
    // check if empty
    if (value === "") errors.push(`${v} is required`);

    // check if valid email
    if (v === "email" && !isValidEmail(value)) errors.push("invalid email");

    // check string length
    if (
      (v === "email" || v === "fname" || v === "lname") &&
      value.length >= stringLength
    )
      errors.push(`${v} should be atleast ${stringLength} characters`);

    // check password length
    if (v === "password" && value.length > passwordLength)
      errors.push(`${v} should be atleast ${passwordLength} characters`);

    if (v === "phoneNumber") {
      // check if number
      if (Number(value)) {
        // check length
        if (
          value.length < phoneNumberLength ||
          value.length > phoneNumberLength
        ) {
          errors.push(`${v} should be atleast ${phoneNumberLength} characters`);
        }
      } else {
        errors.push("invalid phone number");
      }
    }

    return v;
  });
  return errors;
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: any =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token)
    res.status(422).json({ data: [], msg: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    res.status(201).json({ data: [], msg: "valid token" });
    let q = { ...req, user: decoded };
    q.user = decoded;
    next();
  } catch (error) {
    if (isTokenExpiredError(error)) {
      return res.status(401).json({ data: [], msg: "Token expired!" });
    }
    if (error instanceof JsonWebTokenError || error instanceof NotBeforeError) {
      return res.status(401).json({ data: [], msg: "Invalid Token" });
    }
    res.json({ data: [], msg: "Internal Server Error" });
  }
};
