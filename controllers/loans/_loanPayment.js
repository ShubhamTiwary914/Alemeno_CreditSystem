const loanPayment_params = ['loan_id', 'customer_id']


function fetch_loanData(conn, customer_id, loan_id){
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM loans where loan_id=${loan_id} AND customer_id=${customer_id}`;
        conn.query(query, (error, results) => {
            if (error) 
                reject(error);
            resolve(results[0]);
        });
    });
}


function update_loanData(conn, loan_id, newLoanData){
    const keys = Object.keys(newLoanData);
    const values = Object.values(newLoanData);
    let query = `UPDATE loans SET `;
    for (let i = 0; i < keys.length; i++) {
        query += `${keys[i]} = ?`;
        if (i !== keys.length - 1) 
            query += ', ';
    }
    query += ` WHERE loan_id = ${loan_id}`;

    conn.query(query, [...values, loan_id], (err, result) => {
        if (err) 
            throw err;
    });
}




async function loanPayment(conn, reqParams, res, parameterValidator){
    //console.log(reqParams)
    //console.log(loanPayment_params)
    if(!parameterValidator(reqParams, loanPayment_params)){
        res.status(203).send(`ERROR: Incorrect Parameters,  Required: ${loanPayment_params}`)
        return;
    }
    try{
        const loanData = await fetch_loanData(conn, reqParams.customer_id, reqParams.loan_id)
        const currDate = new Date()
        //loan is payable when not past end date
        if(loanData['end_date'] >= currDate){
            loanData['emis_paid_on_time']++;
            update_loanData(conn, loanData['loan_id'], loanData)
            res.status(200).json({
                'success': true,
                'params': reqParams 
            })
        }
        else{
            res.status(203).json({
                "success": false,
                "message": "Loan is Already over as it is either due date or cleared off!"
            })
            return;
        }
    }
    catch(err){
        throw err;
    }
}   

module.exports = {
    loanPayment, fetch_loanData
};