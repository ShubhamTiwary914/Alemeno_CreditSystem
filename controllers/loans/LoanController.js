//*Controller Dependencies
const validate_reqParams = require('./../utils').validateReqParams
const conn = require('./../conn')
//*Controller Methods
const createLoan = require('./_loanCreate')
const viewLoan = require('./_loanSearch')
const payLoan = require('./_loanPayment').loanPayment
const viewLoanStatement = require('./_loanStatus')



function LoanController(){
    this.createLoan = function(reqBody, res){
        createLoan(conn, reqBody, res, validate_reqParams)
    }

    this.viewLoan = function(reqParams, res){
        viewLoan(conn, reqParams, res, validate_reqParams)
    }

    this.loanPayment = function(reqParams, res){
        payLoan(conn, reqParams, res, validate_reqParams)
    }

    this.viewStatement = function(reqParams, res){
        viewLoanStatement(conn, reqParams, res, validate_reqParams)
    }
}


module.exports = new LoanController()