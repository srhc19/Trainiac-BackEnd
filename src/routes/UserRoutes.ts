import express from "express";
import { UserControllerImpl } from "../controllers/UserController";
import { CreateUserUseCaseImpl } from "../usecases/CreateUserUseCase";
import UserRepositoryImpl from "../repositories/userRepository";
import { verifyToken } from "../jwt/verifyToken";
import adminRepositoryImpl from "../repositories/adminRepository";
import { adminUseCaseImpl } from "../usecases/adminUseCase";
import { adminControllerImpl } from "../controllers/adminController";
import dataRepositoryImp from "../repositories/dataRepository";
import { dataUseCaseImpl } from "../usecases/dataUseCases";
import { dataControllerImpl } from "../controllers/dataController";

const userRepository = new UserRepositoryImpl();
const createUserUseCase = new CreateUserUseCaseImpl(userRepository);
const userController = new UserControllerImpl(createUserUseCase);
const userRouter = express.Router();
const adminRepository = new adminRepositoryImpl();
const adminUseCase = new adminUseCaseImpl(adminRepository);
const adminController = new adminControllerImpl(adminUseCase);
const dataRepository = new dataRepositoryImp();
const dataUseCase = new dataUseCaseImpl(dataRepository);
const dataController = new dataControllerImpl(dataUseCase);
userRouter.post("/register", async (req, res) => {
  await userController.register(req, res);
});

// userRouter.post("/login", async (req, res) => {
//   await userController.login(req, res);
// });
userRouter.post("/userdata", verifyToken, async (req, res) => {
  await userController.getUserdata(req, res);
});

userRouter.post("/verifyOtp", async (req, res) => {
  await userController.verifyOtp(req, res);
});

userRouter.post("/changeUserStatus", verifyToken, async (req, res) => {
  await userController.changeUserStatus(req, res);
});

userRouter.get("/resendotp", async (req, res) => {
  await userController.resendotp(req, res);
});
userRouter.post("/verifyEmail", async (req, res) => {
  await userController.verifyEmail(req, res);
});

userRouter.post("/verifyEmailOtp", async (req, res) => {
  await userController.verifyEmailOtp(req, res);
});

userRouter.post("/updatePassword", async (req, res) => {
  await userController.updatePassword(req, res);
});

userRouter.post("/getCurrentUser", verifyToken, async (req, res) => {
  await userController.getCurrentUser(req, res);
});
userRouter.post("/getCurrentTrainer", verifyToken, async (req, res) => {
  await userController.getCurrentTrainer(req, res);
});

userRouter.post("/getCurrentClient", verifyToken, async (req, res) => {
  await userController.getCurrentClient(req, res);
});

userRouter.post("/trainerlistSearch", verifyToken, async (req, res) => {
  await adminController.trainerlistSearch(req, res);
});

userRouter.post("/razorpay", verifyToken, async (req, res) => {
  await dataController.razorpay(req, res);
});
userRouter.post("/razorpaySuccess", verifyToken, async (req, res) => {
  await dataController.razorpaySuccess(req, res);
});
// userRouter.post("/razorpayFailure", async (req, res) => {
//   await dataController.razorpayFailure(req, res);
// });
userRouter.post("/adminclientSearch", verifyToken, async (req, res) => {
  await dataController.adminclientSearch(req, res);
});
userRouter.post("/adminTrainerSearch", verifyToken, async (req, res) => {
  await dataController.adminTrainerSearch(req, res);
});
userRouter.post("/adminSessionSearch", verifyToken, async (req, res) => {
  await dataController.adminSessionSearch(req, res);
});
userRouter.post("/refreshtoken", async (req, res) => {
  await dataController.refreshToken(req, res);
});

userRouter.post("/isUserBlocked", async (req, res) => {
  await dataController.isUserBlocked(req, res);
});
userRouter.post("/isUserAdmin", async (req, res) => {
  await dataController.isUserAdmin(req, res);
});
export default userRouter;
