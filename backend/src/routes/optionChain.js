import express from "express";
import { getOptionChain, getExpiryDates } from "../services/nseService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await getOptionChain();
  res.json(data);
});

router.get("/expiries", async (req, res) => {
  const expiries = await getExpiryDates();
  res.json({ expiries });
});

export default router;
