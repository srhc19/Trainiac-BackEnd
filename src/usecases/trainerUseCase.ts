import { ObjectId, Schema } from "mongoose";
import {
  gymexercises,
  trainerUseCaseInterface,
} from "../interfaces/trainerInterface";
import TrainerRepositoryImpl from "../repositories/trainerRepository";
import Trainer from "../entities/trainer";
import Client from "../entities/client";
import User from "../entities/user";
import { promises } from "fs";

class TrainerUseCaseImpl implements trainerUseCaseInterface {
  constructor(private trainerRepository: TrainerRepositoryImpl) {}

  async startVedioSession(
    vedioSessionClientsId: Schema.Types.ObjectId[],
    trainer_id: Schema.Types.ObjectId,
    randomid: string
  ): Promise<boolean> {
    return await this.trainerRepository.startVedioSession(
      vedioSessionClientsId,
      trainer_id,
      randomid
    );
  }

  async checkemailexists(email: string): Promise<boolean> {
    return await this.trainerRepository.checkemailexists(email);
  }
  async getTrainerDetails(
    _id: ObjectId,
    clientEmail: string
  ): Promise<boolean> {
    return await this.trainerRepository.getTrainerDetails(_id, clientEmail);
  }

  async getClientList(trainerid: ObjectId): Promise<string[] | null> {
    return await this.trainerRepository.getClientList(trainerid);
  }
  async getClientData(clientemail: string): Promise<Client | null> {
    return await this.trainerRepository.getClientData(clientemail);
  }
  async addCardioWorkout(
    trainerid: ObjectId,
    clientemail: string,
    workoutDate: string,
    activity: string,
    intensity: string,
    duration: string
  ): Promise<boolean> {
    return await this.trainerRepository.addCardioWorkout(
      trainerid,
      clientemail,
      workoutDate,
      activity,
      intensity,
      duration
    );
  }

  async addGymWorkout(
    clientEmail: string,
    exercises: Array<gymexercises>,
    targetMuscleGroup: String,
    workoutDate: string
  ): Promise<boolean> {
    return await this.trainerRepository.addGymWorkout(
      clientEmail,
      exercises,
      targetMuscleGroup,
      workoutDate
    );
  }
  async addYogaWorkout(
    clientEmail: string,
    workoutDate: string,
    activity: string,
    duration: string
  ): Promise<boolean> {
    return await this.trainerRepository.addYogaWorkout(
      clientEmail,
      workoutDate,
      activity,
      duration
    );
  }

  async updateTrainerProfile(formData: any): Promise<boolean> {
    return await this.trainerRepository.updateTrainerProfile(formData);
  }

  async checkvaliduser(email: string, password: string): Promise<boolean> {
    return await this.trainerRepository.checkvaliduser(email, password);
  }

  async checkisblocked(email: string): Promise<boolean> {
    return await this.trainerRepository.checkisblocked(email);
  }

  async checkifAdmin(email: string): Promise<boolean> {
    return await this.trainerRepository.checkifAdmin(email);
  }
  async getcurrentuser(email: string): Promise<any> {
    return await this.trainerRepository.getcurrentuser(email);
  }
  async getuser(email: string): Promise<User | null> {
    return await this.trainerRepository.getuser(email);
  }
  async trainerDetails(_id: ObjectId): Promise<Trainer | null> {
    return await this.trainerRepository.trainerDetails(_id);
  }
  async getuserdetails(
    Client: string,
    skip: number,
    limit: number
  ): Promise<Array<any>> {
    return await this.trainerRepository.getuserdetails(Client, skip, limit);
  }
  async getChatList(follower: any): Promise<Client | Trainer | null> {
    return await this.trainerRepository.getChatList(follower);
  }
}
export { TrainerUseCaseImpl };
