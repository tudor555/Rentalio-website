import express from "express";
import { createUser, getUserByEmail } from "../models/users";
import {
  authentication,
  encryptPhoneNumber,
  isValidEmail,
  random,
} from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    const salt = random();
    const sessionToken = authentication(salt, user._id.toString());
    user.authentication.sessionToken = sessionToken;

    await user.save();

    res.cookie("USER-AUTH", sessionToken, {
      domain: "localhost", // TODO: make this dynamic in env for production
      path: "/",
    });

    const sanitizedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    };

    return res.status(200).json(sanitizedUser);
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    let { username, email, role, phone, password, profilePicture } = req.body;

    const ALLOWED_ROLES = ["owner", "visitor", "admin"];

    if (!email || !password || !username || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    email = email.trim();
    password = password.trim();
    username = username.trim();
    role = role.trim();

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res
        .status(400)
        .json({ error: `Role must be one of: ${ALLOWED_ROLES.join(", ")}` });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    if (phone && !/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    const salt = random();
    const newUserData: any = {
      username,
      email,
      role,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    };

    if (phone) newUserData.phone = encryptPhoneNumber(phone);
    if (profilePicture) newUserData.profilePicture = profilePicture;

    const user = await createUser(newUserData);

    return res.status(201).json(user);
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
