import express from "express";
import cors from "cors";
import optionChainRoute from "./routes/optionChain.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/option-chain", optionChainRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
