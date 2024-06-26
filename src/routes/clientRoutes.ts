import express from "express";

import http from "http";
import { Server } from "socket.io";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server);
import { verifyToken } from "../jwt/verifyToken";
import clientRepositoryImp from "../repositories/clientRepository";
import { clientUseCaseImpl } from "../usecases/clientUseCase";
import { clientcontrollerImpl } from "../controllers/clientController";
import { UserControllerImpl } from "../controllers/UserController";
import multer from "multer";
import { log } from "console";
import ChatRepositoryImpl from "../repositories/chatRepository";
import { chatUseCaseImpl } from "../usecases/chatUseCase";
import { ChatControllerImpl } from "../controllers/chatController";
import adminRepositoryImpl from "../repositories/adminRepository";
import { adminUseCaseImpl } from "../usecases/adminUseCase";
import { adminControllerImpl } from "../controllers/adminController";
import dataRepositoryImp from "../repositories/dataRepository";
import { dataUseCaseImpl } from "../usecases/dataUseCases";
import { dataControllerImpl } from "../controllers/dataController";

interface MulterStorageOptions {
  destination: (
    req: any,
    file: any,
    cb: (error: Error | null, destination: string) => void
  ) => void;
  filename: (
    req: any,
    file: any,
    cb: (error: Error | null, filename: string) => void
  ) => void;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

export { upload };

const clientRepository = new clientRepositoryImp();
const clientuseCaseses = new clientUseCaseImpl(clientRepository);
const clientController = new clientcontrollerImpl(clientuseCaseses);
const clientRouter = express.Router();

const chatRepository = new ChatRepositoryImpl();
const chatUseCase = new chatUseCaseImpl(chatRepository);
const chatController = new ChatControllerImpl(chatUseCase);

const adminRepository = new adminRepositoryImpl();
const adminUseCase = new adminUseCaseImpl(adminRepository);
const adminController = new adminControllerImpl(adminUseCase);

const dataRepository = new dataRepositoryImp();
const dataUseCase = new dataUseCaseImpl(dataRepository);
const dataController = new dataControllerImpl(dataUseCase);

clientRouter.post("/trainerlist", verifyToken, async (req, res) => {
  await adminController.trainerlist(req, res);
});

clientRouter.post("/exercises", verifyToken, async (req, res) => {
  await clientController.getExercises(req, res);
});

clientRouter.post(
  "/updateClientProfile",
  verifyToken,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  async (req, res) => {
    await dataController.updateClientProfile(req, res);
  }
);
clientRouter.post("/clientLogin", async (req, res) => {
  await clientController.clientLogin(req, res);
});
// clientRouter.get("/chat", async (req, res) => {
//   await clientController.chat(req, res);
// });

clientRouter.post("/getChatList", verifyToken, async (req, res) => {
  await clientController.getChatList(req, res);
});

clientRouter.post("/getMessages", verifyToken, async (req, res) => {
  await chatController.getMessages(req, res);
});

clientRouter.post("/checkForVedioSession", verifyToken, async (req, res) => {
  await chatController.checkForVedioSession(req, res);
});

clientRouter.post("/getBlogListClients", verifyToken, async (req, res) => {
  await adminController.getBlogList(req, res);
});
clientRouter.post("/getTrainerData", verifyToken, async (req, res) => {
  await adminController.getTrainerData(req, res);
});
clientRouter.post("/addTestimonial", verifyToken, async (req, res) => {
  await adminController.addTestimonial(req, res);
});
clientRouter.post("/getTestimonial", verifyToken, async (req, res) => {
  await adminController.getTestimonial(req, res);
});

// clientRouter.post(
//   "/editprogressImage",
//   upload.fields([
//     { name: "frontPhoto", maxCount: 1 },
//     { name: "sidePhoto", maxCount: 1 },
//     { name: "backPhoto", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     await adminController.editprogressImage(req, res);
//   }
// );

clientRouter.post(
  "/addBackPhoto",
  verifyToken,
  upload.single("backPhoto"),
  async (req, res) => {
    await adminController.addBackPhoto(req, res);
  }
);

clientRouter.post(
  "/addSidePhoto",
  verifyToken,
  upload.single("sidePhoto"),
  async (req, res) => {
    await adminController.addSidePhoto(req, res);
  }
);

clientRouter.post(
  "/addFrontPhoto",
  verifyToken,
  upload.single("frontPhoto"),
  async (req, res) => {
    await adminController.addFrontPhoto(req, res);
  }
);

clientRouter.post("/updateProgress", verifyToken, async (req, res) => {
  await adminController.updateProgress(req, res);
});

clientRouter.post("/bloglistSearch", verifyToken, async (req, res) => {
  await dataController.bloglistSearch(req, res);
});

export default clientRouter;
