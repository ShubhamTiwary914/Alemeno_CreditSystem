const loanCreationParams = ['customer_id', 'loan_amount', 'interest_rate', 'tenure']
const loanApproval = require('./../customers/_checkEligibility').approveLoan


function getMaxID(conn) {
    return new Promise((resolve, reject) => {
        const query = "SELECT MAX(loan_id) AS max_value FROM loans";
        conn.query(query, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                reject(error);
                return;
            }
            const maxID = results[0].max_value;
            resolve(maxID);
        });
    });
}

function getDateNMonthsAway(n) {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + n, currentDate.getDate());
    if (currentDate.getDate() > futureDate.getDate()) 
        futureDate.setDate(0); 
    return futureDate;
}


function registerLoan(conn, customerData){
    const keys = Object.keys(customerData);
    const values = Object.values(customerData);
    const query = `INSERT INTO loans (${keys.join(', ')}) VALUES (${values.map(value => conn.escape(value)).join(', ')})`;

    conn.query(query, (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            throw err;
        }
    });
}




function insertApprovedLoan(conn, approveData, reqBody){
    let currDate = new Date()
    let newLoanData = {
        "customer_id": approveData['customer_id'],
        "loan_id": reqBody['loan_id'],
        "loan_amount": reqBody['loan_amount'],
        "tenure": reqBody['tenure'],
        "interest_rate": reqBody['interest_rate'],
        "monthly_payment": approveData['monthly_installment'],
        "emis_paid_on_time": 0,
        "date_of_approval": currDate,
        "end_date": getDateNMonthsAway(reqBody['tenure'])
    }
    registerLoan(conn, newLoanData)
}


async function createLoan(conn, reqBody, res, validate_reqParams){
    try{
        if(!validate_reqParams(reqBody, loanCreationParams)){
            res.status(203).send(`ERROR: Incorrect Parameters,  Required: ${registerParams}`)
            return;
        }
        let approve = await loanApproval(conn, reqBody)
        let newLoanID = await getMaxID(conn) + 1
        let response = {
            "loan_id": newLoanID,
            "customer_id": reqBody['customer_id'],
            "loan_approved": approve['approval'],
            "monthly_installment": approve['monthly_installment']
        }
        reqBody['loan_id'] = newLoanID
        if(!approve['approval']){
            response['message'] = "Loan wasn't approved, hence process failed"
            res.status(203).json(response)
        }
        else{
            //No issue -> create loan
            insertApprovedLoan(conn, approve, reqBody)
            response['message'] = "Loan was approved, and has been created!"
            res.status(200).json(response);
        }
    }catch(err){
        throw err
    }
}


module.exports = createLoan;