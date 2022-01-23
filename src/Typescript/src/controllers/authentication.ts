import { NextFunction, Request, Response } from "express";
import ExpressError from "../utils/ExpressError";
import jwt from "jsonwebtoken";
import { genSalt, hash, compare } from "bcrypt";

import User, { UserType } from "../models/user";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = process.env.JWT_SECRET;
  try {
    const password = req.body.password;
    const email = req.body.email;

    const user: UserType = await User.findOne({
      email: email,
    });

    if (user) {
      const validPassword = await compare(password, user.password);
      if (validPassword) {
        const token: string = jwt.sign(
          {
            id: user._id,
          },
          secret,
          { expiresIn: 60 * 60 * 24 * 7 }
        );
        res.status(200).json({
          success: true,
          accessToken: token,
        });
      } else {
        next(new ExpressError("Invalid credentials", 500));
      }
    } else {
      next(new ExpressError("Invalid credentials", 500));
    }
  } catch (error) {
    next(new ExpressError(error.toString(), 500));
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = process.env.JWT_SECRET;
  try {
    const name = req.body.name;
    const email = req.body.email;

    // Hash password
    const salt = await genSalt(10);
    const password = await hash(req.body.password, salt);

    const user: UserType = new User({
      name,
      email,
      password,
    });

    await user.save();

    const token: string = jwt.sign(
      {
        id: user._id,
      },
      secret,
      { expiresIn: 60 * 60 * 24 * 7 }
    );
    res.status(200).json({
      success: true,
      accessToken: token,
    });
  } catch (error) {
    next(new ExpressError(error.toString(), 500));
  }
};
