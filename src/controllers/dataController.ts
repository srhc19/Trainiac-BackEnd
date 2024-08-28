import { dataController, dataUseCases } from "../interfaces/dataInterface";
import { Request, Response } from "express";
import { dataUseCaseImpl } from "../usecases/dataUseCases";
import { razorpay } from "../helper/razorpay";
import * as nodemailer from "nodemailer";
import dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import cloudinary from "../helper/cloudinary";
import { promisify } from "util";
import { generateAccessToken } from "../jwt/generateToken";
const uploadToCloudinary = promisify(cloudinary.uploader.upload);

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.email, // Your email address
    pass: process.env.password, // Your email password (use an application-specific password for security)
  },
});
class dataControllerImpl implements dataController {
  constructor(private dataUseCase: dataUseCaseImpl) {}

  private async sendOTPEmail(
    email: string,
    trainername: string,
    action: string
  ): Promise<void> {
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Message from Trainiac",
      html: `${trainername} ${action} your request`,
    };
    await transporter.sendMail(mailOptions);
  }

  async adminclientSearch(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      if (!query) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }
      const userdata = await this.dataUseCase.adminclientSearch(query);
      if (userdata) {
        res.status(200).json({ message: "success", userdata });
        return;
      }
      res.status(400).json({ message: "Failed to get data" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Server Error ,Please try again" });
      return;
    }
  }

  async bloglistSearch(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      if (!query) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }
      const blogList = await this.dataUseCase.bloglistSearch(query);
      if (blogList) {
        res.status(200).json({ message: "success", blogList });
        return;
      }
      res.status(400).json({ message: "Failed to get data" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Server Error ,Please try again" });
      return;
    }
  }

  async adminTrainerSearch(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      if (!query) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }
      const userdata = await this.dataUseCase.adminTrainerSearch(query);
      if (userdata) {
        res.status(200).json({ message: "success", userdata });
        return;
      }
      res.status(400).json({ message: "Failed to get data" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Server Error ,Please try again" });
      return;
    }
  }

  async adminBlogSearch(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      if (!query) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }
      const blogList = await this.dataUseCase.adminBlogSearch(query);
      if (blogList) {
        res.status(200).json({ message: "success", blogList });
        return;
      }
      res.status(400).json({ message: "Failed to get data" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Server Error ,Please try again" });
      return;
    }
  }
  async adminSessionSearch(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      if (!query) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }
      const sessionData = await this.dataUseCase.adminSessionSearch(query);
      if (sessionData) {
        res.status(200).json({ message: "success", sessionData });
        return;
      }
      res.status(400).json({ message: "Failed to get data" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Server Error ,Please try again" });
      return;
    }
  }

  async razorpay(req: Request, res: Response): Promise<void> {
    const amount = req.body.amount * 100; // Convert to paise
    const { userid } = req.body;
    console.log(userid);
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      const userData = await this.dataUseCase.getuserdata(userid);
      console.log(userData, "//");
      if (userData && userData._id) {
        let order_id = order.id;
        // let receipt = order.receipt;
        const addPaymentDetails = await this.dataUseCase.addPaymentDetails(
          order_id,

          userData._id,
          userData.email
        );
      }

      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async razorpaySuccess(req: Request, res: Response): Promise<void> {
    try {
      const { payment_id, order_id } = req.body;
      const updatedOrder = await this.dataUseCase.updateOrder(order_id);
      console.log(updatedOrder, "updatede order");
      if (updatedOrder) {
        const updatetrainerdb = await this.dataUseCase.updatetrainerdb(
          updatedOrder
        );
        res.status(200).json({ message: "success" });
        return;
      }
      res.status(400).json({ message: "Failed" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Server Error ,Please try again" });
      return;
    }
  }
  // async razorpayFailure(req: Request, res: Response): Promise<void> {
  //   try {
  //   } catch (error) {
  //     res.status(500).json({ message: "Server Error ,Please try again" });
  //     return;
  //   }
  // }

  async getPaymentData(req: Request, res: Response): Promise<void> {
    try {
      const { limit, skip } = req.body;
      const paymentData = await this.dataUseCase.getPaymentData(limit, skip);
      console.log(paymentData, "");
      if (paymentData) {
        res.status(200).json({ message: "success", paymentData });
        return;
      }
      res.status(400).json({ message: "Failed to get data" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Server Error ,Please try again" });
      return;
    }
  }

  async removeCertificateImages(req: Request, res: Response): Promise<void> {
    try {
      const { certImage, user_id } = req.body;
      if (!certImage && !user_id) {
        res
          .status(400)
          .json({ message: "Somethimg went wrong please try again" });
        return;
      }
      const removeCerificates = await this.dataUseCase.removeCertificateImages(
        certImage,
        user_id
      );
      if (removeCerificates) {
        res.status(201).json({ message: "Success", removed: true });
        return;
      } else {
        res.status(200).json({ message: "Success", removed: false });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error ,Please try again" });
      return;
    }
  }

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

      const updateClientProfile = await this.dataUseCase.updateClientProfile(
        formData
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

  async sendRequestTrainer(req: Request, res: Response): Promise<void> {
    try {
      const { client_id, trainer_id } = req.body;
      console.log(client_id, trainer_id);
      if (!client_id && !trainer_id) {
        res.status(400).json({
          message: "Something went wrong please try again",
        });
        return;
      }
      const ClientData = await this.dataUseCase.getClientData(client_id);
      if (ClientData) {
        const alreadySend = ClientData.requestSended.find((request) => {
          request.trainer_id === trainer_id;
        });
        if (alreadySend) {
          res.status(200).json({ message: "success", requestSuccess: true });
          return;
        }
      }

      const sendRequest = await this.dataUseCase.sendRequestTrainer(
        client_id,
        trainer_id
      );

      if (sendRequest) {
        res.status(200).json({ message: "success", requestSuccess: true });
        return;
      }
      res.status(400).json({ message: "failed", requestSuccess: false });
      return;
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
    }
  }
  async getclientsRequest(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        res.status(400).json({
          message: "Something went wrong please try again",
        });

        return;
      }

      const clientRequestList = await this.dataUseCase.getclientsRequest(
        user_id
      );

      if (clientRequestList) {
        res.status(200).json({ message: "success", clientRequestList });
        return;
      }
      res.status(400).json({ message: "Failed to get data" });
      return;
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
      return;
    }
  }
  async acceptClientsRequest(req: Request, res: Response): Promise<void> {
    try {
      const { client_id, trainer_id } = req.body;
      if (!client_id && !trainer_id) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }
      const updateRequestStatus = await this.dataUseCase.acceptRequestStatus(
        client_id,
        trainer_id
      );
      if (updateRequestStatus) {
        const clienData = await this.dataUseCase.getuserdata(client_id);
        const trainerData = await this.dataUseCase.getuserdata(trainer_id);
        if (clienData && trainerData) {
          this.sendOTPEmail(clienData.email, trainerData.name, "Accepted");
        }

        res.status(200).json({ message: "success", clientAdded: true });
      }
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
      return;
    }
  }
  async removeClientsRequest(req: Request, res: Response): Promise<void> {
    try {
      const { client_id, trainer_id } = req.body;
      if (!client_id && !trainer_id) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }
      const updateRequestStatus = await this.dataUseCase.removeRequestStatus(
        client_id,
        trainer_id
      );

      if (updateRequestStatus) {
        const clienData = await this.dataUseCase.getuserdata(client_id);
        const trainerData = await this.dataUseCase.getuserdata(trainer_id);
        if (clienData && trainerData) {
          this.sendOTPEmail(clienData.email, trainerData.name, "Removed");
        }

        res.status(200).json({ message: "success", clientRemoved: true });
      }
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
      return;
    }
  }

  async clientRequestSearch(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      if (!query) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }
      const clientRequestList = await this.dataUseCase.clientRequestSearch(
        query
      );
      if (clientRequestList) {
        res.status(200).json({ message: "Success", clientRequestList });
        return;
      }
      res.status(400).json({ message: "Failed to get data" });
      return;
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
      return;
    }
  }
  async getMessageReciversImg(req: Request, res: Response): Promise<void> {
    try {
      const { receiveremail } = req.body;
      const userdata = await this.dataUseCase.getMessageReciverData(
        receiveremail
      );
      if (userdata) {
        let profileimage = userdata.profileimage;
        res.status(200).json({
          message: "Success",
          profileimage,
        });
      }
      res.status(400).json({
        message: "Failed to get data",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
      return;
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { token } = req.body;
    if (!token) {
      res.status(401).json({ message: "Refresh Token Required" });
      return;
    }

    try {
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
      const decoded: any = jwt.verify(token, refreshTokenSecret);

      const newAccessToken = generateAccessToken(
        decoded.username,
        decoded.isAdmin,
        decoded.id,
        decoded.emai1
      );
      console.log(newAccessToken, "refreshtoken in data");
      res.json({ AccessToken: newAccessToken });
      return;
    } catch (err) {
      res.status(403).json({ message: "Invalid Refresh Token" });
    }
  }
  async addMessageList(req: Request, res: Response): Promise<void> {
    try {
      console.log("addtomessage list contr");
      const { receivers_id, currentuser_id } = req.body;
      const reciversdata = await this.dataUseCase.getuserdata(receivers_id);
      const currentuserdata = await this.dataUseCase.getuserdata(
        currentuser_id
      );
      console.log(receivers_id, currentuser_id, "...........//");
      if (reciversdata && currentuserdata) {
        console.log("addtomessage list contr1");
        const addreciversdataMessageList =
          await this.dataUseCase.addtoMessageList(
            reciversdata,
            currentuserdata.email
          );
        const addcurrentuserdataMessageList =
          await this.dataUseCase.addtoMessageList(
            currentuserdata,
            reciversdata.email
          );
        res.status(200).json({
          message: "Succesfully added to message list ",
        });
        return;
      }
      res.status(400).json({
        message: "Failed to add message list ",
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
  async isUserBlocked(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        res.status(400).json({
          message: "Something went wrong .please try again",
        });
        return;
      }
      const isUserBlocked = await this.dataUseCase.isUserBlocked(user_id);

      if (!isUserBlocked) {
        res.status(200).json({
          message: "User is not blocked",
          isUserBlocked,
        });
        return;
      } else {
        res.status(200).json({
          message: "user is blocked",
          isUserBlocked,
        });
      }

      return;
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
      return;
    }
  }

  async isUserAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.body;
      console.log(user_id, "user_id..");
      if (!user_id) {
        res.status(400).json({
          message: "Something went wrong .please try again",
        });
        return;
      }
      const isAdmin = await this.dataUseCase.isUserAdmin(user_id);
      console.log(isAdmin, "isAdmin");

      if (isAdmin) {
        res.status(200).json({
          message: "User is not blocked",
          isAdmin,
        });
        return;
      } else {
        res.status(200).json({
          message: "user is blocked",
          isAdmin,
        });
      }

      return;
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
      return;
    }
  }

  async getMessageSearchResult(req: Request, res: Response) {
    try {
      const { text } = req.body;
      console.log(
        text,
        "///////////////////////////////////////////////////////////////////"
      );
      if (text) {
        const userdata = await this.dataUseCase.finduser(text);
        console.log(
          userdata,
          "////////////////////////////////////////////////"
        );

        // let val = {
        //   name: list.name,
        //   _id: list._id,
        //   email: list.email,
        //   bio: list.Bio,
        //   profileimage: list.profileimage,
        // };
      }
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error has occurred. Please refresh the page and try again,",
      });
      return;
    }
  }
}
export { dataControllerImpl };
