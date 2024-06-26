import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import Client from "../entities/client";
import User from "../entities/user";
import Trainer from "../entities/trainer";
import { Chat } from "./userinterface";
import VedioSession from "../entities/VedioSession";

export interface clientcontrollerInterface {
  updateClientProfile(req: Request, res: Response): void;
  // checkForVedioSession(req: Request, res: Response): void;
}

export interface clientUseCaseInterface {
  updateClientProfile(formData: any, files: any): Promise<boolean>;
  getChatList(follower: string): Promise<Client | Trainer | null>;
  // checkForVedioSession(
  //   clientemail: any,
  //   traineremail: any
  // ): Promise<VedioSession | null>;
}

export interface clientRepositoryInterface {
  updateClientProfile(formData: any, files: any): Promise<boolean>;
  getChatList(follower: string): Promise<Client | Trainer | null>;
}

export interface clientrequest {
  trainer_id: String;
  createdAt: Date;
  accepted: Boolean;
}
