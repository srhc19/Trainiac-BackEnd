import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import User from "../entities/user";
import Trainer from "../entities/trainer";
import { CreateUserUseCaseImpl } from "../usecases/CreateUserUseCase";
import { request } from "https";
import bcrypt from "bcrypt";
import { UserControllerinterface } from "../interfaces/userinterface";
import * as jwt from "jsonwebtoken";
import { generateAccessToken } from "../jwt/generateToken";
import * as nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Claims } from "../interfaces/userinterface";
import { LocalStorage } from "node-localstorage";

// Create a localStorage instance
const localStorage = new LocalStorage("./scratch");

import Client from "../entities/client";
import { razorpay } from "../helper/razorpay";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.email, // Your email address
    pass: process.env.password, // Your email password (use an application-specific password for security)
  },
});

class UserControllerImpl implements UserControllerinterface {
  constructor(private createUserUseCase: CreateUserUseCaseImpl) {}

  private async sendOTPEmail(email: string, otp: number): Promise<void> {
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Verify your Email From Trainiac",
      html: `Your OTP is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
  }

  async register(req: Request, res: Response): Promise<void> {
    const { name, password, role, email, captcha } = req.body;

    if (!name || !password || !role || !email) {
      res
        .status(200)
        .json({ message: "Missing required fields", registered: false });
      return;
    }
    const secretKey = process.env.Capcha_Secret;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;
    const response = await axios.post(verifyUrl);
    if (!response.data.success) {
      res
        .status(400)
        .json({ success: false, message: "CAPTCHA verification failed." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    await this.sendOTPEmail(email, otp);

    localStorage.setItem("email", email);
    const otpExpirationTime = new Date(Date.now() + 60 * 1000);

    try {
      const userExists = await this.createUserUseCase.checkemailexists(email);
      console.log(userExists);
      if (userExists) {
        res.status(200).json({
          message: "Email already exists. Please log in.",
          registered: false,
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user: User = {
        name,
        password: hashedPassword,
        role,
        email,
        isAdmin: false,
        isblocked: false,
        isVerified: false,
        otp,
        otpExpirationTime,
      };

      let newUser = await this.createUserUseCase.registeruser(user);
      if (newUser && newUser.role === "trainer") {
        let trainer = {
          name: newUser.name,
          user_id: newUser._id,
          email: newUser.email,
          Bio: "",
          description: "",
          skills: [],
          certificates: [],
          bannerImage: "",
          profileimage: "",
          certificateImages: [],
          followers: [],
        };
        await this.createUserUseCase.addTrainer(trainer);
      } else if (newUser.role === "Client") {
        let client = {
          name: newUser.name,
          user_id: newUser._id,
          email: newUser.email,
          Bio: "",
          description: "",
          goals: [],
          bannerImage: "",
          profileimage: "",
          trainers: [],
          followers: [],
        };
        await this.createUserUseCase.addClient(client);
      }

      res
        .status(201)
        .json({ message: "User created successfully", registered: true });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // async login(req: Request, res: Response): Promise<void> {
  //   const { email, password } = req.body;

  //   if (!email || !password) {
  //     res
  //       .status(400)
  //       .json({ message: "Missing required fields", validuser: false });
  //     return;
  //   }

  //   try {
  //     let user = await this.createUserUseCase.checkemailexists(email);
  //     if (user) {
  //       let validuser = await this.createUserUseCase.checkvaliduser(
  //         email,
  //         password
  //       );
  //       if (validuser) {
  //         let isblocked = await this.createUserUseCase.checkisblocked(email);
  //         if (isblocked) {
  //           res.status(400).json({
  //             message: "Your Account has been blocked by the admin",
  //             validuser: false,
  //           });
  //           return;
  //         }
  //         let isAdmin = await this.createUserUseCase.checkifAdmin(email);
  //         let userdata: Array<any>;

  //         let getcurrentuser = await this.createUserUseCase.getcurrentuser(
  //           email
  //         );
  //         if (getcurrentuser) {
  //           //jwt
  //           let AccessToken = generateAccessToken(
  //             getcurrentuser.name,
  //             getcurrentuser.isAdmin
  //           );
  //           if (isAdmin) {
  //             let skip = 0;
  //             let limit = 10;
  //             let client = "Client";
  //             userdata = await this.createUserUseCase.getuserdetails(
  //               client,
  //               skip,
  //               limit
  //             );
  //             res.status(201).json({
  //               message: "user is valid",
  //               validuser: true,
  //               isAdmin,
  //               userdata,
  //               AccessToken,
  //             });
  //             return;
  //           }
  //           let userdetails = await this.createUserUseCase.getuser(email);
  //           if (!userdetails) {
  //             res.status(400).json({
  //               message: "Incorrect Password,Try Again",
  //               validuser: false,
  //             });
  //             return;
  //           }
  //           if (userdetails._id) {
  //             if (userdetails.role === "trainer") {
  //               let trainerDetails =
  //                 await this.createUserUseCase.trainerDetails(userdetails._id);
  //               if (userdetails) {
  //                 res.status(201).json({
  //                   message: "user is valid",
  //                   validuser: true,
  //                   isAdmin,
  //                   AccessToken,
  //                   role: "trainer",
  //                   userdetails,
  //                   trainerDetails,
  //                 });
  //                 return;
  //               }
  //             } else if (userdetails.role === "Client") {
  //               let ClientDetails = await this.createUserUseCase.clientDetails(
  //                 userdetails._id
  //               );

  //               if (userdetails) {
  //                 res.status(201).json({
  //                   message: "user is valid",
  //                   validuser: true,
  //                   isAdmin,
  //                   AccessToken,
  //                   role: "Client",
  //                   userdetails,
  //                   clientDetails: ClientDetails,
  //                 });
  //                 return;
  //               }
  //             }
  //           }

  //           res.status(201).json({
  //             message: "user is valid",
  //             validuser: true,
  //             isAdmin,
  //             AccessToken,
  //           });
  //           return;
  //         }
  //       } else {
  //         res.status(400).json({
  //           message: "Incorrect Password,Try Again",
  //           validuser: false,
  //         });
  //         return;
  //       }
  //     } else {
  //       res
  //         .status(400)
  //         .json({ message: "Missing required fields", validuser: false });
  //       return;
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: "Internal server error" });
  //     return;
  //   }
  // }

  async getUserdata(req: Request, res: Response): Promise<void> {
    try {
      let { role, skip, limit } = req.body;

      let userdata = await this.createUserUseCase.getuserdetails(
        role,
        skip,
        limit
      );

      if (userdata) {
        res.status(201).json({
          userdata,
        });
        return;
      } else {
        res.status(400).json({ message: "Missing required fields", userdata });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      let { email } = req.body;

      if (!email) {
        res.status(400).json({ message: "Internal server error" });
        return;
      }

      const userExists = await this.createUserUseCase.checkemailexists(email);

      if (!userExists) {
        res.status(400).json({ message: "Wrong Email .Please try again" });
        return;
      }
      localStorage.setItem("email", email);
      const otp = Math.floor(1000 + Math.random() * 9000);

      await this.sendOTPEmail(email, otp);

      const otpExpirationTime = new Date(Date.now() + 60 * 1000);

      await this.createUserUseCase.verifystoreEmailOtp(
        otp,
        otpExpirationTime,
        email
      );
      res.status(200).json({ message: "email verified" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { otp } = req.body;

      const email = localStorage.getItem("email");

      if (!email) {
        res.status(400).json({ message: "Email not found in localStorage" });
        return;
      }

      const otpDetails = await this.createUserUseCase.getotpdetails(email);

      if (!otpDetails) {
        res.status(404).json({ message: "OTP details not found" });
        return;
      }

      const currentTime = Date.now();
      if (currentTime > otpDetails.otpExpirationTime.getTime()) {
        res.status(200).json({ message: "OTP has expired" });
        return;
      }

      // Verify OTP
      if (Number(otp) === otpDetails.otp) {
        await this.createUserUseCase.updateVerifyUser(email);
        res.status(200).json({
          isVerified: true,
          message: "User is verified",
          role: otpDetails.role,
        });
      } else {
        res.status(200).json({ isVerified: false, message: "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async changeUserStatus(req: Request, res: Response): Promise<void> {
    const { _id } = req.body;
    //blockandunblock

    if (!_id) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Invoke use case
    try {
      await this.createUserUseCase.changeUserStatus(_id);
      res.status(201).json({ message: "User status Updated" });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
  async resendotp(req: Request, res: Response): Promise<void> {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const email = localStorage.getItem("email");

      if (email) {
        await this.sendOTPEmail(email, otp);

        const otpExpirationTime = new Date(Date.now() + 60 * 1000);
        await this.createUserUseCase.resendotp(otp, otpExpirationTime, email);

        res.status(201).json({ message: "New OTP created" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async verifyEmailOtp(req: Request, res: Response): Promise<void> {
    try {
      let { otp } = req.body;

      if (!otp) {
        res.status(400).json({ message: "otp is not found" });
      }

      const email = localStorage.getItem("email");

      if (!email) {
        res.status(400).json({ message: "Email not found in localStorage" });
        return;
      }

      const otpDetails = await this.createUserUseCase.getotpdetails(email);

      if (!otpDetails) {
        res.status(404).json({ message: "OTP details not found" });
        return;
      }
      const currentTime = Date.now();
      if (currentTime > otpDetails.otpExpirationTime.getTime()) {
        res.status(200).json({ message: "OTP has expired" });
        return;
      }

      // Verify OTP
      if (Number(otp) === otpDetails.otp) {
        res.status(200).json({ Verified: true, message: "User is verified" });
      } else {
        res.status(200).json({ Verified: false, message: "Invalid OTP" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const { newPassword } = req.body;

      const email = localStorage.getItem("email");

      if (email) {
        const hashedPwrd = await bcrypt.hash(newPassword, 10);

        const updated = await this.createUserUseCase.updatePassword(
          hashedPwrd,
          email
        );
        const userdata = await this.createUserUseCase.getuser(email);
        if (updated && userdata) {
          res.status(200).json({
            message: "password updated",
            updated: true,
            role: userdata.role,
          });
          return;
        }

        res.status(200).json({
          message: " Something went wrong ; password not updated",
          updated: false,
        });
        return;
      }

      res
        .status(200)
        .json({ message: "password is notupdated", updated: false });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const { _id, skip, limit } = req.body;
      if (!_id) {
        res
          .status(400)
          .json({ message: "something went wrong please try agai" });
      }

      const trainer = await this.createUserUseCase.getCurrentUser(_id);

      let clientDetails: Client[] = [];
      if (trainer) {
        const clientPromises = trainer.clients.map(async (email) => {
          const data = await this.createUserUseCase.clientDetailsWithEmail(
            email
          );

          if (data) {
            clientDetails.push(data);
          }
        });

        await Promise.all(clientPromises);
      }

      const paginatedClientDetails = clientDetails.slice(skip, skip + limit);

      res.status(200).json({
        message: "Client details updated",
        clientDetails: paginatedClientDetails,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCurrentTrainer(req: Request, res: Response): Promise<void> {
    try {
      let { user_id } = req.body;

      let currentTrainer = await this.createUserUseCase.trainerDetails(user_id);

      if (currentTrainer) {
        res.status(200).json({
          message: "current trainer details updated",
          currentTrainer,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCurrentClient(req: Request, res: Response): Promise<void> {
    try {
      let { user_id } = req.body;
      if (!user_id) {
        res
          .status(401)
          .json({ message: "Something went wrong please try again" });
      }
      let currentClient = await this.createUserUseCase.clientDetails(user_id);

      if (currentClient) {
        res.status(200).json({
          message: "current trainer details updated",
          currentClient,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async razorpay(req: Request, res: Response): Promise<void> {
    const amount = req.body.amount * 100; // Convert to paise
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export { UserControllerImpl };
