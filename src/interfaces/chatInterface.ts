import { Request, Response } from "express";
import Trainer from "../entities/trainer";
import VedioSession from "../entities/VedioSession";
import { ObjectId } from "mongoose";
import { promises } from "dns";
import Client from "../entities/client";

export interface Blog {
  title: string;
  author: string;
  content: {
    paragraphs?: string[];
  };
  user_id: { type: String; required: true };
  image?: "string";
}

export interface ChatControllerinterface {
  getMessages(req: Request, res: Response): Promise<void>;
  checkForVedioSession(req: Request, res: Response): Promise<void>;
  getCurrentVedioCallId(req: Request, res: Response): Promise<void>;
  checkIfTrainer(req: Request, res: Response): Promise<void>;
  updateSession(req: Request, res: Response): Promise<void>;
  removeWorkout(req: Request, res: Response): Promise<void>;
  addBlog(req: Request, res: Response): Promise<void>;

  viewBlogContent(req: Request, res: Response): Promise<void>;
}

export interface chatUseCaseInterface {
  getMessages(senderemail: string, receiveremail: string): Promise<any>;
  trainerDetails(traineremail: String): Promise<Trainer | null>;
  checkForVedioSession(
    client_id: any,
    trainer_id: any
  ): Promise<VedioSession[] | null>;
  getCurrentVedioCallId(
    trainerId: ObjectId,
    client_Id: ObjectId
  ): Promise<string | null>;
  getTrainerDetails(email: string): Promise<Trainer | null>;
  checkIfTrainer(trainer_Id: string): Promise<boolean>;
  updateSession(randomId: string, trainer_Id: string): Promise<boolean>;
  removeWorkout(Date: string, user_id: string): Promise<Client | null>;
  addBlog(blogDetails: Blog): Promise<boolean>;
  // getBlogDetails(skip: number, limit: number): Promise<any[] | null>;
  viewBlogContent(_id: string): Promise<BlogContent | null>;
}

export interface chatRepositoryInterface {
  getMessages(senderemail: string, receiveremail: string): Promise<any>;
  trainerDetails(traineremail: String): Promise<Trainer | null>;
  checkForVedioSession(
    client_id: any,
    trainer_id: any
  ): Promise<VedioSession[] | null>;
  getCurrentVedioCallId(
    trainerId: any,
    client_Id: ObjectId
  ): Promise<string | null>;
  getTrainerDetails(email: string): Promise<Trainer | null>;
  checkIfTrainer(trainer_Id: string): Promise<boolean>;
  updateSession(randomId: string, trainer_Id: string): Promise<boolean>;
  removeWorkout(Date: string, user_id: string): Promise<Client | null>;
  addBlog(blogDetails: Blog): Promise<boolean>;
  // getBlogDetails(skip: number, limit: number): Promise<any[] | null>;
  viewBlogContent(_id: string): Promise<BlogContent | null>;
}
export interface BlogContent {
  content?: {
    paragraphs?: string[] | null;
  } | null;
  _id: string;
  title: string;
  user_id: string;
  author: string;
  status: "Pending" | "Approved" | "Cancelled";
  __v: number;
  reason: string;
  imagePath?: string;
}
