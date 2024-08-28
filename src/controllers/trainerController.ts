import { Request, Response } from "express";
import Trainer from "../entities/trainer";
import { request } from "https";
import { LocalStorage } from "node-localstorage";
import { TrainerControllerInterface } from "../interfaces/trainerInterface";
import { TrainerUseCaseImpl } from "../usecases/trainerUseCase";
import { ObjectId } from "mongoose";
const localStorage = new LocalStorage("./scratch");

import {
  generateAccessToken,
  generateRefreshToken,
} from "../jwt/generateToken";
import cloudinary from "../helper/cloudinary";
import { promisify } from "util";
import { UploadedImages } from "../interfaces/adminInterface";
const uploadToCloudinary = promisify(cloudinary.uploader.upload);
class TrainerControllerImpl implements TrainerControllerInterface {
  constructor(private trainerUseCase: TrainerUseCaseImpl) {}

  async addnewClient(req: Request, res: Response): Promise<void> {
    try {
      const { trainerid, clientName, clientEmail } = req.body;
      if (!trainerid || !clientName || !clientEmail) {
        res.status(401).json({
          message: "Something went Wrong .Please Try Again ",
          valid: false,
        });
        return;
      }

      const userExists = await this.trainerUseCase.checkemailexists(
        clientEmail
      );
      if (!userExists) {
        //401 unautherised
        res.status(401).json({
          message: "Email id is not valid.Please check the email ",
          valid: false,
        });
        return;
      }
      const getTrainerDetailsAndUpdate =
        await this.trainerUseCase.getTrainerDetails(trainerid, clientEmail);
      if (getTrainerDetailsAndUpdate) {
        res.status(200).json({
          message: "Client successfully added to client list ",
          valid: true,
        });
        return;
      }
      // 409 Conflict
      res.status(401).json({
        message: "Something went Wrong,Please try again",
        valid: false,
      });
      return;
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
      return;
    }
  }
  async getClientList(req: Request, res: Response): Promise<void> {
    try {
      const { trainerid } = req.body;

      if (!trainerid) {
        //401 unautherised
        res.status(401).json({
          message: "Something went Wrong .Please Try Again ",
          valid: false,
        });
        return;
      }

      let clientlist = await this.trainerUseCase.getClientList(trainerid);
      console.log(clientlist);

      if (clientlist) {
        let clientData: Array<{ name: String; email: String; client_id: any }> =
          [];

        const clientPromises = clientlist.map(async (clientemail) => {
          try {
            const data = await this.trainerUseCase.getClientData(clientemail);
            if (data) {
              clientData.push({
                name: data.name,
                email: data.email,
                client_id: data.user_id,
              });
            }
          } catch (error) {
            console.error(
              "Error fetching client data for email:",
              clientemail,
              error
            );
          }
        });

        await Promise.all(clientPromises);

        console.log(clientData, "clientlist");
        res.status(200).json({
          message: "Client Data is Available",
          valid: true,
          clientData,
        });
        return;
      }
      res.status(404).json({
        message: "No clients found for this trainer",
        valid: false,
      });
      return;
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
    }
  }

  async addCardioWorkout(req: Request, res: Response): Promise<void> {
    try {
      const {
        trainerid,
        clientemail,
        workoutDate,
        activity,
        intensity,
        duration,
      } = req.body;
      console.log(req.body);
      if (
        !trainerid ||
        !clientemail ||
        !workoutDate ||
        !activity ||
        !intensity ||
        !duration
      ) {
        //401 unautherised
        res.status(401).json({
          message: "Something went Wrong .Please Try Again ",
          valid: false,
        });
        return;
      }
      let addcardioWorkout = await this.trainerUseCase.addCardioWorkout(
        trainerid,
        clientemail,
        workoutDate,
        activity,
        intensity,
        duration
      );
      if (addcardioWorkout) {
        res.status(200).json({
          message: "Workout added to client calender",
          workoutAdded: true,
        });
        return;
      }
      res.status(401).json({
        message: "Workout added to client calender",
        workoutAdded: false,
      });
      return;
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
    }
  }

  async addGymWorkout(req: Request, res: Response): Promise<void> {
    try {
      const { clientEmail, exercises, targetMuscleGroup, workoutDate } =
        req.body;

      if (!clientEmail || !exercises || !targetMuscleGroup || !workoutDate) {
        //401 unautherised
        res.status(401).json({
          message: "Something went Wrong .Please Try Again ",
          valid: false,
        });
        return;
      }
      let addGymWorkout = await this.trainerUseCase.addGymWorkout(
        clientEmail,
        exercises,
        targetMuscleGroup,
        workoutDate
      );
      console.log(addGymWorkout);
      if (addGymWorkout) {
        res.status(200).json({
          message: "Workout added to client calender",
          workoutAdded: true,
        });
        return;
      }
      res.status(200).json({
        message: "Failed to add workout to  client calender",
        workoutAdded: false,
      });
      return;
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
    }
  }
  async addYogaWorkout(req: Request, res: Response): Promise<void> {
    try {
      const { clientEmail, workoutDate, activity, duration } = req.body;

      if (!clientEmail || !workoutDate || !activity || !duration) {
        //401 unautherised
        res.status(401).json({
          message: "Something went Wrong .Please Try Again ",
          valid: false,
        });
        return;
      }
      let addYogaWorkout = await this.trainerUseCase.addYogaWorkout(
        clientEmail,
        workoutDate,
        activity,
        duration
      );

      if (addYogaWorkout) {
        res.status(200).json({
          message: "Workout added to client calender",
          workoutAdded: true,
        });
        return;
      }
      res.status(200).json({
        message: "Failed to add workout to  client calender",
        workoutAdded: false,
      });
      return;
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
    }
  }

