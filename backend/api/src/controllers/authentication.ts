import express from "express";
import { createUser, getUserByEmail } from "../models/users";
import { authentication, encryptPhoneNumber, random } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("USER-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// TODO: Check and update this
// Maybe need to add suplimentary checks to insert only available data
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, role, phone, password, profilePicture } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const encryptedPhone = encryptPhoneNumber(phone);
    const user = await createUser({
      username,
      email,
      role,
      phone: encryptedPhone,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      profilePicture,
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
