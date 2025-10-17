import express from "express";
import { upload } from "../middleware/upload.js";
import {
  uploadFranchiseFile,
  removeFranchiseFile,
} from "../controllers/uploadController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.post("/franchise/:id", upload.single("file"), uploadFranchiseFile);

router.delete("/franchise/:id", removeFranchiseFile);

export default router;
