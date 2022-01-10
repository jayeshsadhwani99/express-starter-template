import { NextFunction, Request, Response } from "express";
import ExpressError from "../utils/ExpressError";
import jwt from "jsonwebtoken";
import User, { UserType } from "../models/user";

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: any = req.headers.token;
    const secret: string = process.env.JWT_SECRET;
    const decoded: any = jwt.verify(token, secret);
    const user: UserType = await User.findById(decoded.id);
    if (user != null) {
      res.locals.id = decoded.id;
      next();
    } else {
      next(new ExpressError("User not found", 404));
    }
    next();
  } catch (error) {
    next(new ExpressError(`You are not authorized: ${error}`, 403));
  }
};
