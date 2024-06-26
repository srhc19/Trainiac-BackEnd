import { ObjectId } from "mongoose";
import {
  premiumInterface,
  requestInterface,
} from "../interfaces/trainerInterface";

class Trainer {
  public user_id: ObjectId;
  public skills: Array<string>;
  public certificates: Array<any>;
  public rating: number;
  public testimonials: object[];
  public clients: Array<string>;
  public followers: Array<string>;
  public messages: Array<String>;
  public description: String;
  public name: string;
  public email: String;
  public profileimage: any;
  public bannerImage: any;
  public certificateImages: any;
  public Bio: string;
  public premium: premiumInterface;
  public requests: requestInterface[];
  public _id?: ObjectId;

  constructor(
    user_id: ObjectId,
    skills: Array<string>,
    certificates: Array<string>,
    rating: number,
    testimonials: object[],
    clients: Array<string>,
    followers: Array<string>,
    messages: Array<string>,
    description: string,
    name: string,
    email: string,
    profileimage: any,
    bannerImage: any,
    certificateImages: any,
    Bio: string,
    premium: premiumInterface,
    requests: requestInterface[],
    _id?: ObjectId
  ) {
    this.user_id = user_id;
    this.skills = skills;
    this.certificates = certificates;
    this.rating = rating;
    this.testimonials = testimonials;
    this.clients = clients;
    this.followers = followers;
    this.messages = messages;
    this.description = description;
    this.name = name;
    this.email = email;
    this.profileimage = profileimage;
    this.bannerImage = bannerImage;
    this.certificateImages = certificateImages;
    this.Bio = Bio;
    this.premium = premium;
    this.requests = requests;
    this._id = _id;
  }
}
export default Trainer;
