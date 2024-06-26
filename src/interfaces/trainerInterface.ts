import { promises } from "dns";
import Trainer from "../entities/trainer";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import Client from "../entities/client";
// import { ObjectId } from "mongoose";

export interface gymexercises {
  name: string;
  sets: number;
  reps: number;
  weigth: number;
}

export interface premiumInterface {
  paid: boolean;
  method: string;
  orderid: string;
}
export interface TrainerControllerInterface {
  addnewClient(req: Request, res: Response): void;
  getClientList(req: Request, res: Response): void;
  addCardioWorkout(req: Request, res: Response): void;
  addGymWorkout(req: Request, res: Response): void;
  addYogaWorkout(req: Request, res: Response): void;
  updateTrainerProfile(req: Request, res: Response): void;
  startVedioSession(req: Request, res: Response): void;
}
export interface TrainerRepositoryInterface {
  checkemailexists(email: string): Promise<boolean>;
  getTrainerDetails(_id: ObjectId, clientEmail: string): Promise<boolean>;
  getClientList(trainerid: ObjectId): Promise<string[] | null>;
  getClientData(clientemail: string): Promise<Client | null>;
  addCardioWorkout(
    trainerid: ObjectId,
    clientemail: string,
    workoutDate: string,
    activity: string,
    intensity: string,
    duration: string
  ): Promise<boolean>;
  addGymWorkout(
    clientEmail: string,
    exercises: Array<gymexercises>,
    targetMuscleGroup: String,
    workoutDate: string
  ): Promise<boolean>;
  addYogaWorkout(
    clientEmail: string,
    workoutDate: string,
    activity: string,
    duration: string
  ): Promise<boolean>;
  updateTrainerProfile(formData: any, files: any): Promise<boolean>;
  getCurrentVedioCallId(client_Id: ObjectId): Promise<String | null>;
}
export interface trainerUseCaseInterface {
  checkemailexists(email: string): Promise<boolean>;
  getTrainerDetails(_id: ObjectId, clientEmail: string): Promise<boolean>;
  getClientList(trainerid: ObjectId): Promise<string[] | null>;
  getClientData(clientemail: string): Promise<Client | null>;
  addCardioWorkout(
    trainerid: ObjectId,
    clientemail: string,
    workoutDate: string,
    activity: string,
    intensity: string,
    duration: string
  ): Promise<boolean>;

  addGymWorkout(
    clientEmail: string,
    exercises: Array<gymexercises>,
    targetMuscleGroup: String,
    workoutDate: string
  ): Promise<boolean>;
  addYogaWorkout(
    clientEmail: string,
    workoutDate: string,
    activity: string,
    duration: string
  ): Promise<boolean>;
  updateTrainerProfile(formData: any, files: any): Promise<boolean>;
}

export interface requestInterface {
  client_id: string;
  clientName: String;
  clientEmail: String;
  goals: string[];
  createdAt: Date;
  status: boolean;
}
