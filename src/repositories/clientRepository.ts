import { clientRepositoryInterface } from "../interfaces/clientInterface";
import ClientModel from "../models/clientmodel";
import TrainerModel from "../models/trainermodel";
import UserModel from "../models/usermodel";
import bcrypt from "bcrypt";
import User from "../entities/user";
import Trainer from "../entities/trainer";
import Client from "../entities/client";
import { ObjectId } from "mongoose";
import ChatModel from "../models/chatmodel";
import { Chat } from "../interfaces/userinterface";
import VedioSession from "../entities/VedioSession";
import SessionModel from "../models/sessionmodel";
export default class clientRepositoryImp implements clientRepositoryInterface {
  // async trainerlist(skip:number,limit:number): Promise<any> {
  //   try {
  //     // const newTrainer = new TrainerModel(trainerlist);
  //     // await newTrainer.save();
  //     // return newTrainer;

  //     const trainerlist = await TrainerModel.find().skip(skip).limit(limit);

  //     if (trainerlist) {
  //       return trainerlist;
  //     }
  //   } catch (error) {
  //     console.error("Error :", error);
  //   }
  // }
  async updateClientProfile(formData: any, files: any) {
    try {
      const clientid = formData.clientid;
      const name = formData.name;
      const bio = formData.bio;
      const description = formData.description;
      const goals = formData.goals;

      const bannerImage = formData.bannerImage;
      const profileimage = formData.profileimage;

      const client = await ClientModel.findOne({
        user_id: clientid,
      });
      if (!client) {
        return false;
      }
      client.name = name ? name : client.name;
      client.Bio = bio ? bio : client.Bio;
      client.description = description ? description : client.description;
      client.bannerImage = bannerImage ? bannerImage : client.bannerImage;
      client.profileimage = profileimage ? profileimage : client.profileimage;

      const goalsString = formData.goals;
      const goalsArray = JSON.parse(goalsString);

      // Extract the skill strings from the array of objects
      const goalsStrings = goalsArray.map((goalObj: any) => goalObj.skill);
      console.log(client);

      await client.save();

      return true;
    } catch (error) {
      console.log(error);
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
  async checkisblocked(email: string) {
    try {
      console.log("client Repo .....");
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

  async getcurrentuser(email: string): Promise<any> {
    try {
      let userdata: User | null;
      userdata = await UserModel.findOne({ email });
      return userdata;
    } catch (error) {
      console.error("Error checking email existence:", error);
      return null;
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
  async trainerDetails(_id: any): Promise<Trainer | null> {
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

  async getChatList(follower: any): Promise<Client | Trainer | null> {
    try {
      let chatlist = await UserModel.findOne({ email: follower });
      if (chatlist) {
        if (chatlist.role === "trainer") {
          let data = await TrainerModel.findOne({ email: follower });
          return data;
        } else if (chatlist.role === "Client") {
          let data = await ClientModel.findOne({ email: follower });
          return data;
        }
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
