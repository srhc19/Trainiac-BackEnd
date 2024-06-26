import { ObjectId } from "mongoose";
import VedioSession from "../entities/VedioSession";
import Client from "../entities/client";
import Trainer from "../entities/trainer";
import User from "../entities/user";
import { BlogList } from "../interfaces/adminInterface";
import { Blog } from "../interfaces/chatInterface";
import {
  dataRepository,
  dataUseCases,
  orderInterface,
} from "../interfaces/dataInterface";
import dataRepositoryImp from "../repositories/dataRepository";

class dataUseCaseImpl implements dataUseCases {
  constructor(private dataRepository: dataRepositoryImp) {}
  async bloglistSearch(query: string): Promise<BlogList | null> {
    return await this.dataRepository.bloglistSearch(query);
  }

  async adminclientSearch(query: string): Promise<Client[] | null> {
    return await this.dataRepository.adminclientSearch(query);
  }
  async adminTrainerSearch(query: string): Promise<Trainer[] | null> {
    return await this.dataRepository.adminTrainerSearch(query);
  }
  async adminBlogSearch(query: string): Promise<Blog[] | null> {
    return await this.dataRepository.adminBlogSearch(query);
  }
  async adminSessionSearch(query: string): Promise<VedioSession[] | null> {
    return await this.dataRepository.adminSessionSearch(query);
  }
  async getuserdata(userid: string): Promise<User | null> {
    return await this.dataRepository.getuserdata(userid);
  }

  async addPaymentDetails(
    order_id: string,

    _id: ObjectId,
    email: string
  ): Promise<boolean> {
    return await this.dataRepository.addPaymentDetails(
      order_id,

      _id,
      email
    );
  }

  async updateOrder(order_id: string): Promise<orderInterface> {
    return await this.dataRepository.updateOrder(order_id);
  }
  async updatetrainerdb(updatedOrder: orderInterface): Promise<boolean> {
    return await this.dataRepository.updatetrainerdb(updatedOrder);
  }

  async getPaymentData(
    limit: number,
    skip: number
  ): Promise<orderInterface[] | null> {
    return await this.dataRepository.getPaymentData(limit, skip);
  }
  async removeCertificateImages(
    certImage: string,
    user_id: string
  ): Promise<boolean> {
    return await this.dataRepository.removeCertificateImages(
      certImage,
      user_id
    );
  }

  async updateClientProfile(formData: any): Promise<boolean> {
    return await this.dataRepository.updateClientProfile(formData);
  }

  async sendRequestTrainer(client_id: string, trainer_id: string) {
    return await this.dataRepository.sendRequestTrainer(client_id, trainer_id);
  }

  async getClientData(client_id: string) {
    return await this.dataRepository.getClientData(client_id);
  }
  async getclientsRequest(user_id: string) {
    return await this.dataRepository.getclientsRequest(user_id);
  }
  async acceptRequestStatus(
    client_id: string,
    trainer_id: string
  ): Promise<boolean> {
    return await this.dataRepository.acceptRequestStatus(client_id, trainer_id);
  }
  async removeRequestStatus(
    client_id: string,
    trainer_id: string
  ): Promise<boolean> {
    return await this.dataRepository.removeRequestStatus(client_id, trainer_id);
  }
  async clientRequestSearch(query: string): Promise<any> {
    return await this.dataRepository.clientRequestSearch(query);
  }
  async getMessageReciverData(
    receiveremail: string
  ): Promise<Client | Trainer | null> {
    return await this.dataRepository.getMessageReciverData(receiveremail);
  }

  async addtoMessageList(data: User, email: string): Promise<boolean> {
    return await this.dataRepository.addtoMessageList(data, email);
  }

  async isUserBlocked(user_id: string): Promise<boolean> {
    return await this.dataRepository.isUserBlocked(user_id);
  }
  async isUserAdmin(user_id: string): Promise<boolean> {
    return await this.dataRepository.isUserAdmin(user_id);
  }
}
export { dataUseCaseImpl };
