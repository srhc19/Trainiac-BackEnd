import { ObjectId } from "mongoose";

class User {
  public name: string;
  public password: string;
  public role: string;
  public email: string;
  public isAdmin: boolean;
  public isblocked?: boolean;
  public isVerified: boolean;
  public otp: number;
  public otpExpirationTime: Date;
  public _id?: ObjectId;

  constructor(
    name: string,
    password: string,
    role: string,
    email: string,
    isAdmin: boolean,
    isblocked: boolean,
    otpExpirationTime: Date,
    isVerified: boolean,
    otp: number,
    id?: ObjectId
  ) {
    this.name = name;
    this.password = password;
    this.role = role;
    this.email = email;
    this.isVerified = isVerified;
    this.isAdmin = isAdmin;
    this.isblocked = isblocked;
    this.otpExpirationTime = otpExpirationTime;
    this.otp = otp;
    this._id = id;
  }
}
export default User;
