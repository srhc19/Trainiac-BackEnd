import User from "../entities/user";
import Trainer from "../entities/trainer";
import Client from "../entities/client";
import UserModel from "../models/usermodel";
import TrainerModel from "../models/trainermodel";
import ClientModel from "../models/clientmodel";
import bcrypt from "bcryptjs";
import { UserRepositoryInterface } from "../interfaces/userinterface";
import { ObjectId } from "mongoose";
interface UserObject {
  name: string;
  password: string;
  role: string;
  email: string;
  isAdmin: boolean;
}

export default class UserRepositoryImpl implements UserRepositoryInterface {
  async updatePassword(newPassword: string, email: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        user.password = newPassword;
        await user.save();
        return true;
      }

      return false;
    } catch (error) {
      return false;
      console.log(error);
    }
  }
  async verifystoreEmailOtp(
    otp: number,
    otpExpirationTime: Date,
    email: string
  ): Promise<void> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: email },
        { otp, otpExpirationTime }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async createUser(user: User): Promise<User> {
    try {
      let data = await UserModel.findOne({ email: user.email });

      if (!data) {
        const newUser = new UserModel(user);
        let userdata = await newUser.save();

        return userdata;
      }
      data.name = user.name;
      data.role = user.role;
      data.password = user.password;
      data.otp = user.otp;
      data.otpExpirationTime = user.otpExpirationTime;
      await data.save();
      return data;
    } catch (error) {
      console.error("Error checking email existence:", error);
      return user;
    }
  }
  async checkemailexists(email: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ email });

      if (user && user.isVerified) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error checking email existence:", error);
      return false;
    }
  }

  async checkvaliduser(email: string, password: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        const hashedPasswordFromDB = user.password;

        const validPassword = await bcrypt.compare(
          password,
          hashedPasswordFromDB
        );
        if (validPassword) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking email existence:", error);
      return false;
    }
  }

  async checkifAdmin(email: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        if (user.isAdmin) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking email existence:", error);
      return false;
    }
  }
  async getuserdetails(
    Client: string,
    skip: number,
    limit: number
  ): Promise<any> {
    try {
      const userdata = await UserModel.find({ role: Client })
        .skip(skip)
        .limit(limit);
      return userdata;
    } catch (error) {
      console.error("Error checking email existence:", error);
    }
  }
  async getcurrentuser(email: string): Promise<UserObject | null> {
    try {
      let userdata;
      userdata = await UserModel.findOne({ email });
      return userdata;
    } catch (error) {
      console.error("Error checking email existence:", error);
      return null;
    }
  }
  async changeUserStatus(_id: ObjectId): Promise<void> {
    try {
      let user = await UserModel.findOne({ _id });
      if (user) {
        user.isblocked = !user.isblocked;
        await user.save();
      }
    } catch (error) {
      console.error("Error checking email existence:", error);
    }
  }

  async getotpdetails(email: string): Promise<any> {
    try {
      let user = await UserModel.findOne({ email });

      if (user) {
        return user;
      }
    } catch (error) {
      console.error("Error checking email existence:", error);
    }
  }

  async resendotp(otp: number, otpExpirationTime: Date, email: string) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: email },
        { otp, otpExpirationTime }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async checkisblocked(email: string) {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        if (user.isblocked) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
      console.log(error);
    }
  }

  async addTrainer(trainer: any) {
    try {
      let newTrainer = new TrainerModel(trainer);
      let trainerdata = await newTrainer.save();
      if (trainerdata) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addClient(client: any) {
    try {
      let newclient = new ClientModel(client);
      let clientdata = await newclient.save();
      if (clientdata) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getuser(email: string): Promise<User | null> {
    try {
      let user = await UserModel.findOne({ email });
      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updateVerifyUser(email: string) {
    try {
      await UserModel.findOneAndUpdate(
        { email },
        { $set: { isVerified: true } }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async trainerDetails(_id: ObjectId): Promise<Trainer | null> {
    try {
      let trainer = await TrainerModel.findOne({ user_id: _id });
      if (trainer) {
        return trainer;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async clientDetails(user_id: any): Promise<Client | null> {
    try {
      let client = await ClientModel.findOne({ user_id });
      if (client) {
        return client;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getCurrentUser(_id: ObjectId): Promise<Trainer | null> {
    try {
      let client = await TrainerModel.findOne({ user_id: _id });
      if (client) {
        return client;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async clientDetailsWithEmail(email: string): Promise<Client | null> {
    try {
      let client = await ClientModel.findOne({ email });
      if (client) {
        return client;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
