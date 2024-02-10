import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "models/user.model";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN as string;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN as string;

export const create = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ status: "An error occured", message: "Incomplete Credentials" });
  }

  // If email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(400)
      .json({ status: "An error occured", message: "Email is already in use" });
  }

  const hashedPassword = bcrypt.hash(password, 12);
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    message: "Your account was successfully created!",
    data: newUser,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "An error occured", message: "Incomplete Credentials" });
  }

  const user = await User.findOne({ email }).select("+password");

  // check if password is correct
  const match = await bcrypt.compare(password, user.password);
  if (!user || !match) {
    return res.status(400).json({
      status: "An error occured",
      message: "Email or password is incorrect",
    });
  }

  // create tokens (access & refresh)
  const accessToken = jwt.sign({ email }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ email }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  // update user refresh token
  await User.findOneAndUpdate({ email: user.email }, { refreshToken });

  // check if in production mode
  const isProduction = process.env.NODE_ENV === "production";

  // store token (access & refresh)
  res.cookie("access-token", accessToken, {
    secure: isProduction ? true : false,
    httpOnly: isProduction ? true : false,
    path: "/",
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refresh-token", refreshToken, {
    secure: isProduction ? true : false,
    httpOnly: isProduction ? true : false,
    path: "/",
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return res.status(200).json({ message: "Login successfully!" });
};

export const protect = async (req: Request, res: Response) => {};
