import { ObjectId } from "mongoose";
import { clientrequest } from "../interfaces/clientInterface";

class Client {
  public user_id: ObjectId;
  public goals: Array<string>;
  public trainers: Array<String>;
  public workoutRoutine: Array<string>;
  public description: String;
  public name: String;
  public email: String;
  public profileimage: string;
  public bannerImage: string;
  public Bio: string;
  public workoutRoutines: any;
  public followers: Array<String>;
  public requestSended: clientrequest[];
  public messages: Array<String>;
  public _id?: ObjectId;

  constructor(
    user_id: ObjectId,
    goals: Array<string>,
    trainers: Array<String>,
    workoutRoutine: Array<string>,
    description: string,
    name: string,
    email: string,
    profileimage: string,
    bannerImages: string,
    Bio: string,
    followers: Array<String>,
    messages: Array<String>,
    workoutRoutines: any,
    _id: ObjectId
  ) {
    this.user_id = user_id;

    this.goals = goals;
    this.trainers = trainers;
    this.workoutRoutine = workoutRoutine;
    this.followers = followers;
    this.description = description;
    this.name = name;
    this.email = email;
    this.profileimage = profileimage;
    this.bannerImage = bannerImages;
    this.Bio = Bio;
    this.workoutRoutines = workoutRoutine;
    this.messages = messages;
    this._id = _id;
  }
}
export default Client;
