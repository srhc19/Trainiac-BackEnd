import { promises } from "dns";
import User from "../entities/user";
import Trainer from "../entities/trainer";
import Client from "../entities/client";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

interface UserObject {
  name: string;
  password: string;
  role: string;
  email: string;
  isAdmin: boolean;
}

export interface UserRepositoryInterface {
  createUser(user: User): Promise<User>;
  checkemailexists(email: string): Promise<boolean>;
  checkifAdmin(email: string): Promise<boolean>;
  getuserdetails(Client: string, skip: number, limit: number): Promise<any>;
  getcurrentuser(email: string): Promise<UserObject | null>;
  getotpdetails(email: string): Promise<User>;
  verifystoreEmailOtp(
    otp: number,
    otpExpirationTime: Date,
    email: string
  ): Promise<void>;
  updatePassword(newPassword: string, email: string): Promise<boolean>;
  checkisblocked(email: string): Promise<boolean>;
  addTrainer(trainer: any): Promise<boolean>;
  addClient(client: any): Promise<boolean>;
  getuser(email: string): Promise<User | null>;
  trainerDetails(_id: ObjectId): Promise<Trainer | null>;
  clientDetails(email: string): Promise<Client | null>;
  getCurrentUser(_id: ObjectId): Promise<Trainer | null>;

  clientDetailsWithEmail(email: string): Promise<Client | null>;
}

export interface UserControllerinterface {
  register(req: Request, res: Response): void;
  // login(req: Request, res: Response): void;
  getUserdata(req: Request, res: Response): void;
  verifyEmailOtp(req: Request, res: Response): void;
}

export interface Claims {
  username: string;
  isAdmin: boolean;
  user_id: string;
  useremail: string;
}

export interface Chat {
  senderEmail: String;
  receiverEmail: String;
  content: String;
  createdAt: Date;
  read: Boolean;
}
