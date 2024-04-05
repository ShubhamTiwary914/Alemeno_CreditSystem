const express = require('express')
const LoansRouter = express.Router();
const LoanController = require('./../controllers/loans/LoanController')


LoansRouter.post('/create-loan', (req,res)=>{
    LoanController.createLoan(req.body, res)
})


LoansRouter.get('/view-loan/:loan_id', (req,res)=>{
    LoanController.viewLoan(req.params, res)
})


LoansRouter.post('/make-payment/:customer_id/:loan_id',(req,res)=>{
    LoanController.loanPayment(req.params, res);
})

LoansRouter.get('/view-statement/:customer_id/:loan_id', (req,res)=>{
    LoanController.viewStatement(req.params, res)
})


module.exports = LoansRouter;