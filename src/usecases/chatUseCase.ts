import { ObjectId } from "mongoose";
import VedioSession from "../entities/vedioSession";
import Client from "../entities/client";
import Trainer from "../entities/trainer";
import {
  Blog,
  BlogContent,
  chatUseCaseInterface,
} from "../interfaces/chatInterface";
import ChatRepositoryImpl from "../repositories/chatRepository";
import { emit } from "process";

class chatUseCaseImpl implements chatUseCaseInterface {
  constructor(private chatRepository: ChatRepositoryImpl) {}

  async trainerDetails(traineremail: String): Promise<Trainer | null> {
    return await this.chatRepository.trainerDetails(traineremail);
  }

  async getMessages(senderemail: string, receiveremail: string): Promise<any> {
    return await this.chatRepository.getMessages(senderemail, receiveremail);
  }

  async checkForVedioSession(
    trainer_id: any,
    client_id: any
  ): Promise<VedioSession[] | null> {
    return await this.chatRepository.checkForVedioSession(
      trainer_id,
      client_id
    );
  }

  async clientDetails(user_id: any): Promise<Client | null> {
    return await this.chatRepository.clientDetails(user_id);
  }
  async getCurrentVedioCallId(
    client_Id: ObjectId,
    trainerId: ObjectId
  ): Promise<string | null> {
    return await this.chatRepository.getCurrentVedioCallId(
      client_Id,
      trainerId
    );
  }

  async getTrainerDetails(trainer_Id: String): Promise<Trainer | null> {
    return await this.chatRepository.getTrainerDetails(trainer_Id);
  }

  async checkIfTrainer(trainer_Id: String): Promise<boolean> {
    return await this.chatRepository.checkIfTrainer(trainer_Id);
  }

  async updateSession(randomId: string, trainer_Id: string): Promise<boolean> {
    return await this.chatRepository.updateSession(randomId, trainer_Id);
  }
  async removeWorkout(
    formattedDate: string,
    user_id: string
  ): Promise<Client | null> {
    return await this.chatRepository.removeWorkout(formattedDate, user_id);
  }

  async addBlog(blogDetails: Blog): Promise<boolean> {
    return await this.chatRepository.addBlog(blogDetails);
  }
  async getBlogDetails(): Promise<any[] | null> {
    return await this.chatRepository.getBlogDetails();
  }

  async viewBlogContent(_id: string): Promise<BlogContent | null> {
    return await this.chatRepository.viewBlogContent(_id);
  }
}
export { chatUseCaseImpl };
