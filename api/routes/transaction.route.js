import express from 'express';
import {
  createsubscriptionTransaction,
  createdownloadsTransactionSingle,
  createdownloadsTransactionBulk,
  createDepositTransaction,
  createRetraitTransaction,
  reverseTransaction,
  createMoneyflow,
  updateMoneyflow,
  deleteMoneyflow,
  getAllMoneyFlow,
  uploadSingleImage,
  getUserTransactions,
  getAllTransactions
} from '../controllers/transaction.controller.js';
import authenticateToken from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/verifyAdmin.js';

const transactionRoute = express.Router();

// Middleware to authenticate all routes
transactionRoute.use(authenticateToken);

// Routes for Moneyflow operations
transactionRoute.post('/moneyflow', (req, res, next) => {
  if (req.isFinance) return createMoneyflow(req, res);
  res.status(403).json({ error: "Unauthorized: Finance permissions required" });
});

transactionRoute.put('/moneyflow/:id', isAdmin, updateMoneyflow);
transactionRoute.delete('/moneyflow/:id', isAdmin, deleteMoneyflow);
transactionRoute.get("",isAdmin,getAllMoneyFlow)

// Routes for transaction operations
transactionRoute.post('/subscription', createsubscriptionTransaction);
transactionRoute.post('/download/single', createdownloadsTransactionSingle);
transactionRoute.post('/download/bulk', createdownloadsTransactionBulk);
transactionRoute.post('/deposit',authenticateToken, uploadSingleImage, createDepositTransaction);
transactionRoute.post('/retrait',authenticateToken,  createRetraitTransaction);

transactionRoute.get('/mine',authenticateToken ,getUserTransactions); 
transactionRoute.get('/all',authenticateToken, isAdmin,getAllTransactions); 

// Admin-restricted transaction routes
transactionRoute.post('/reverse', isAdmin, reverseTransaction);

export default transactionRoute;
