import { ObjectId } from "mongoose";
import {
  AdminRepositoryInterface,
  BlogList,
  ProgressData,
  session1,
} from "../interfaces/adminInterface";
import { Blog, BlogContent } from "../interfaces/chatInterface";
import BlogModel from "../models/blogmodel";
import ClientModel from "../models/clientmodel";
import ProgressModel from "../models/progressmodel";
import SessionModel from "../models/sessionmodel";
import UserModel from "../models/usermodel";
import Client from "../entities/client";
import TrainerModel from "../models/trainermodel";
import Trainer from "../entities/trainer";

export default class adminRepositoryImpl implements AdminRepositoryInterface {
  async changeBlogStatus(_id: string): Promise<any> {
    try {
      const blog = await BlogModel.findOne({ _id });
      if (blog) {
        blog.status = "Approved";
        await blog.save();

        return blog;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async cancelBlog(_id: string, note: string): Promise<any> {
    try {
      const blog = await BlogModel.findOne({ _id });
      if (blog) {
        blog.status = "Cancelled";
        blog.reason = note;
        await blog.save();

        return blog;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBlogList(skip: number, limit: number): Promise<any> {
    try {
      const blogList = await BlogModel.find({ status: "Approved" })
        .skip(skip)
        .limit(limit);
      if (blogList) {
        return blogList;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getBlogUserDetails(_id: string): Promise<string | null> {
    try {
      const userData = await UserModel.findOne({ _id });
      if (userData) {
        return userData.email;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async currentTrainerBlogList(
    user_id: string,
    skip: number,
    limit: number
  ): Promise<any> {
    try {
      const blogData = await BlogModel.find({ user_id })
        .skip(skip)
        .limit(limit);
      if (blogData) {
        return blogData;
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
        await newBlog.save();
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addProgress(progressData: ProgressData): Promise<boolean> {
    try {
      const existingEntry = await ProgressModel.findOne({
        user_id: progressData.user_id,
        createdAt: progressData.createdAt,
      });

      if (existingEntry) {
        console.log("Progress data for this date already exists.");
        return false;
      }

      const newData = new ProgressModel(progressData);
      await newData.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getProgressData(user_id: string): Promise<any> {
    try {
      const progressData = await ProgressModel.find({ user_id });
      if (progressData) {
        return progressData;
      }
      return null;
      7;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getprogressDetails(_id: string): Promise<any> {
    try {
      const progressDetails = await ProgressModel.findOne({ _id });
      if (progressDetails) {
        return progressDetails;
      }
      return null;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getSessionList(): Promise<any> {
    try {
      const sessionData = await SessionModel.find();
      if (sessionData) {
        return sessionData;
      }
      return null;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getclientnames(clientsIds: ObjectId[]): Promise<any> {
    try {
      const clients = await ClientModel.find({
        _id: { $in: clientsIds },
      }).select("name");
      if (clients) {
        return clients;
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async gettrainername(trainerId: ObjectId): Promise<any> {
    try {
      const trainername = await TrainerModel.findOne({
        user_id: trainerId,
      }).select("name");
      if (trainername) {
        return trainername;
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async checkIfClient(id: ObjectId): Promise<boolean> {
    try {
      const isclient = await ClientModel.findOne({ user_id: id });
      if (isclient) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getTrainerData(email: string): Promise<Trainer | null> {
    try {
      const trainerData = await TrainerModel.findOne({ email });
      if (trainerData) {
        return trainerData;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async addTestimonial(content: string, user_id: string): Promise<boolean> {
    try {
      const clientDetail = await ClientModel.findOne({ user_id });
      if (clientDetail) {
        let testimonial = {
          name: clientDetail.name,
          email: clientDetail.email,
          user_id: clientDetail.user_id,
          content,
        };
        const email = clientDetail.trainers[0];
        const trainerData = await TrainerModel.findOne({ email });
        trainerData?.testimonials.push(testimonial);
        await trainerData?.save();
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getTestimonial(trainerId: string): Promise<Trainer | null> {
    try {
      const getData = await TrainerModel.findOne({ user_id: trainerId });
      if (getData) {
        return getData;
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async trainerlist(skip: number, limit: number): Promise<any> {
    try {
      const trainerlist = await TrainerModel.find().skip(skip).limit(limit);

      if (trainerlist) {
        return trainerlist;
      }
    } catch (error) {
      console.error("Error :", error);
    }
  }

  async updateProgress(updatedData: any, _id: string): Promise<any> {
    try {
      let value = await ProgressModel.findOne({ _id });
      console.log(value, "///");
      if (!value) {
        console.error("Document not found");
        return false;
      }

      Object.assign(value, updatedData);

      await value.save();

      return true;
    } catch (error) {
      console.error("Error :", error);
    }
  }

  async trainerlistSearch(query: string): Promise<any> {
    try {
      const list = await TrainerModel.find({
        name: { $regex: query, $options: "i" },
      });
      if (list) {
        return list;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBlogDetails(skip: number, limit: number): Promise<any[] | null> {
    try {
      const blogDetails = await BlogModel.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
      if (blogDetails) {
        return blogDetails;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

// {
//   "_id": {
//     "$oid": "665057ec9ba7df0ca54ca956"
//   },
//   "user_id": {
//     "$oid": "6630ca4edb5cc844bde4da29"
//   },
//   "currentWeight": 70,
//   "waist": 75,
//   "hips": 95,
//   "chest": 100,
//   "arms": 35,
//   "legs": 55,
//   "calves": 38,
//   "forearms": 30,
//   "bodyFatPercentage": 20,
//   "frontPhoto": "https://res.cloudinary.com/dvv07qcay/image/upload/v1716541418/sz8yqo7zpfrwagzxbjep.jpg",
//   "sidePhoto": "https://res.cloudinary.com/dvv07qcay/image/upload/v1716541419/fuz82apknrn9qrpsnesc.jpg",
//   "backPhoto": "https://res.cloudinary.com/dvv07qcay/image/upload/v1716541420/j1ipledwa1cic1in6bux.jpg",
//   "createdAt": {
//     "$date": "2024-05-24T00:00:00.000Z"
//   },
//   "__v": 0
// }
