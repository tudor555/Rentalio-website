import mongoose, { mongo } from "mongoose";

interface GetUsersOptions {
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  skip?: number;
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["owner", "visitor", "admin"], required: true },
  phone: { type: String },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  profilePicture: { type: String }, // URL to profile picture
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("User", UserSchema, "users");

export const getUsers = async ({
  filter = {},
  sort = {},
  limit,
  skip = 0,
}: GetUsersOptions) => {
  const query = UserModel.find(filter).sort(sort).skip(skip);

  if (limit) {
    query.limit(limit);
  }

  return query.exec();
};

export const getUserById = (id: string) => UserModel.findById(id);

export const getUsersCount = (filter: Record<string, any> = {}) =>
  UserModel.countDocuments(filter);

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
  UserModel.findByIdAndDelete({ _id: id });

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values, { new: true });
