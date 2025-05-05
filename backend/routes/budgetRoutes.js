import express from "express";
import { addBudget, getBudgets } from "../controllers/budgetController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getBudgets);
router.post("/addBudget", authMiddleware, addBudget);
// router.post("/add-transaction/:account_id", authMiddleware, addTransaction);
// router.put("/transfer-money", authMiddleware, transferMoneyToAccount);

export default router;