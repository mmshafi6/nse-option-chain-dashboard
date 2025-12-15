import express from "express";
import cors from "cors";
import optionChainRoute from "./routes/optionChain.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

// ✅ API routes
app.use("/api/option-chain", optionChainRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
