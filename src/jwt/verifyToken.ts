import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Claims } from "../interfaces/userinterface";
dotenv.config();

interface EnvironmentVariables {
  ACCESS_TOKEN_SECRET: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariables {}
  }
}

interface CustomRequest extends Request {
  user?: any; 
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authorization header missing",
    });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }
      // Assuming decoded is an object
      req.user = decoded;
      console.log(decoded, "decoded");
      next();
    }
  );
};

export { verifyToken };
