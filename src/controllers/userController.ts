import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import { generateJwt } from "../utils/jwt";
import path from "path";
import fs from "fs";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    let existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      const error = new Error("User already exists, please login instead");
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.json({ message: "User created successfully. Please login." });
  } catch (err) {
    return next(err);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    let existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      const error = new Error("Invalid credentials, could not log you in");
      return next(error);
    }

    let isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      const error = new Error("Invalid password, please try again.");
      return next(error);
    }

    const token = generateJwt(existingUser.id, existingUser.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      data: {
        userId: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        birthDate: existingUser?.birthDate || null,
        image: existingUser?.image || null,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Logout successful" });
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, birthDate } = req.body;
    
    // @ts-ignore
    const userId = req.userData.userId;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // @ts-ignore
    if (req.file) {
      // @ts-ignore
      const Path = `uploads/${req.file.filename}`;

      if (user.image) {
        const oldPath = path.join(__dirname, "..", user.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      user.image = Path;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.birthDate = birthDate || user.birthDate;
    await user.save();

    res.json({
      message: "User updated successfully",
      data: {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        image: user.image,
      },
    });
  } catch (err) {
    next(err);
  }
};

export { createUser, loginUser, logout, updateUser };
