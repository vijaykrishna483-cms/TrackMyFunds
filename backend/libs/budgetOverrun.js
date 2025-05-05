// services/budgetService.js
import { sendEmail } from "../libs/sendEmail.js";

import { pool } from "./database.js";

export const checkBudgetOverrun = async (userId, description) => {
  const budgetRes = await pool.query(
    `SELECT * FROM tblbudgets WHERE user_id = $1 AND description = $2`,
    [userId, description]
  );

  if (budgetRes.rowCount === 0) return;

  const budget = budgetRes.rows[0];

  const transactionRes = await pool.query(
    `SELECT SUM(amount) as total_spent FROM tbltransaction 
     WHERE user_id = $1 AND description = $2 AND type = 'expense'`,
    [userId, description]
  );

  const totalSpent = parseFloat(transactionRes.rows[0].total_spent || 0);

  if (totalSpent > budget.goalamount) {
    const userRes = await pool.query(
      `SELECT email FROM tbluser WHERE id = $1`,
      [userId]
    );

    const userEmail = userRes.rows[0]?.email;

  if (userEmail) {
  const subject = "🚨 Budget Exceeded Alert";
  const plainText = `You've exceeded your budget for "${description}". Budget: ₹${budget.goalamount}, Spent: ₹${totalSpent}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: #dc3545; padding: 20px; color: white; text-align: center;">
          <h2>🚨 Budget Exceeded Alert</h2>
        </div>
        <div style="padding: 20px; color: #333;">
          <p>Hi there,</p>
          <p><strong>You’ve exceeded your budget</strong> for the following goal:</p>
          <ul style="list-style: none; padding-left: 0;">
            <li><strong>Description:</strong> ${description}</li>
            <li><strong>Budget Limit:</strong> ₹${budget.goalamount}</li>
            <li><strong>Amount Spent:</strong> ₹${totalSpent}</li>
          </ul>
          <p>We recommend reviewing your spending and adjusting your plan accordingly.</p>
          <p style="margin-top: 30px;">Stay smart with your money 💰</p>
          <p>– Your Budget Tracker</p>
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to: userEmail,
    subject,
    text: plainText,
    html: htmlContent,
  });
}

  }
};
