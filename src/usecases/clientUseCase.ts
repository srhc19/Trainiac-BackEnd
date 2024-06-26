import { PassThrough } from "stream";
import { clientUseCaseInterface } from "../interfaces/clientInterface";
import clientRepositoryImp from "../repositories/clientRepository";
import User from "../entities/user";
import Client from "../entities/client";
import { ObjectId } from "mongoose";
import Trainer from "../entities/trainer";
import VedioSession from "../entities/vedioSession";

class clientUseCaseImpl implements clientUseCaseInterface {
  constructor(private clientRepository: clientRepositoryImp) {}

  // async trainerlist(skip: number, limit: number): Promise<any> {
  //   return await this.clientRepository.trainerlist(skip, limit);
  // }
  async updateClientProfile(formData: any, files: any) {
    return await this.clientRepository.updateClientProfile(formData, files);
  }
  async checkvaliduser(email: string, password: string): Promise<boolean> {
    return await this.clientRepository.checkvaliduser(email, password);
  }

  async checkisblocked(email: string): Promise<boolean> {
    return await this.clientRepository.checkisblocked(email);
  }

  async checkifAdmin(email: string): Promise<boolean> {
    return await this.clientRepository.checkifAdmin(email);
  }
  async getcurrentuser(email: string): Promise<any> {
    return await this.clientRepository.getcurrentuser(email);
  }
  async getuser(email: string): Promise<User | null> {
    return await this.clientRepository.getuser(email);
  }

  async getuserdetails(
    Client: string,
    skip: number,
    limit: number
  ): Promise<Array<any>> {
    return await this.clientRepository.getuserdetails(Client, skip, limit);
  }
  async checkemailexists(email: string): Promise<boolean> {
    return await this.clientRepository.checkemailexists(email);
  }
  async clientDetails(user_id: any): Promise<Client | null> {
    return await this.clientRepository.clientDetails(user_id);
  }
  async getChatList(follower: any): Promise<Client | Trainer | null> {
    return await this.clientRepository.getChatList(follower);
  }
}
export { clientUseCaseImpl };
