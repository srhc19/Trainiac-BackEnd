import { ObjectId } from "mongoose";

class VedioSession {
  public trainerId: ObjectId;
  public clientsId: ObjectId[];
  public startedAt: Date;
  public endedAt: Date;
  public currentDate: String;
  public randomId: String;

  constructor(
    trainerId: ObjectId,
    clientsId: ObjectId[],
    startedAt: Date,
    endedAt: Date,
    currentDate: string,
    randomId: String
  ) {
    this.trainerId = trainerId;
    this.clientsId = clientsId;
    this.startedAt = startedAt;
    this.currentDate = currentDate;
    this.endedAt = endedAt;
    this.randomId = randomId;
  }
}

export default VedioSession;
