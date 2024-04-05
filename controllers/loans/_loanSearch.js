const keysRemover = require('./../utils').keysRemover
const viewLoan_params = ['loan_id']


function fetchLoanData(conn, loan_id){
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM loans where loan_id=${loan_id}`;
        conn.query(query, (error, results) => {
            if (error) 
                reject(error);
            resolve(results[0]);
        });
    });
}



async function viewLoan(conn, reqParams, res, parameterValidator){
    if(!parameterValidator(reqParams, viewLoan_params)){
        res.status(203).send(`ERROR: Incorrect Parameters,  Required: ${viewLoan_params}`)
        return;
    }
    try{
        let loanData = await fetchLoanData(conn, reqParams['loan_id'])
        let response = {...loanData}
        response['monthly_installment'] = response['monthly_payment']
        response = keysRemover(response, ['monthly_payment', 'emis_paid_on_time', 'date_of_approval', 'end_date'])
        res.json(response)
    }
    catch(err){
        throw err;
    }
}   

module.exports = viewLoan;