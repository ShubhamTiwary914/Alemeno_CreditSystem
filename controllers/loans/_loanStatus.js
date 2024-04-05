const keysRemover = require('./../utils').keysRemover

const statementParams = ['loan_id', 'customer_id']
const fetchLoanData = require('./_loanPayment').fetch_loanData



async function viewLoanStatement(conn, reqParams, res, paramsValidator){
    if(!paramsValidator(reqParams, statementParams)){
        res.status(203).send(`ERROR: Incorrect Parameters,  Required: ${statementParams}`)
        return;
    }
    try{
        const loanData = await fetchLoanData(conn, reqParams.customer_id, reqParams.loan_id)
        loanData['monthly_installment'] = loanData['monthly_payment']
        loanData['Amount_paid'] = loanData['emis_paid_on_time'] * loanData['monthly_installment']
        loanData['repayments_left'] = loanData['tenure'] - loanData['emis_paid_on_time']
        const processedData = keysRemover(loanData, ['tenure', 'date_of_approval', 'end_date', 'monthly_payment', 'emis_paid_on_time'])
        res.json(processedData)
    }
    catch(err){
        throw err;
    }
}


module.exports = viewLoanStatement