  async updateTrainerProfile(req: Request, res: Response): Promise<void> {
    try {
      console.log("updateTrainerProfile");
      const formData = req.body;
      const files = req.files as any; // Assuming req.files is properly typed
      console.log(req.files);

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

      // Update form data with Cloudinary URLs
      if (files.profileImage && files.profileImage[0]) {
        formData.profileimage = await uploadImage(files.profileImage[0]);
      }

      if (files.bannerImage && files.bannerImage[0]) {
        formData.bannerImage = await uploadImage(files.bannerImage[0]);
      }

      if (files.certificateImages) {
        formData.certificateImages = [];
        for (const file of files.certificateImages) {
          const url = await uploadImage(file);
          if (url) {
            formData.certificateImages.push(url);
          }
        }
      }

      const updateTrainerProfile =
        await this.trainerUseCase.updateTrainerProfile(formData);

      if (updateTrainerProfile) {
        res.status(200).json({
          message: "Profile updated",
          updated: true,
        });
      } else {
        res.status(200).json({
          message: "Profile update failed",
          updated: false,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again.",
      });
    }
  }

  async trainerLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    console.log(email, password, "details trainerlogin");
    if (!email || !password) {
      res
        .status(400)
        .json({ message: "Missing required fields", validuser: false });
      return;
    }

    try {
      console.log(email);
      let user = await this.trainerUseCase.checkemailexists(email);
      console.log(user, "user");
      if (user) {
        let validuser = await this.trainerUseCase.checkvaliduser(
          email,
          password
        );
        if (validuser) {
          let isblocked = await this.trainerUseCase.checkisblocked(email);
          console.log(isblocked, "isblocked");
          if (isblocked) {
            res.status(400).json({
              message: "Your Account has been blocked by the admin",
              validuser: false,
            });
            return;
          }
          let isAdmin = await this.trainerUseCase.checkifAdmin(email);
          let userdata: Array<any>;

          let getcurrentuser = await this.trainerUseCase.getcurrentuser(email);
          if (getcurrentuser) {
            console.log("getcurrentuser");
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
              userdata = await this.trainerUseCase.getuserdetails(
                client,
                skip,
                limit
              );
              res.status(201).json({
                message: "user is valid",
                validuser: true,
                isAdmin,
                userdata,
              });
              return;
            }
            let userdetails = await this.trainerUseCase.getuser(email);
            console.log(userdetails, "usaerdetails");
            if (!userdetails) {
              res.status(400).json({
                message: "Incorrect Password,Try Again",
                validuser: false,
              });
              return;
            }
            if (userdetails._id) {
              if (userdetails.role === "trainer") {
                let trainerDetails = await this.trainerUseCase.trainerDetails(
                  userdetails._id
                );
                if (userdetails) {
                  res.status(201).json({
                    message: "user is valid",
                    validuser: true,
                    isAdmin,
                    AccessToken,
                    RefreshToken,
                    role: "trainer",
                    userdetails,
                    trainerDetails,
                  });
                  return;
                }
              } else if (userdetails.role === "Client") {
                if (userdetails) {
                  res.status(201).json({
                    message: "user is valid",
                    validuser: true,
                    isAdmin,
                    AccessToken,
                    RefreshToken,
                    role: "Client",
                    userdetails,
                    clientDetails: "",
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
          message: "wrong email or password .please try again",
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

      const getcurrentuser = await this.trainerUseCase.trainerDetails(user_id);
      let chatlist: any = [];
      let clientChatList: any = [];
      console.log(getcurrentuser, "getcurre");
      if (getcurrentuser && getcurrentuser.followers) {
        let followers = getcurrentuser.followers;
        console.log(followers, "followers");
        for (const follower of followers) {
          const data = await this.trainerUseCase.getChatList(follower);
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

  async startVedioSession(req: Request, res: Response): Promise<void> {
    try {
      let { vedioSessionClientsId, trainer_id, randomid } = req.body;
      if (!vedioSessionClientsId || !trainer_id) {
        res.status(400).json({ message: "something went wrong try again" });
      }

      let sessiondetails = await this.trainerUseCase.startVedioSession(
        vedioSessionClientsId,
        trainer_id,
        randomid
      );
      if (sessiondetails) {
        res.status(200).json({
          message: "session succesfully added to db",
          sessionAdded: true,
        });
        return;
      }
      res.status(400).json({
        message: "Failed to add session to db ,Please try again",
        sessionAdded: false,
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export { TrainerControllerImpl };
