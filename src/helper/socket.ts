import { Server as SocketIOServer, ServerOptions } from "socket.io";
import http from "http";
import ChatModel from "../models/chatmodel";
const users = {};
export const createSocketServer = (httpServer: http.Server): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
    },
  });

  // Handle Socket.IO events here
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("chat message", async (msg: any) => {
      const message = new ChatModel({
        senderEmail: msg.senderId,
        receiverEmail: msg.receiverId,
        content: msg.content,
        read: false,
      });
      await message.save();
      msg._id = message._id;
      console.log("message: ", msg);
      io.emit(`chat message ${msg.receiverId}`, msg);
    });

    socket.on("message read", async (msgId: string) => {
      console.log(msgId, "message id in socket ");
      let _id = msgId;
      const message = await ChatModel.findOne({ _id });
      if (message) {
        message.read = true;
        await message.save();
      }

      console.log(message, "updated message in socket");
      if (message) {
        io.emit(`message read ${message.senderEmail}`, { messageId: msgId });
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};
