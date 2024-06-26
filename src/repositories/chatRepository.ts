import { ObjectId, Schema } from "mongoose";
import VedioSession from "../entities/vedioSession";
import Client from "../entities/client";
import Trainer from "../entities/trainer";
import {
  Blog,
  BlogContent,
  chatRepositoryInterface,
} from "../interfaces/chatInterface";
import ChatModel from "../models/chatmodel";
import ClientModel from "../models/clientmodel";
import SessionModel from "../models/sessionmodel";
import TrainerModel from "../models/trainermodel";
import UserModel from "../models/usermodel";
import BlogModel from "../models/blogmodel";
import { PipelinePromise } from "stream";

export default class ChatRepositoryImpl implements chatRepositoryInterface {
  async getCurrentVedioCallId(
    trainerId: Schema.Types.ObjectId,
    client_Id: Schema.Types.ObjectId
  ): Promise<string | null> {
    try {
      const getSessionDetails = await SessionModel.find({
        clientsId: { $in: [client_Id] },
        trainerId: trainerId,
      });
      console.log(getSessionDetails);

      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async trainerDetails(traineremail: String): Promise<Trainer | null> {
    try {
      const trainerDetails = await TrainerModel.findOne({
        email: traineremail,
      });
      return trainerDetails || null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getMessages(senderemail: string, receiveremail: string): Promise<any> {
    try {
      await ChatModel.updateMany(
        {
          senderEmail: receiveremail,
          receiverEmail: senderemail,
        },
        {
          $set: { read: true },
        }
      );

      const messages = await ChatModel.find({
        $or: [
          { senderEmail: senderemail, receiverEmail: receiveremail },
          { senderEmail: receiveremail, receiverEmail: senderemail },
        ],
      }).sort({ createdAt: 1 });
      return messages || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async checkForVedioSession(
    trainer_id: any,
    client_id: any
  ): Promise<VedioSession[] | null> {
    try {
      const getSessionDetails = await SessionModel.find({
        trainerId: trainer_id,
        clientsId: { $in: [client_id] },
        endedAt: null,
      })
        .sort({ startedAt: -1 })
        .limit(1);

      console.log(getSessionDetails, "|||getSessionDetails");

      if (getSessionDetails) {
        return getSessionDetails;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async clientDetails(user_id: any): Promise<Client | null> {
    try {
      console.log(user_id, "clientDetails userrepo");
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
  async getTrainerDetails(trainer_Id: String): Promise<Trainer | null> {
    try {
      const trainerDetails = await TrainerModel.findOne({
        user_id: trainer_Id,
      });
      return trainerDetails || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async checkIfTrainer(trainer_Id: String): Promise<boolean> {
    try {
      const User = await UserModel.findOne({ _id: trainer_Id });
      if (User) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateSession(randomId: string, trainer_Id: string): Promise<boolean> {
    try {
      const sessionData = await SessionModel.findOne({ randomId });
      if (sessionData) {
        sessionData.endedAt = new Date();
        await sessionData.save();
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async removeWorkout(
    formattedDate: string,
    user_id: string
  ): Promise<Client | null> {
    try {
      let clientData = await ClientModel.findOne({ user_id });

      if (clientData) {
        clientData.workoutRoutines = clientData.workoutRoutines.filter(
          (routine: any) => routine.workoutDate !== formattedDate
        );
        await clientData.save();
        return clientData;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addBlog(blogDetails: Blog): Promise<boolean> {
    try {
      console.log(blogDetails, "repoffff");

      const newBlog = new BlogModel({
        title: blogDetails.title,
        user_id: blogDetails.user_id,
        author: blogDetails.author,
        content: blogDetails.content,
        imagePath: blogDetails.image,
      });
      if (newBlog) {
        // await newBlog.save();
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getBlogDetails(): Promise<any[] | null> {
    try {
      const blogDetails = await BlogModel.find().sort({ _id: -1 });

      if (blogDetails) {
        return blogDetails;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async viewBlogContent(_id: string): Promise<any> {
    try {
      const blogContent = await BlogModel.findOne({ _id });
      if (blogContent) {
        return blogContent;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
