import { Request, Response } from "express";
import { adminUseCaseImpl } from "../usecases/AdminUseCase";
import * as nodemailer from "nodemailer";
import cloudinary from "../helper/cloudinary";
import { promisify } from "util";
import { ProgressData, UploadedImages } from "../interfaces/adminInterface";
import { razorpay } from "../helper/razorpay";

const uploadToCloudinary = promisify(cloudinary.uploader.upload);
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service provider (e.g., 'Gmail', 'Outlook', etc.)
  auth: {
    user: process.env.email, // Your email address
    pass: process.env.password, // Your email password (use an application-specific password for security)
  },
});

class adminControllerImpl implements adminControllerImpl {
  constructor(private adminUseCase: adminUseCaseImpl) {}

  private async sendOTPEmail(
    email: string,
    action: string,
    reason?: string
  ): Promise<void> {
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Blog Submission Report",
      html: `Your Blog has been ${action}${
        reason ? `. Reason: ${reason}` : ""
      }`,
    };
    await transporter.sendMail(mailOptions);
  }

  async changeBlogStatus(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.body;

      if (!_id) {
        res
          .status(400)
          .json({ message: "Something went wrong .Please try again" });
      }

      const PublishBlog = await this.adminUseCase.changeBlogStatus(_id);

      if (PublishBlog) {
        const getBlogUserDetails = await this.adminUseCase.getBlogUserDetails(
          PublishBlog.user_id
        );
        if (getBlogUserDetails) {
          this.sendOTPEmail(getBlogUserDetails, "Cancelled");
        }
        res.status(200).json({
          message: "Blog is Succesfully published",
          Blog: PublishBlog,
        });
        return;
      }
      res
        .status(400)
        .json({ message: "Failed to publish blog ,Please try again" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async cancelBlog(req: Request, res: Response): Promise<void> {
    try {
      const { _id, note } = req.body;

      if (!_id) {
        res
          .status(400)
          .json({ message: "Something went wrong .Please try again" });
      }

      const canceledBlog = await this.adminUseCase.cancelBlog(_id, note);

      if (canceledBlog) {
        const getBlogUserDetails = await this.adminUseCase.getBlogUserDetails(
          canceledBlog.user_id
        );
        if (getBlogUserDetails) {
          this.sendOTPEmail(getBlogUserDetails, "Cancelled", note);
        }
        res.status(200).json({
          message: "Blog is Succesfully cancelled",
          Blog: canceledBlog,
        });
        return;
      }
      res
        .status(400)
        .json({ message: "Failed to publish blog ,Please try again" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async getBlogList(req: Request, res: Response): Promise<void> {
    try {
      const { skip, limit } = req.body;
      const blogList = await this.adminUseCase.getBlogList(skip, limit);

      if (blogList) {
        res
          .status(200)
          .json({ blogList, message: " Succesfully got list of blogs" });
        return;
      }
      res
        .status(400)
        .json({ blogList, message: " Failed to get list of blogs" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async currentTrainerBlogList(req: Request, res: Response) {
    try {
      const { user_id, skip, limit } = req.body;

      if (!user_id) {
        res
          .status(400)
          .json({ message: "something went wrong please try again" });
        return;
      }
      const blogDetails = await this.adminUseCase.currentTrainerBlogList(
        user_id,
        skip,
        limit
      );

      if (blogDetails) {
        res
          .status(200)
          .json({ blogDetails, message: "Succesfully got list of blogs" });
        return;
      }
      res.status(400).json({ message: "Failed to get list of blogs" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async addBlog(req: Request, res: Response): Promise<void> {
    try {
      const blogDetails = JSON.parse(req.body.blogDetails);

      if (!req.file && !req.body.blogDetails) {
        res.status(400).json({
          blogAdded: false,
          message: "Failed to add blog, please try again",
        });
        return;
      }

      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file.path);
          blogDetails.image = result?.secure_url;
        } catch (err) {
          console.error(err);
          res.status(500).json({
            success: false,
            message: "Error uploading image",
          });
          return;
        }
      } else {
        blogDetails.image = null;
      }

      const blogAdded = await this.adminUseCase.addBlog(blogDetails);
      if (blogAdded) {
        res.status(200).json({
          blogAdded: true,
          message: "Blog is successfully submitted for review",
        });
        return;
      } else {
        res.status(400).json({
          blogAdded: false,
          message: "Failed to add blog, please try again",
        });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async addProgress(req: Request, res: Response): Promise<void> {
    try {
      const {
        user_id,
        currentWeight,
        waist,
        hips,
        chest,
        arms,
        legs,
        calves,
        forearms,
        bodyFatPercentage,
      } = req.body;
      let images = req.files as UploadedImages;

      if (!req.files && !user_id) {
        res.status(400).json({
          message: "Something went wrong, please try again",
        });
        return;
      }

      const imageFields = ["frontPhoto", "sidePhoto", "backPhoto"];
      const uploadedImages: { [key: string]: string } = {};

      for (const field of imageFields) {
        if (images && images[field]) {
          const file = images[field][0];
          try {
            const result = await uploadToCloudinary(file.path);
            if (result?.secure_url) {
              uploadedImages[field] = result.secure_url;
            }
          } catch (err) {
            res.status(500).json({
              success: false,
              message: "Error uploading image",
            });
            return;
          }
        }
      }
      const date = new Date();
      const dateString = date.toISOString().split("T")[0];

      const progressData = {
        user_id,
        currentWeight,
        waist,
        hips,
        chest,
        arms,
        legs,
        calves,
        forearms,
        bodyFatPercentage,
        ...uploadedImages,
        createdAt: dateString,
      };

      const progressTracker = await this.adminUseCase.addProgress(progressData);
      if (progressTracker) {
        res.status(200).json({
          message: "Progress added successfully",
          progress: progressTracker,
        });
        return;
      }
      res.status(400).json({
        message: "Failed to add progress",
        progress: progressTracker,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async getProgressData(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again " });
        return;
      }

      const progressData = await this.adminUseCase.getProgressData(user_id);

      if (progressData) {
        res.status(200).json({ progressData, message: "Success" });
        return;
      }
      res.status(400).json({ message: "Failed to get progress Data" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async getprogressDetails(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.body;
      if (!_id) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again " });
        return;
      }

      const progressDetails = await this.adminUseCase.getprogressDetails(_id);
      if (progressDetails) {
        res.status(200).json({ message: "Success", progressDetails });
        return;
      }
      res
        .status(400)
        .json({ message: "Failed to get progress Details", progressDetails });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async getSessionList(req: Request, res: Response): Promise<void> {
    try {
      const sessionData = await this.adminUseCase.getSessionData();

      if (sessionData) {
        let sessionArray: any = [];
        for (const data of sessionData) {
          const clientNames = await this.adminUseCase.getclientnames(
            data.clientsId
          );
          const trainer = await this.adminUseCase.gettrainername(
            data.trainerId
          );
          if (clientNames && trainer) {
            let value = {
              trainer,
              clientNames,
              startedAt: data.startedAt,
              endedAt: data.endedAt,
            };
            sessionArray.push(value);
          }
        }

        res.status(200).json({
          message: "Succesfully got session data",
          sessionData: sessionArray,
        });
        return;
      }
      res
        .status(400)
        .json({ message: "Failed to get session data", sessionData });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async checkIfClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;

      if (!req.body) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }
      const checkIfClient = await this.adminUseCase.checkIfClient(id);

      if (checkIfClient) {
        res.status(200).json({ message: "success", isClient: checkIfClient });
        return;
      }
      res
        .status(400)
        .json({ message: "Failed to get data", isClient: checkIfClient });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async getTrainerData(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }
      const trainerData = await this.adminUseCase.getTrainerData(email);

      if (trainerData) {
        res
          .status(200)
          .json({ message: "Succesfully got trainer Data", trainerData });
        return;
      }
      res
        .status(400)
        .json({ message: "Failed to get trainer Data", trainerData });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async addTestimonial(req: Request, res: Response): Promise<void> {
    try {
      const { content, user_id } = req.body;
      if (!content || !user_id) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }

      const addTestimony = await this.adminUseCase.addTestimonial(
        content,
        user_id
      );
      res.status(200).json({ message: "Succesfully added testimony" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async getTestimonial(req: Request, res: Response): Promise<void> {
    try {
      const { trainerId } = req.body;
      if (!trainerId) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
        return;
      }
      const testimonyData = await this.adminUseCase.getTestimonial(trainerId);

      if (testimonyData) {
        res.status(200).json({
          message: "Succesfully got trainer testimonials",
          testimonyData,
        });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async trainerlist(req: Request, res: Response): Promise<void> {
    try {
      const { skip, limit } = req.body;

      const trainerlist = await this.adminUseCase.trainerlist(skip, limit);

      if (trainerlist) {
        res.status(200).json({
          trainerlist,
        });
        return;
      }

      res.status(500).json({ message: "Internal server error" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async addBackPhoto(req: Request, res: Response): Promise<void> {
    try {
      let backPhotoUrl: string | null;
      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file.path);
          if (result) {
            backPhotoUrl = result?.secure_url;

            res.status(200).json({ backPhotoUrl });
            return;
          }
        } catch (err) {
          console.error(err);
          res.status(500).json({
            success: false,
            message: "Error uploading image",
          });
          return;
        }
      } else {
        backPhotoUrl = null;
        res.status(400).json({ backPhotoUrl });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async addSidePhoto(req: Request, res: Response): Promise<void> {
    try {
      let sidePhotoUrl: string | null;
      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file.path);
          if (result) {
            sidePhotoUrl = result?.secure_url;

            res.status(200).json({ sidePhotoUrl });
            return;
          }
        } catch (err) {
          console.error(err);
          res.status(500).json({
            success: false,
            message: "Error uploading image",
          });
          return;
        }
      } else {
        sidePhotoUrl = null;
        res.status(400).json({ sidePhotoUrl });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
  async addFrontPhoto(req: Request, res: Response): Promise<void> {
    try {
      let frontPhotoUrl: string | null;
      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file.path);
          if (result) {
            frontPhotoUrl = result?.secure_url;

            res.status(200).json({ frontPhotoUrl });
            return;
          }
        } catch (err) {
          console.error(err);
          res.status(500).json({
            success: false,
            message: "Error uploading image",
          });
          return;
        }
      } else {
        frontPhotoUrl = null;
        res.status(400).json({ frontPhotoUrl });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async updateProgress(req: Request, res: Response): Promise<void> {
    try {
      const { updatedData, _id } = req.body;

      if (!updatedData || !_id) {
        res.status(400).json({ message: "Something went wrong" });
        return;
      }

      const data = await this.adminUseCase.updateProgress(updatedData, _id);
      if (data) {
        res.status(200).json({ updated: true });
        return;
      }
      res.status(400).json({ updated: false });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async trainerlistSearch(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;

      if (!query) {
        res
          .status(400)
          .json({ message: "something went wrong please try again" });
        return;
      }

      const trainerlist = await this.adminUseCase.trainerlistSearch(query);
      if (trainerlist) {
        res.status(200).json({ message: "success", trainerlist });
        return;
      }
      res.status(400).json({ message: "Failed to get trainer data" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getBlogDetails(req: Request, res: Response): Promise<void> {
    try {
      const { skip, limit } = req.body;
      const blogDetails = await this.adminUseCase.getBlogDetails(skip, limit);

      if (blogDetails) {
        res.status(200).json({
          blogDetails,
          message: "Blog details is succesfully collected",
        });
        return;
      }
      res.status(201).json({
        blogDetails: "",
        message: "Failed to collect blog details please try again",
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
}
export { adminControllerImpl };
