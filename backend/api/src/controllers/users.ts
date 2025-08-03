import express from "express";
import {
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  getUsersCount,
} from "../models/users";
import {
  random,
  authentication,
  encryptPhoneNumber,
  decryptPhoneNumber,
} from "../helpers";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers({});

    console.log(`Succesfully get all users.`);
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.phone) {
      user.phone = decryptPhoneNumber(user.phone);
    }

    console.log(`Successfully get user with ID: ${id}`);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const searchUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { username, email, role, sort } = req.query;

    const page = parseInt(req.query.page as string) || 1;
    const pageSize =
      parseInt(req.query.limit as string) ||
      parseInt(req.query.pageSize as string) ||
      10;
    const skip = (page - 1) * pageSize;

    const filter: any = {};

    if (username)
      filter.username = { $regex: username as string, $options: "i" };

    if (email) filter.email = { $regex: email as string, $options: "i" };

    if (role) filter.role = role;

    // Sorting options
    const sortOptions: Record<string, any> = {
      createdAt_desc: { createdAt: -1 },
      createdAt_asc: { createdAt: 1 },
      username_asc: { username: 1 },
      username_desc: { username: -1 },
    };

    const sortQuery = sortOptions[sort as string] || { createdAt: -1 };

    // Fetch users
    const [users, total] = await Promise.all([
      getUsers({ filter, sort: sortQuery, skip, limit: pageSize }),
      getUsersCount(filter),
    ]);

    console.log("Filtered users search performed");
    return res.status(200).json({
      data: users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate fields before applying updates
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Encrypt phone number before updating
    if (updates.phone) {
      if (!/^\+?[1-9]\d{1,14}$/.test(updates.phone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }
      updates.phone = encryptPhoneNumber(updates.phone); // Encrypt the phone number
    }

    // Prevent updates to restricted fields like `authentication`, `createdAt`
    if (updates.authentication || updates.createdAt) {
      return res.status(400).json({
        message: "Updating authentication or createdAt is not allowed",
      });
    }

    const updatedUser = await updateUserById(id, updates);

    if (updatedUser.phone) {
      updatedUser.phone = decryptPhoneNumber(updatedUser.phone);
    }

    console.log(`Successfully updated the user with ID: ${id}`);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { email, oldPassword, newPassword } = req.body;

    const user = await getUserById(id).select(
      "+authentication.password +authentication.salt"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.email !== email) {
      return res
        .status(400)
        .json({ message: "Email does not match our records" });
    }

    const isPasswordValid =
      authentication(user.authentication.salt, oldPassword) ===
      user.authentication.password;
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Validate new password strength
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) {
      return res.status(400).json({
        message:
          "New password must be at least 8 characters long and include letters and numbers",
      });
    }

    // Hash the new password
    const newSalt = random();
    const hashedPassword = authentication(newSalt, newPassword);

    await updateUserById(id, {
      "authentication.password": hashedPassword,
      "authentication.salt": newSalt,
    });

    console.log(`Successfully updated password for user with ID: ${id}`);
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (deletedUser.phone) {
      deletedUser.phone = decryptPhoneNumber(deletedUser.phone);
    }

    console.log(`Successfully deleted user with ID: ${id}`);
    return res.status(200).json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
