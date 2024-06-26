import { Request, Response } from "express";
import { Blog } from "./chatInterface";
import { BlogList, session1 } from "./adminInterface";
import Client from "../entities/client";
import Trainer from "../entities/trainer";
import VedioSession from "../entities/vedioSession";
import User from "../entities/user";
import { ObjectId } from "mongoose";

export interface dataController {
  bloglistSearch(req: Request, res: Response): Promise<void>;
  adminclientSearch(req: Request, res: Response): Promise<void>;
  adminTrainerSearch(req: Request, res: Response): Promise<void>;
  adminBlogSearch(req: Request, res: Response): Promise<void>;
  adminSessionSearch(req: Request, res: Response): Promise<void>;
  razorpay(req: Request, res: Response): Promise<void>;
  razorpaySuccess(req: Request, res: Response): Promise<void>;
  getPaymentData(req: Request, res: Response): Promise<void>;
  // razorpayFailure(req: Request, res: Response): Promise<void>;
  removeCertificateImages(req: Request, res: Response): Promise<void>;
  sendRequestTrainer(req: Request, res: Response): Promise<void>;
  getclientsRequest(req: Request, res: Response): Promise<void>;
  acceptClientsRequest(req: Request, res: Response): Promise<void>;
  removeClientsRequest(req: Request, res: Response): Promise<void>;
  clientRequestSearch(req: Request, res: Response): Promise<void>;
  getMessageReciversImg(req: Request, res: Response): Promise<void>;
  addMessageList(req: Request, res: Response): Promise<void>;
  isUserBlocked(req: Request, res: Response): Promise<void>;
  isUserAdmin(req: Request, res: Response): Promise<void>;
}
export interface dataUseCases {
  bloglistSearch(query: string): Promise<BlogList | null>;
  adminclientSearch(query: string): Promise<Client[] | null>;
  adminTrainerSearch(query: string): Promise<Trainer[] | null>;
  adminBlogSearch(query: string): Promise<Blog[] | null>;
  adminSessionSearch(query: string): Promise<VedioSession[] | null>;
  getuserdata(userid: string): Promise<User | null>;
  addPaymentDetails(
    order_id: string,

    _id: ObjectId,
    email: string
  ): Promise<boolean>;
  updateOrder(order_id: string): Promise<any>;
  getPaymentData(limit: number, skip: number): Promise<orderInterface[] | null>;
  removeCertificateImages(certImage: string, user_id: string): Promise<boolean>;
  updateClientProfile(formData: any): Promise<boolean>;
  sendRequestTrainer(client_id: string, trainer_id: string): Promise<boolean>;
  getClientData(client_id: string): Promise<Client | null>;
  getclientsRequest(user_id: string): Promise<any>;
  acceptRequestStatus(client_id: string, trainer_id: string): Promise<boolean>;
  removeRequestStatus(client_id: string, trainer_id: string): Promise<boolean>;
  clientRequestSearch(query: string): Promise<any>;
  getMessageReciverData(
    receiveremail: string
  ): Promise<Client | Trainer | null>;
  isUserBlocked(user_id: string): Promise<boolean>;
  isUserAdmin(user_id: string): Promise<boolean>;
}
export interface dataRepository {
  bloglistSearch(query: string): Promise<BlogList | null>;
  adminclientSearch(query: string): Promise<Client[] | null>;
  adminTrainerSearch(query: string): Promise<Trainer[] | null>;
  adminBlogSearch(query: string): Promise<Blog[] | null>;
  adminSessionSearch(query: string): Promise<VedioSession[] | null>;
  getuserdata(userid: string): Promise<User | null>;
  addPaymentDetails(
    order_id: string,

    _id: ObjectId,
    email: string
  ): Promise<boolean>;
  updateOrder(order_id: string): Promise<any>;
  getPaymentData(limit: number, skip: number): Promise<orderInterface[] | null>;
  removeCertificateImages(certImage: string, user_id: string): Promise<boolean>;
  updateClientProfile(formData: any): Promise<boolean>;
  sendRequestTrainer(client_id: string, trainer_id: string): Promise<boolean>;
  getClientData(client_id: string): Promise<Client | null>;
  getclientsRequest(user_id: string): Promise<any>;
  acceptRequestStatus(client_id: string, trainer_id: string): Promise<boolean>;
  removeRequestStatus(client_id: string, trainer_id: string): Promise<boolean>;
  clientRequestSearch(query: string): Promise<any>;
  getMessageReciverData(
    receiveremail: string
  ): Promise<Client | Trainer | null>;
  isUserBlocked(user_id: string): Promise<boolean>;
  isUserAdmin(user_id: string): Promise<boolean>;
}

export interface orderInterface {
  _id: Id;
  user_id: string;
  method: string;
  order_id: string;
  status: string;
  userEmail: string;
  __v: number;
}

export interface Id {
  $oid: string;
}
