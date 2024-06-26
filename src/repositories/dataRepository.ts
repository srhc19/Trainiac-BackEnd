import { ObjectId } from "mongoose";
import Client from "../entities/client";
import { BlogList } from "../interfaces/adminInterface";
import { dataRepository, orderInterface } from "../interfaces/dataInterface";
import BlogModel from "../models/blogmodel";
import PaymentModel from "../models/paymentmodel";
import SessionModel from "../models/sessionmodel";
import UserModel from "../models/usermodel";
import TrainerModel from "../models/trainermodel";
import ClientModel from "../models/clientmodel";
import Trainer from "../entities/trainer";
import User from "../entities/user";

export default class dataRepositoryImp implements dataRepository {
  async bloglistSearch(query: string): Promise<any> {
    try {
      const blogList = await BlogModel.find({
        title: { $regex: query, $options: "i" },
        status: "Approved",
      }).limit(10);
      if (blogList) {
        return blogList;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async adminclientSearch(query: string): Promise<any> {
    try {
      const userdata = await UserModel.find({
        name: { $regex: query, $options: "i" },
        role: "Client",
      }).limit(10);
      if (userdata) {
        return userdata;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async adminTrainerSearch(query: string): Promise<any> {
    try {
      const userdata = await UserModel.find({
        name: { $regex: query, $options: "i" },
        role: "trainer",
      }).limit(10);
      if (userdata) {
        return userdata;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async adminBlogSearch(query: string): Promise<any> {
    try {
      const blogList = await BlogModel.find({
        title: { $regex: query, $options: "i" },
      }).limit(10);
      if (blogList) {
        return blogList;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async adminSessionSearch(query: string): Promise<any> {
    try {
      const sessionData = await SessionModel.find({
        title: { $regex: query, $options: "i" },
      }).limit(10);
      if (sessionData) {
        return sessionData;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getuserdata(userid: string): Promise<any> {
    try {
      const userData = await UserModel.findOne({ _id: userid });

      if (userData) {
        return userData;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addPaymentDetails(
    order_id: string,

    _id: ObjectId,
    email: string
  ): Promise<boolean> {
    try {
      const newdata = new PaymentModel({
        order_id,

        userEmail: email,
        user_id: _id,
      });

      await newdata.save();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async updateOrder(order_id: string): Promise<any> {
    try {
      const order = await PaymentModel.findOne({ order_id });
      if (order) {
        order.status = "Success";
        await order.save();
        console.log(order, "get order in data repo");
        return order;
      }
      return null;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async updatetrainerdb(updatedOrder: orderInterface): Promise<boolean> {
    try {
      let id = updatedOrder.user_id;
      const data = await TrainerModel.findOne({ user_id: id });
      if (data) {
        data.premium.paid = true;
        data.premium.method = "Razorpay";
        data.premium.orderid = updatedOrder.order_id;
        await data.save();
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getPaymentData(limit: number, skip: number): Promise<any> {
    try {
      const data = await PaymentModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      if (data) {
        return data;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async removeCertificateImages(
    certImage: string,
    user_id: string
  ): Promise<boolean> {
    try {
      const data = await TrainerModel.findOne({ user_id });
      if (data) {
        data.certificateImages = data.certificateImages.filter(
          (image: any) => image !== certImage
        );
        await data.save();
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateClientProfile(formData: any): Promise<boolean> {
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

  async sendRequestTrainer(
    client_id: string,
    trainer_id: string
  ): Promise<boolean> {
    try {
      const createdAt = new Date();
      const clientData = await ClientModel.findOne({ user_id: client_id });

      const trainerData = await TrainerModel.findOne({ user_id: trainer_id });
      if (clientData && trainerData) {
        const requestSended = {
          trainer_id,
          createdAt,
          accepted: false,
        };
        clientData.requestSended.push(requestSended);
        await clientData.save();

        const requests = {
          client_id,
          clientName: clientData.name,
          clientEmail: clientData.email,
          goals: clientData.goals,
          createdAt,
          status: false,
        };

        trainerData.requests.push(requests);
        await trainerData.save();
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getClientData(client_id: string): Promise<Client | null> {
    try {
      const clienData = await ClientModel.findOne({ user_id: client_id });
      if (clienData) {
        return clienData;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getclientsRequest(user_id: string): Promise<any> {
    try {
      const clientRequest = await TrainerModel.findOne({ user_id });
      if (clientRequest) {
        return clientRequest.requests;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async acceptRequestStatus(
    client_id: string,
    trainer_id: string
  ): Promise<boolean> {
    try {
      const trainerData = await TrainerModel.findOneAndUpdate(
        {
          $and: [{ user_id: trainer_id }, { "requests.client_id": client_id }],
        },
        {
          $set: { "requests.$.status": true },
        },
        { new: true }
      );

      const clientData = await ClientModel.findOneAndUpdate(
        {
          $and: [
            { user_id: client_id },
            { "requestSended.trainer_id": trainer_id },
          ],
        },
        {
          $set: { "requestSended.$.accepted": true },
        },
        { new: true }
      );

      if (trainerData && clientData) {
        if (!trainerData.clients.includes(clientData.email as string)) {
          trainerData.clients.push(clientData.email as string);
          await trainerData.save();
        }

        if (!clientData.trainers.includes(trainerData.email)) {
          clientData.trainers.push(trainerData.email as string);
          await clientData.save();
        }
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async removeRequestStatus(
    client_id: string,
    trainer_id: string
  ): Promise<boolean> {
    try {
      const trainerData = await TrainerModel.findOneAndUpdate(
        {
          $and: [{ user_id: trainer_id }, { "requests.client_id": client_id }],
        },
        {
          $set: { "requests.$.status": false },
        },
        { new: true }
      );

      const clientData = await ClientModel.findOneAndUpdate(
        {
          $and: [
            { user_id: client_id },
            { "requestSended.trainer_id": trainer_id },
          ],
        },
        {
          $set: { "requestSended.$.accepted": false },
        },
        { new: true }
      );

      if (trainerData && clientData) {
        const clientEmailIndex = trainerData.clients.indexOf(
          clientData.email as string
        );
        if (clientEmailIndex > -1) {
          trainerData.clients.splice(clientEmailIndex, 1);
          await trainerData.save();
        }

        const trainerEmailIndex = clientData.trainers.indexOf(
          trainerData.email
        );
        if (trainerEmailIndex > -1) {
          clientData.trainers.splice(trainerEmailIndex, 1);
          await clientData.save();
        }
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async clientRequestSearch(query: string): Promise<any> {
    try {
      console.log("query in data repo", query);
      const results = await TrainerModel.aggregate([
        {
          $match: {
            $or: [
              { "requests.clientEmail": { $regex: query, $options: "i" } },
              { "requests.clientName": { $regex: query, $options: "i" } },
            ],
          },
        },
        {
          $project: {
            requests: {
              $filter: {
                input: "$requests",
                as: "request",
                cond: {
                  $or: [
                    {
                      $regexMatch: {
                        input: "$$request.clientEmail",
                        regex: query,
                        options: "i",
                      },
                    },
                    {
                      $regexMatch: {
                        input: "$$request.clientName",
                        regex: query,
                        options: "i",
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      ]).limit(10);

      console.log(results);
      if (results) {
        return results;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getMessageReciverData(
    receiveremail: string
  ): Promise<Client | Trainer | null> {
    try {
      const data = await UserModel.findOne({ email: receiveremail });
      if (data) {
        if (data.role === "trainer") {
          const user = await TrainerModel.findOne({ email: receiveremail });
          if (user) {
            return user;
          }
        } else if (data.role === "Client") {
          const user = await ClientModel.findOne({ email: receiveremail });
          if (user) {
            return user;
          }
        }
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addtoMessageList(data: User, email: string): Promise<boolean> {
    console.log("addtomessage list repo");
    try {
      if (data.role === "trainer") {
        const trainerdata = await TrainerModel.findOne({ user_id: data._id });
        if (!trainerdata?.messages.includes(email)) {
          trainerdata?.messages.push(email);
        }
        if (!trainerdata?.followers.includes(email)) {
          trainerdata?.followers.push(email);
        }
        await trainerdata?.save();
        return true;
      } else if (data.role === "Client") {
        const clientdata = await ClientModel.findOne({ user_id: data._id });
        if (!clientdata?.messages.includes(email)) {
          clientdata?.messages.push(email);
        }

        if (!clientdata?.followers.includes(email)) {
          clientdata?.followers.push(email);
        }
        await clientdata?.save();
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async isUserBlocked(user_id: string): Promise<boolean> {
    try {
      const data = await UserModel.findOne({ _id: user_id });
      if (data?.isblocked) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async isUserAdmin(user_id: string): Promise<boolean> {
    try {
      const data = await UserModel.findOne({ _id: user_id });
      if (data) {
        return data.isAdmin;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
