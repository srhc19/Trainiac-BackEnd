import { Request, Response } from "express";
import { Blog, BlogContent } from "./chatInterface";
import { promises } from "dns";
import { ObjectId } from "mongoose";
import Client from "../entities/client";
import Trainer from "../entities/trainer";

export interface BlogList {
  _id: Id;
  title: string;
  user_id: string;
  author: string;
  content: Content;
  status: string;
  __v: number;
  reason: string;
  image?: string;
}

export interface Id {
  $oid: string;
}

export interface Content {
  paragraphs: string[];
}

export interface AdminControllerinterface {
  changeBlogStatus(req: Request, res: Response): Promise<void>;
  getBlogList(req: Request, res: Response): Promise<void>;
  currentTrainerBlogList(req: Request, res: Response): Promise<void>;
  addProgress(req: Request, res: Response): Promise<void>;
  getProgressData(req: Request, res: Response): Promise<void>;
  getprogressDetails(req: Request, res: Response): Promise<void>;
  getSessionList(req: Request, res: Response): Promise<void>;
  checkIfClient(req: Request, res: Response): Promise<void>;
  getTrainerData(req: Request, res: Response): Promise<void>;
  addTestimonial(req: Request, res: Response): Promise<void>;
  getTestimonial(req: Request, res: Response): Promise<void>;
  getBlogDetails(req: Request, res: Response): Promise<void>;
}
export interface AdminUseCaseInterface {
  changeBlogStatus(_id: string): Promise<string | null>;
  getBlogList(skip: number, limit: number): Promise<BlogList[] | null>;
  getBlogUserDetails(_id: string): Promise<string | null>;
  currentTrainerBlogList(
    user_id: string,
    skip: number,
    limit: number
  ): Promise<BlogContent[] | null>;
  addProgress(progressData: ProgressData): Promise<boolean>;
  getProgressData(user_id: string): Promise<ProgressData[] | null>;
  getprogressDetails(_id: string): Promise<ProgressData | null>;
  getSessionList(): Promise<any>;
  getclientnames(clietsId: ObjectId[]): Promise<Client | null>;
  gettrainername(trainerid: ObjectId): Promise<any>;
  checkIfClient(id: ObjectId): Promise<boolean>;
  getTrainerData(email: string): Promise<Trainer | null>;
  addTestimonial(content: string, user_id: string): Promise<boolean>;
  getTestimonial(trainerId: string): Promise<Trainer | null>;
  getBlogDetails(skip: number, limit: number): Promise<any[] | null>;
}
export interface AdminRepositoryInterface {
  changeBlogStatus(_id: string): Promise<string | null>;
  getBlogList(skip: number, limit: number): Promise<BlogList[] | null>;
  getBlogUserDetails(_id: string): Promise<string | null>;
  currentTrainerBlogList(
    user_id: string,
    skip: number,
    limit: number
  ): Promise<BlogContent[] | null>;
  addProgress(progressData: ProgressData): Promise<boolean>;
  getProgressData(user_id: string): Promise<ProgressData[] | null>;
  getprogressDetails(_id: string): Promise<any>;
  getSessionList(): Promise<any>;
  getclientnames(clietsId: ObjectId[]): Promise<Client | null>;
  gettrainername(trainerid: ObjectId): Promise<any>;
  checkIfClient(id: ObjectId): Promise<boolean>;
  getTrainerData(email: string): Promise<Trainer | null>;
  addTestimonial(content: string, user_id: string): Promise<boolean>;
  getTestimonial(trainerId: string): Promise<Trainer | null>;
  getBlogDetails(skip: number, limit: number): Promise<any[] | null>;
}

export interface ProgressData {
  user_id: string;
  currentWeight: number;
  waist: number;
  hips: number;
  chest: number;
  arms: number;
  legs: number;
  calves: number;
  forearms: number;
  bodyFatPercentage: number;
  frontPhoto?: string;
  sidePhoto?: string;
  backPhoto?: string;
  createdAt?: string;
}
interface ImageFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface UploadedImages {
  [key: string]: ImageFile[];
}

export type Root = session1[];

export interface session1 {
  _id: string;
  name: string;
  password: string;
  role: string;
  email: string;
  isAdmin: boolean;
  __v: number;
  isblocked: boolean;
  isVerified?: boolean;
  otp?: number;
  otpExpirationTime?: string;
}
