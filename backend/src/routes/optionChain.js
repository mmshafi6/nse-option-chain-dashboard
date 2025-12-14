import express from "express";
import { getOptionChain, getExpiryDates } from "../services/nseService.js";
import { calculatePCR } from "../utils/pcr.js";
import { calculateMaxPain } from "../utils/maxPain.js";

const router = express.Router();

router.get("/expiries", async (req, res) => {
  const expiries = await getExpiryDates();
  res.json({ expiries });
});

router.get("/", async (req, res) => {
  const data = await getOptionChain();
  const records = data.records.data;

  res.json({
    spot: data.records.underlyingValue,
    pcr: calculatePCR(records),
    maxPain: calculateMaxPain(records),
    records
  });
});

export default router;
