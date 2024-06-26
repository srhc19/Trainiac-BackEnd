import express, { response } from "express";
import { TrainerControllerImpl } from "../controllers/trainerController";
import { TrainerUseCaseImpl } from "../usecases/trainerUseCase";

import { verifyToken } from "../jwt/verifyToken";
import TrainerRepositoryImpl from "../repositories/trainerRepository";
import multer from "multer";
import { log } from "console";
import ChatRepositoryImpl from "../repositories/chatRepository";
import { chatUseCaseImpl } from "../usecases/chatUseCase";
import { ChatControllerImpl } from "../controllers/chatController";
import adminRepositoryImpl from "../repositories/adminRepository";
import { adminUseCaseImpl } from "../usecases/AdminUseCase";
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

const storage: any = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/");
  },
  filename: (req: any, file: any, cb: any) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

export { upload }; // Optional: Export the upload middleware for use in other modules

const TrainerRepository = new TrainerRepositoryImpl();
const TraineUseCase = new TrainerUseCaseImpl(TrainerRepository);
const TrainerController = new TrainerControllerImpl(TraineUseCase);

const chatRepository = new ChatRepositoryImpl();
const chatUseCase = new chatUseCaseImpl(chatRepository);
const chatController = new ChatControllerImpl(chatUseCase);

const adminRepository = new adminRepositoryImpl();
const adminUseCase = new adminUseCaseImpl(adminRepository);
const adminController = new adminControllerImpl(adminUseCase);

const dataRepository = new dataRepositoryImp();
const dataUseCase = new dataUseCaseImpl(dataRepository);
const dataController = new dataControllerImpl(dataUseCase);

const trainerRouter = express.Router();

trainerRouter.post("/addnewClient", verifyToken, async (req, res) => {
  await TrainerController.addnewClient(req, res);
});
trainerRouter.post("/getClientList", verifyToken, async (req, res) => {
  await TrainerController.getClientList(req, res);
});

trainerRouter.post("/addCardioWorkout", verifyToken, async (req, res) => {
  await TrainerController.addCardioWorkout(req, res);
});
trainerRouter.post("/addGymWorkout", verifyToken, async (req, res) => {
  await TrainerController.addGymWorkout(req, res);
});
trainerRouter.post("/addYogaWorkout", verifyToken, async (req, res) => {
  await TrainerController.addYogaWorkout(req, res);
});
trainerRouter.post(
  "/updateTrainerProfile",
  verifyToken,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
    { name: "certificateImages" },
  ]),
  async (req, res) => {
    await TrainerController.updateTrainerProfile(req, res);
  }
);
trainerRouter.post("/trainerlogin", async (req, res) => {
  await TrainerController.trainerLogin(req, res);
});
trainerRouter.post("/getChatListTrainer", verifyToken, async (req, res) => {
  await TrainerController.getChatList(req, res);
});
trainerRouter.post("/getMessagesTrainer", verifyToken, async (req, res) => {
  await chatController.getMessages(req, res);
});
trainerRouter.post("/startVedioSession", verifyToken, async (req, res) => {
  await TrainerController.startVedioSession(req, res);
});
trainerRouter.post("/getCurrentVedioCallId", verifyToken, async (req, res) => {
  await chatController.getCurrentVedioCallId(req, res);
});

trainerRouter.post("/checkIfTrainer", async (req, res) => {
  await chatController.checkIfTrainer(req, res);
});

trainerRouter.post("/updateSession", verifyToken, async (req, res) => {
  await chatController.updateSession(req, res);
});

trainerRouter.post("/removeWorkout", verifyToken, async (req, res) => {
  await chatController.removeWorkout(req, res);
});

trainerRouter.post(
  "/addBlog",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    await adminController.addBlog(req, res);
  }
);

trainerRouter.post("/getBlogDetails", verifyToken, async (req, res) => {
  await adminController.getBlogDetails(req, res);
});

trainerRouter.post("/viewBlogContent", verifyToken, async (req, res) => {
  await chatController.viewBlogContent(req, res);
});

trainerRouter.post("/publishBlog", verifyToken, async (req, res) => {
  await adminController.changeBlogStatus(req, res);
});
trainerRouter.post("/cancelBlog", verifyToken, async (req, res) => {
  await adminController.cancelBlog(req, res);
});

trainerRouter.post("/currentTrainerBlogList", verifyToken, async (req, res) => {
  await adminController.currentTrainerBlogList(req, res);
});

trainerRouter.post(
  "/addProgress",
  verifyToken,
  upload.fields([
    { name: "frontPhoto", maxCount: 1 },
    { name: "sidePhoto", maxCount: 1 },
    { name: "backPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    await adminController.addProgress(req, res);
  }
);

trainerRouter.post("/getProgressData", verifyToken, async (req, res) => {
  await adminController.getProgressData(req, res);
});

trainerRouter.post("/getprogressDetails", verifyToken, async (req, res) => {
  await adminController.getprogressDetails(req, res);
});
trainerRouter.get("/getSessionList", verifyToken, async (req, res) => {
  await adminController.getSessionList(req, res);
});
trainerRouter.post("/checkIfClient", verifyToken, async (req, res) => {
  await adminController.checkIfClient(req, res);
});

trainerRouter.post("/adminBlogSearch", verifyToken, async (req, res) => {
  await dataController.adminBlogSearch(req, res);
});
trainerRouter.post("/getPaymentData", verifyToken, async (req, res) => {
  await dataController.getPaymentData(req, res);
});
trainerRouter.post(
  "/removeCertificateImages",
  verifyToken,
  async (req, res) => {
    await dataController.removeCertificateImages(req, res);
  }
);
trainerRouter.post("/sendRequestTrainer", verifyToken, async (req, res) => {
  await dataController.sendRequestTrainer(req, res);
});

trainerRouter.post("/getclientsRequest", verifyToken, async (req, res) => {
  await dataController.getclientsRequest(req, res);
});

trainerRouter.post("/acceptClientsRequest", verifyToken, async (req, res) => {
  await dataController.acceptClientsRequest(req, res);
});
trainerRouter.post("/removeClientsRequest", verifyToken, async (req, res) => {
  await dataController.removeClientsRequest(req, res);
});
trainerRouter.post("/clientRequestSearch", verifyToken, async (req, res) => {
  await dataController.clientRequestSearch(req, res);
});
trainerRouter.post("/messageReciversImg", verifyToken, async (req, res) => {
  await dataController.getMessageReciversImg(req, res);
});
trainerRouter.post("/addMessageList", verifyToken, async (req, res) => {
  await dataController.addMessageList(req, res);
});
export default trainerRouter;
