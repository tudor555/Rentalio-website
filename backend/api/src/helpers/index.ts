import crypto from "crypto";
import path from "path";
import dotenv from "dotenv";

const envPath = path.resolve(
  __dirname,
  "../../../../env/backend_env/api_env/api.env"
);
dotenv.config({ path: envPath });

const SECRET = process.env.SECRET || "default_secret";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

export const encryptPhoneNumber = (phone: string) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    crypto.scryptSync(SECRET, "salt", 32),
    Buffer.alloc(16, 0)
  );
  let encrypted = cipher.update(phone, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
