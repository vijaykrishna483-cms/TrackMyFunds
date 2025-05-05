import express from "express";
import {
  addTransaction,
  deleteTransaction,
  getDashboardInformation,
  getTransactions,
  transferMoneyToAccount,
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTransactions);
router.get("/dashboard", authMiddleware, getDashboardInformation);
router.post("/add-transaction/:account_id", authMiddleware, addTransaction);
router.put("/transfer-money", authMiddleware, transferMoneyToAccount);
router.delete("/:transaction_id",authMiddleware,deleteTransaction)
export default router;