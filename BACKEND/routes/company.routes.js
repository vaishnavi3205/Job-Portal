import express from "express";
import isAuthenticated, { isRecruiter } from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany, deleteCompany } from "../controllers/company.controller.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, isRecruiter, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, isRecruiter, upload.single("file"), updateCompany);
router.route("/delete/:id").delete(isAuthenticated, isRecruiter, deleteCompany);

export default router;