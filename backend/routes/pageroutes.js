import express from "express";
import {
  createPage,
  getPages,
  getPageById,
  updatePage,
  deletePage,
} from "../controller/pagecontroller.js";

const router = express.Router();

router.post("/createpage", createPage);
router.get("/getpages", getPages);
router.get("/getpage/:id", getPageById);
router.put("/updatepage/:id", updatePage);
router.delete("/deletepage/:id", deletePage);

export default router;
