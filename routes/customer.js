const express = require('express');
const CustomerController = require('./../controllers/customers/CustomerController')
const CustomerRouter = express.Router();


CustomerRouter.post('/register',(req,res)=>{
    CustomerController.register(req.body, res)
})

CustomerRouter.post('/check-eligibility', (req,res)=>{
    CustomerController.checkEligibility(req.body, res);
})



module.exports = CustomerRouter;