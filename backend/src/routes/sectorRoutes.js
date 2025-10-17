import express from "express";
import {
  getSectorsByFranchise,
  saveSectors,
  deleteSector,
} from "../controllers/sectorController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/franchise/:franchiseId", getSectorsByFranchise);
router.post("/franchise/:franchiseId", saveSectors);
router.delete("/:id", deleteSector);

export default router;
