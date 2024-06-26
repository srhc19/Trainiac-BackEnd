import { ObjectId, Schema } from "mongoose";
import {
  TrainerRepositoryInterface,
  gymexercises,
} from "../interfaces/trainerInterface";
import ClientModel from "../models/clientmodel";
import TrainerModel from "../models/trainermodel";
import { Console, error } from "console";
import { workerData } from "worker_threads";
import UserModel from "../models/usermodel";
import bcrypt from "bcrypt";
import User from "../entities/user";
import Trainer from "../entities/trainer";
import Client from "../entities/client";
import SessionModel from "../models/sessionmodel";

export default class TrainerRepositoryImpl
  implements TrainerRepositoryInterface
{
  getCurrentVedioCallId(
    client_Id: Schema.Types.ObjectId
  ): Promise<String | null> {
    throw new Error("Method not implemented.");
  }
  async startVedioSession(
    vedioSessionClientsId: Schema.Types.ObjectId[],
    trainer_id: Schema.Types.ObjectId,
    randomid: string
  ): Promise<boolean> {
    try {
      const currentDate = new Date();

      const date = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
        date < 10 ? "0" + date : date
      }`;
      const sessionExists = await SessionModel.findOne({ randomId: randomid });
      if (sessionExists) {
        return true;
      }
      const newSession = new SessionModel({
        trainerId: trainer_id.toString(),
        clientsId: vedioSessionClientsId,
        startedAt: new Date(),
        endedAt: "",
        currentDate: formattedDate,
        randomId: randomid,
      });

      await newSession.save();
      return true;
    } catch (err) {
      console.log(error);
      return false;
    }
  }
  async checkemailexists(email: string) {
    try {
      let user = await UserModel.findOne({ email });

      if (user && user.isVerified) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getTrainerDetails(_id: ObjectId, clientEmail: string) {
    try {
      let trainerdata = await TrainerModel.findOne({ user_id: _id });
      if (trainerdata) {
        if (!trainerdata.clients.includes(clientEmail)) {
          trainerdata.clients.push(clientEmail);
          await trainerdata.save();
          let clientDetails = await ClientModel.findOne({ email: clientEmail });
          if (clientDetails) {
            clientDetails.trainers.push(trainerdata.email);
            await clientDetails.save();
          }
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getClientList(trainerid: ObjectId) {
    try {
      let trainerData = await TrainerModel.findOne({ user_id: trainerid });
      if (trainerData) {
        return trainerData.clients;
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getClientData(clientemail: string) {
    try {
      let clientData = await ClientModel.findOne({ email: clientemail });
      if (clientData) {
        return clientData;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async addCardioWorkout(
    trainerid: ObjectId,
    clientemail: string,
    workoutDate: string,
    activity: string,
    intensity: string,
    duration: string
  ) {
    try {
      console.log(clientemail);
      let clientData = await ClientModel.findOne({ email: clientemail });

      if (clientData) {
        let checkDateExists = clientData.workoutRoutines.find(
          (workout: any) => workout.workoutDate === workoutDate
        );
        if (!checkDateExists) {
          clientData.workoutRoutines.push({
            type: "CARDIO",
            workoutDate,
            details: {
              activity,
              intensity,
              duration,
            },
          });
          await clientData.save();

          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addGymWorkout(
    clientEmail: string,
    exercises: Array<gymexercises>,
    targetMuscleGroup: String,
    workoutDate: string
  ) {
    try {
      let clientData = await ClientModel.findOne({ email: clientEmail });

      if (clientData) {
        let checkDateExists = clientData.workoutRoutines.find(
          (workout: any) => workout.workoutDate === workoutDate
        );
        if (!checkDateExists) {
          clientData.workoutRoutines.push({
            type: "GYM",
            workoutDate,
            details: {
              targetMuscleGroup,
              exercises,
            },
          });
          await clientData.save();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addYogaWorkout(
    clientEmail: string,
    workoutDate: string,
    activity: string,
    duration: string
  ) {
    try {
      let clientData = await ClientModel.findOne({ email: clientEmail });

      if (clientData) {
        let checkDateExists = clientData.workoutRoutines.find(
          (workout: any) => workout.workoutDate === workoutDate
        );
        if (!checkDateExists) {
          clientData.workoutRoutines.push({
            type: "YOGA",
            workoutDate,
            details: {
              activity,
              duration,
            },
          });
          await clientData.save();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateTrainerProfile(formData: any) {
    try {
      const trainerid = formData.trainerid;
      const name = formData.name;
      const bio = formData.bio;
      const description = formData.description;
      const skillsString = formData.skills;
      const profileimage = formData.profileimage;
      const bannerImage = formData.bannerImage;
      const certificateImages = formData.certificateImages;

      const trainer = await TrainerModel.findOne({ user_id: trainerid });
      if (!trainer) {
        return false;
      }

      // Update the fields if provided, otherwise keep the existing values
      trainer.name = name ? name : trainer.name;
      trainer.Bio = bio ? bio : trainer.Bio;
      trainer.description = description ? description : trainer.description;

      trainer.profileimage = profileimage ? profileimage : trainer.profileimage;
      trainer.bannerImage = bannerImage ? bannerImage : trainer.bannerImage;

      if (certificateImages && certificateImages.length > 0) {
        trainer.certificateImages = [
          ...trainer.certificateImages,
          ...certificateImages,
        ];
      }

      // Parse the skills string back into an array of strings
      const skillsArray = JSON.parse(skillsString);
      const skillStrings = skillsArray.map((skillObj: any) => skillObj.skill);
      trainer.skills = skillStrings;

      console.log(trainer);

      await trainer.save();

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
      let userdata;
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
