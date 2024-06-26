import { PassThrough } from "stream";
import User from "../entities/user";
import Trainer from "../entities/trainer";

import UserRepositoryImpl from "../repositories/UserRepository";
import { ObjectId } from "mongoose";
import { promises } from "dns";
import Client from "../entities/client";
interface UserObject {
  name: string;
  password: string;
  role: string;
  email: string;
  isAdmin: boolean;
}

interface CreateUserUseCase {
  registeruser(user: User): Promise<User>;
  checkemailexists(email: string, password: string): Promise<boolean>;
  checkifAdmin(email: string): Promise<boolean>;
  getuserdetails(
    Client: string,
    skip: number,
    limit: number
  ): Promise<Array<any>>;
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
  clientDetails(_id: any): Promise<Client | null>;
  getCurrentUser(_id: ObjectId): Promise<Trainer | null>;
  clientDetailsWithEmail(emai1: string): Promise<Client | null>;
}

// Implement the CreateUserUseCase interface
class CreateUserUseCaseImpl implements CreateUserUseCase {
  constructor(private userRepository: UserRepositoryImpl) {}

  async registeruser(user: User): Promise<User> {
    return await this.userRepository.createUser(user);
  }
  async checkemailexists(email: string): Promise<boolean> {
    return await this.userRepository.checkemailexists(email);
  }
  async checkvaliduser(email: string, password: string): Promise<boolean> {
    return await this.userRepository.checkvaliduser(email, password);
  }
  async checkifAdmin(email: string): Promise<boolean> {
    return await this.userRepository.checkifAdmin(email);
  }
  async getuserdetails(
    Client: string,
    skip: number,
    limit: number
  ): Promise<Array<any>> {
    return await this.userRepository.getuserdetails(Client, skip, limit);
  }
  async getcurrentuser(email: string): Promise<UserObject | null> {
    return await this.userRepository.getcurrentuser(email);
  }

  async changeUserStatus(_id: ObjectId): Promise<void> {
    await this.userRepository.changeUserStatus(_id);
  }
  async getotpdetails(email: string): Promise<User> {
    return await this.userRepository.getotpdetails(email);
  }
  async resendotp(
    otp: number,
    otpExpirationTime: Date,
    email: string
  ): Promise<void> {
    await this.userRepository.resendotp(otp, otpExpirationTime, email);
  }

  async verifystoreEmailOtp(
    otp: number,
    otpExpirationTime: Date,
    email: string
  ): Promise<void> {
    await this.userRepository.verifystoreEmailOtp(
      otp,
      otpExpirationTime,
      email
    );
  }

  async updatePassword(newPassword: string, email: string): Promise<boolean> {
    return await this.userRepository.updatePassword(newPassword, email);
  }

  async checkisblocked(email: string): Promise<boolean> {
    return await this.userRepository.checkisblocked(email);
  }

  async addTrainer(trainer: any): Promise<boolean> {
    return await this.userRepository.addTrainer(trainer);
  }
  async addClient(client: any): Promise<boolean> {
    return await this.userRepository.addClient(client);
  }
  async updateVerifyUser(email: string) {
    return await this.userRepository.updateVerifyUser(email);
  }
  async getuser(email: string): Promise<User | null> {
    return await this.userRepository.getuser(email);
  }
  async trainerDetails(_id: ObjectId): Promise<Trainer | null> {
    return await this.userRepository.trainerDetails(_id);
  }
  async clientDetails(user_id: any): Promise<Client | null> {
    return await this.userRepository.clientDetails(user_id);
  }
  async getCurrentUser(_id: ObjectId): Promise<Trainer | null> {
    return await this.userRepository.getCurrentUser(_id);
  }
  async clientDetailsWithEmail(email: string): Promise<Client | null> {
    return await this.userRepository.clientDetailsWithEmail(email);
  }
}

export { CreateUserUseCaseImpl };
