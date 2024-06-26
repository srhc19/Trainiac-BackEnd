import { Request, Response } from "express";
import { ChatControllerinterface } from "../interfaces/chatInterface";
import { chatUseCaseImpl } from "../usecases/chatUseCase";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import cloudinary from "../helper/cloudinary";

class ChatControllerImpl implements ChatControllerinterface {
  constructor(private chatUseCase: chatUseCaseImpl) {}

  async getCurrentVedioCallId(req: Request, res: Response): Promise<void> {
    try {
      const { trainer_Id } = req.body;

      if (!trainer_Id) {
        res.status(400).json({ message: "something went wrong ,Try again" });
      }

      const gettrianerdetails = await this.chatUseCase.getTrainerDetails(
        trainer_Id
      );

      if (gettrianerdetails) {
        // const trainerId = gettrianerdetails.user_id;
        // const vedioCallId = await this.chatUseCase.getCurrentVedioCallId(
        //   trainerId,
        //   client_Id
        // );
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  }

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      let { senderemail, receiveremail } = req.body;
      const messages = await this.chatUseCase.getMessages(
        senderemail,
        receiveremail
      );
      messages.sort((a: any, b: any) => a.createdAt - b.createdAt);

      if (messages) {
        res.status(200).json({ message: "messages is available", messages });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async checkForVedioSession(req: Request, res: Response): Promise<void> {
    try {
      let { client_id } = req.body;

      let clientDetails = await this.chatUseCase.clientDetails(client_id);
      if (clientDetails) {
        let traineremail = clientDetails.trainers[0];
        if (traineremail) {
          const trainerDetails = await this.chatUseCase.trainerDetails(
            traineremail
          );
          if (trainerDetails) {
            const clientSessionDetails =
              await this.chatUseCase.checkForVedioSession(
                trainerDetails.user_id,
                clientDetails._id
              );
            res.status(200).json({
              clientSessionDetails,
              message: "client Session details updated",
            });
            return;
          }
        }
      }
      res.status(400).json({
        clientSessionDetails: "",
        message: "failed to get client Session details ",
      });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
  async checkIfTrainer(req: Request, res: Response): Promise<void> {
    try {
      const { trainer_Id } = req.body;
      const isTrainer = await this.chatUseCase.checkIfTrainer(trainer_Id);
      res.status(200).json({
        isTrainer,
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async updateSession(req: Request, res: Response): Promise<void> {
    try {
      const { randomId, trainer_Id } = req.body;
      const updateSession = await this.chatUseCase.updateSession(
        randomId,
        trainer_Id
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
  async removeWorkout(req: Request, res: Response): Promise<void> {
    try {
      const { formattedDate, user_id } = req.body;

      if (!formattedDate || !user_id) {
        res
          .status(400)
          .json({ message: "Something went wrong ,Please try again" });
        return;
      }

      let updateclientDetails = await this.chatUseCase.removeWorkout(
        formattedDate,
        user_id
      );
      if (updateclientDetails) {
        res.status(200).json({ clientDetails: updateclientDetails });
        return;
      }
      res
        .status(400)
        .json({ message: "something went wrong please trt again" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async addBlog(req: Request, res: Response): Promise<void> {
    try {
      console.log("add blog cont");
      const { blogDetails } = req.body;
      if (!req.file) {
        res.status(500).json({
          success: false,
          message: "Error",
        });
        return;
      }
      const imageFile = req.file;
      cloudinary.uploader.upload(
        req.file.path,
        function (err: any, result: any) {
          console.log(result, "add blog result");
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: false,
              message: "Error",
            });
          }
          if (imageFile) {
            blogDetails.image = result;
          } else {
            blogDetails.image = null;
          }
        }
      );

      console.log(blogDetails, "blogDetails in chat controller");

      const blogAdded = await this.chatUseCase.addBlog(blogDetails);
      if (blogAdded) {
        res.status(200).json({
          blogAdded: true,
          message: "Blog is succesfully submited for review",
        });
        return;
      }
      res.status(201).json({
        blogAdded: false,
        message: "Failed to Add blog please try again",
      });

      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async viewBlogContent(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.body;

      if (!_id) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
      }

      const blogContent = await this.chatUseCase.viewBlogContent(_id);
      if (blogContent) {
        res.status(200).json({ blogContent, message: "success" });
        return;
      }
      res
        .status(400)
        .json({ blogContent: "", message: "failed to get blog content" });

      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
}
export { ChatControllerImpl };
