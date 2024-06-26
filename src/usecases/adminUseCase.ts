import exp from "constants";
import adminRepositoryImpl from "../repositories/adminRepository";
import { Blog, BlogContent } from "../interfaces/chatInterface";
import { BlogList, ProgressData } from "../interfaces/adminInterface";
import { promises } from "dns";
import { ObjectId } from "mongoose";
import Client from "../entities/client";
import Trainer from "../entities/trainer";

class adminUseCaseImpl implements adminUseCaseImpl {
  constructor(private adminRepository: adminRepositoryImpl) {}

  async addBlog(blogDetails: Blog): Promise<boolean> {
    return await this.adminRepository.addBlog(blogDetails);
  }

  async changeBlogStatus(_id: string): Promise<BlogContent | null> {
    return await this.adminRepository.changeBlogStatus(_id);
  }
  async cancelBlog(_id: string, note: string): Promise<BlogContent | null> {
    return await this.adminRepository.cancelBlog(_id, note);
  }
  async getBlogList(skip: number, limit: number): Promise<BlogList[] | null> {
    return await this.adminRepository.getBlogList(skip, limit);
  }
  async getBlogUserDetails(_id: string): Promise<string | null> {
    return await this.adminRepository.getBlogUserDetails(_id);
  }
  async currentTrainerBlogList(
    user_id: string,
    skip: number,
    limit: number
  ): Promise<BlogContent[] | null> {
    return await this.adminRepository.currentTrainerBlogList(
      user_id,
      skip,
      limit
    );
  }
  async addProgress(progressData: ProgressData): Promise<boolean> {
    return await this.adminRepository.addProgress(progressData);
  }

  async getProgressData(user_id: string): Promise<ProgressData[] | null> {
    return await this.adminRepository.getProgressData(user_id);
  }

  async getprogressDetails(_id: string): Promise<ProgressData | null> {
    return await this.adminRepository.getprogressDetails(_id);
  }

  async getSessionData(): Promise<any> {
    return await this.adminRepository.getSessionList();
  }
  async getclientnames(clientsIds: ObjectId[]): Promise<Client | null> {
    return await this.adminRepository.getclientnames(clientsIds);
  }
  async gettrainername(trainerId: ObjectId): Promise<any> {
    return await this.adminRepository.gettrainername(trainerId);
  }
  async checkIfClient(id: ObjectId): Promise<boolean> {
    return await this.adminRepository.checkIfClient(id);
  }
  async getTrainerData(email: string): Promise<Trainer | null> {
    return await this.adminRepository.getTrainerData(email);
  }

  async addTestimonial(content: string, user_id: string): Promise<boolean> {
    return await this.adminRepository.addTestimonial(content, user_id);
  }

  async getTestimonial(trainerId: string): Promise<Trainer | null> {
    return await this.adminRepository.getTestimonial(trainerId);
  }

  async trainerlist(skip: number, limit: number): Promise<any> {
    return await this.adminRepository.trainerlist(skip, limit);
  }

  async updateProgress(
    updatedData: ProgressData,
    _id: string
  ): Promise<boolean> {
    return await this.adminRepository.updateProgress(updatedData, _id);
  }

  async trainerlistSearch(query: string): Promise<Trainer | null> {
    return await this.adminRepository.trainerlistSearch(query);
  }
  async getBlogDetails(skip: number, limit: number): Promise<any[] | null> {
    return await this.adminRepository.getBlogDetails(skip, limit);
  }
}

export { adminUseCaseImpl };
