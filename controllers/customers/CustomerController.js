//*Controller Dependencies
const validate_reqParams = require('./../utils').validateReqParams
const conn = require('./../conn')
//*Controller Methods
const registerCustomer = require('./_register')
const check_loanEligibility = require('./_checkEligibility').check_loanEligibility


function CustomerController(){
    this.register = (reqBody,res) => {
        registerCustomer(conn, reqBody, res, validate_reqParams);
    } 

    this.checkEligibility = (reqBody, res)=>{
        check_loanEligibility(conn, reqBody, res, validate_reqParams)
    }
}

module.exports = new CustomerController

