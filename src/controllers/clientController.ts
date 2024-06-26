import { Request, Response } from "express";
import Trainer from "../entities/trainer";
import { clientUseCaseImpl } from "../usecases/clientUseCase";
import { request } from "https";
import { clientcontrollerInterface } from "../interfaces/clientInterface";
import { ParamsDictionary } from "express-serve-static-core";
import axios, { AxiosResponse } from "axios";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../jwt/generateToken";
import { ObjectId, Promise } from "mongoose";
import { promises } from "dns";
import ChatModel from "../models/chatmodel";
import dotenv from "dotenv";
import { promisify } from "util";
import cloudinary from "../helper/cloudinary";
dotenv.config();
const uploadToCloudinary = promisify(cloudinary.uploader.upload);

class clientcontrollerImpl implements clientcontrollerInterface {
  constructor(private clientUseCases: clientUseCaseImpl) {}

  async updateClientProfile(req: Request, res: Response): Promise<void> {
    try {
      const formData = req.body;
      const files = req.files as any;

      if (!files) {
        res.status(400).json({
          message: "Something went wrong, please try again",
        });
        return;
      }
      const uploadImage = async (file: Express.Multer.File) => {
        try {
          const result = await uploadToCloudinary(file.path);
          if (result?.secure_url) {
            return result.secure_url;
          }
          return null;
        } catch (err) {
          console.log(err);
          throw new Error("Error uploading image");
        }
      };

      if (files.profileImage && files.profileImage[0]) {
        formData.profileimage = await uploadImage(files.profileImage[0]);
      }

      if (files.bannerImage && files.bannerImage[0]) {
        formData.bannerImage = await uploadImage(files.bannerImage[0]);
      }

      const updateClientProfile = await this.clientUseCases.updateClientProfile(
        formData,
        files
      );

      if (updateClientProfile) {
        res.status(200).json({
          message: "profile updated",
          updated: true,
        });
      } else {
        res.status(200).json({
          message: "profile updated",
          updated: false,
        });
        return;
      }
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
    }
  }

  async getExercises(req: Request, res: Response): Promise<void> {
    try {
      const { offset } = req.body;

      const options = {
        method: "GET",
        url: process.env.RapidAPI_Url,
        params: { limit: "10", offset: offset },
        headers: {
          "X-RapidAPI-Key": process.env.RapidAPI_Key,
          "X-RapidAPI-Host": process.env.RapidAPI_Host,
        },
      };

      try {
        const response = await axios.request(options);
        let workoutList = response.data;
        res.status(200).json({
          message: " workout List updated",
          workoutList,
        });
        return;
      } catch (error) {
        console.error(error);
        res.status(200).json({
          message: "Error Getting Workout Listing",
          workoutList: "",
        });
        return;
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).send("Internal server error");
      return;
    }
  }
  async clientLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ message: "Missing required fields", validuser: false });
      return;
    }

    try {
      let user = await this.clientUseCases.checkemailexists(email);
      if (user) {
        let validuser = await this.clientUseCases.checkvaliduser(
          email,
          password
        );
        if (validuser) {
          let isblocked = await this.clientUseCases.checkisblocked(email);

          if (isblocked) {
            res.status(400).json({
              message: "Your Account has been blocked by the admin",
              validuser: false,
            });
            return;
          }
          let isAdmin = await this.clientUseCases.checkifAdmin(email);
          let userdata: Array<any>;

          let getcurrentuser = await this.clientUseCases.getcurrentuser(email);
          if (getcurrentuser) {
            //jwt
            let AccessToken = generateAccessToken(
              getcurrentuser.name,
              getcurrentuser.isAdmin,
              getcurrentuser._id,
              getcurrentuser.email
            );
            let RefreshToken = generateRefreshToken(
              getcurrentuser.name,
              getcurrentuser.isAdmin,
              getcurrentuser._id,
              getcurrentuser.email
            );
            if (isAdmin) {
              let skip = 0;
              let limit = 10;
              let client = "Client";
              userdata = await this.clientUseCases.getuserdetails(
                client,
                skip,
                limit
              );
              res.status(201).json({
                message: "user is valid",
                validuser: true,
                isAdmin,
                userdata,
                AccessToken,
                RefreshToken,
              });
              return;
            }
            let userdetails = await this.clientUseCases.getuser(email);
            if (!userdetails) {
              res.status(400).json({
                message: "Incorrect Password,Try Again",
                validuser: false,
              });
              return;
            }
            if (userdetails._id) {
              if (userdetails.role === "trainer") {
                if (userdetails) {
                  res.status(201).json({
                    message: "user is valid",
                    validuser: true,
                    isAdmin,

                    role: "trainer",
                  });
                  return;
                }
              } else if (userdetails.role === "Client") {
                let ClientDetails = await this.clientUseCases.clientDetails(
                  userdetails._id
                );

                if (userdetails) {
                  res.status(201).json({
                    message: "user is valid",
                    validuser: true,
                    isAdmin,
                    AccessToken,
                    RefreshToken,
                    role: "Client",
                    userdetails,
                    clientDetails: ClientDetails,
                  });
                  return;
                }
              }
            }

            res.status(201).json({
              message: "user is valid",
              validuser: true,
              isAdmin,
              AccessToken,
              RefreshToken,
            });
            return;
          }
        } else {
          res.status(400).json({
            message: "Incorrect Password,Try Again",
            validuser: false,
          });
          return;
        }
      } else {
        res.status(400).json({
          message: "Wrong Email or password.Please try again",
          validuser: false,
        });
        return;
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async getChatList(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.body;

      const getcurrentuser = await this.clientUseCases.clientDetails(user_id);
      let chatlist: any = [];
      let clientChatList: any = [];
      if (getcurrentuser && getcurrentuser.followers) {
        let followers = getcurrentuser.followers;
        console.log(followers, "followers");
        for (const follower of followers) {
          const data = await this.clientUseCases.getChatList(follower);
          clientChatList.push(data);
        }
        clientChatList.forEach((list: any) => {
          let val = {
            name: list.name,
            _id: list._id,
            email: list.email,
            bio: list.Bio,
            profileimage: list.profileimage,
          };
          chatlist.push(val);
        });

        res.status(200).json({ message: "Success", chatlist });
        return;
      }
      res.status(400).json({ message: "Cannot get  message details" });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
}
export { clientcontrollerImpl };
