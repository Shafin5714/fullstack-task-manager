import { Router } from "express";
import {
  logout,
  login,
  register,
  getAllUsers,
} from "../controllers/user.controller";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/").get(getAllUsers);

export default router;
