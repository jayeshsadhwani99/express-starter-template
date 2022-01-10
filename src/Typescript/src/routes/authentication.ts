import express from "express";
import { login, signup } from "../controllers/authentication";
const router = express.Router();

router.route("/").post(login);

router.route("/signup").post(signup);

export = router;
