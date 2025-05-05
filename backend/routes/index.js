import express from 'express';
import authRoutes from './authRoutes.js';
import accountRoutes from './accountRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import userRoutes from './userRoutes.js';
import budgetRoutes from './budgetRoutes.js'
const router =express.Router();
router.use('/auth', authRoutes);
router.use('/account', accountRoutes);  
router.use('/transaction', transactionRoutes);
router.use('/user', userRoutes);
router.use('/budget',budgetRoutes)
export default router;