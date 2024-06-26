import * as jwt from "jsonwebtoken";
import { Claims } from "../interfaces/userinterface";
import dotenv from "dotenv";
dotenv.config();

// function getCurrentUser(): Claims {
//   // Implement your logic to fetch the current user
//   return { name: 'John Doe', isAdmin: true };
// }

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

export function generateAccessToken(
  name: string,
  isAdmin: boolean,
  id: string,
  email: string
): string {
  // const currentUser = getCurrentUser();

  const payload: Claims & { exp: number } = {
    username: name,
    isAdmin: isAdmin,
    user_id: id,
    useremail: email,

    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  return jwt.sign(payload, accessTokenSecret, { algorithm: "HS256" });
}
export function generateRefreshToken(
  name: string,
  isAdmin: boolean,
  id: string,
  email: string
): string {
  const payload = {
    username: name,
    isAdmin: isAdmin,
    user_id: id,
    useremail: email,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
  };

  return jwt.sign(payload, refreshTokenSecret, { algorithm: "HS256" });
}
