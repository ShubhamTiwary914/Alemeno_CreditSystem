const loanEligibilityParams = ['customer_id', 'loan_amount', 'interest_rate', 'tenure']



function fetch_customerLoans(conn, customerID){
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM loans where customer_id=${customerID}`;
        console.log(query)
        conn.query(query, (error, results) => {
            if (error) 
                reject(error);
            resolve(results);
        });
    });
}


//(Adjustable)Factors priority weight used for setting credits
const weights = [0.40,0.20,0.15];
/*
    *Credit System Factors & Weights:
        - Loans Completed (end-date < current-date): Weight: 35%
        - Current Loans taken: Weight 20%
        - How much larger the difference is from max of the values of requested loan(if requested < max val -> yes):
            - Interest Difference (15%)
            - Tenure Difference (15%)
            - Amount Difference (15%)

*/

function calculateScore(maxLimit, current, weight) {
    const scoreDifficulity = 20;
    // If current <= maxLimit, return more score when current is lower
    let res = 0;
    if (current <= maxLimit) {   
        res = Math.round(100 - ((maxLimit - current) / maxLimit) * 100);
    // If current > maxLimit, return lesser score when current is larger
    } else {
        res = Math.round(100 - ((current - maxLimit) / current) * 100);
    }
    return Math.round((res/(weight*scoreDifficulity)));
}



function calculateCredit(customerLoans, currentNeed){
    const currentDate = new Date()
    const totalLoans = customerLoans.length;
    let loansCompleted = 0;

    let maxTenure = 0;
    let maxInterest = 0;
    let maxAmount = 0;
    
    for(let loanIndex=0; loanIndex<customerLoans.length; loanIndex++){
        //check if loan completed
        if(customerLoans[loanIndex]['end_date'] <= currentDate)
            loansCompleted++
        maxTenure = Math.max(maxTenure, customerLoans[loanIndex]['tenure'])
        maxInterest = Math.max(maxInterest, customerLoans[loanIndex]['interest_rate'])
        maxAmount = Math.max(maxAmount, customerLoans[loanIndex]['loan_amount'])
    }
    const currentLoans = totalLoans - loansCompleted;
    let credit = 0;
    //credit add on basis of loans completed & current loans (compledt loans -> good) || (current loans -> bad)
    if(totalLoans >= 1)
        credit += (Math.round((loansCompleted/totalLoans) * weights[0])) - (Math.round((currentLoans/totalLoans) * weights[1]))
    credit += calculateScore(maxTenure, currentNeed['tenure'], weights[2]);
    credit += calculateScore(maxInterest, currentNeed['interest_rate'], weights[2]);
    credit += calculateScore(maxAmount, currentNeed['loan_amount'], weights[2]);

    return credit;
}



async function approveLoan(conn, reqBody){
    let customerLoans = await fetch_customerLoans(conn, reqBody['customer_id'])
    let credit = calculateCredit(customerLoans, reqBody)

    let approvedResponse = {...reqBody}
    if(credit >= 50){
        approvedResponse['approval'] = true;
        approvedResponse['corrected_interest_rate'] = reqBody['interest_rate']
    }else if(credit >= 30 && credit < 50){
        approvedResponse['approval'] = true;
        approvedResponse['corrected_interest_rate'] = 12
    }else if(credit >= 10 && credit < 30){
        approvedResponse['approval'] = true;
        approvedResponse['corrected_interest_rate'] = 16
    }else{
        approvedResponse['approval'] = false;
        approvedResponse['corrected_interest_rate'] = reqBody['interest_rate']
    }
    approvedResponse['monthly_installment'] = Math.round(reqBody['loan_amount']/reqBody['tenure'])
    delete approvedResponse['loan_amount']
    return approvedResponse
}





async function check_loanEligibility(conn, reqBody, res, paramsValidator){
    try{
        if(!paramsValidator(reqBody, loanEligibilityParams)){
            res.status(203).send(`ERROR: Incorrect Parameters,  Required: ${registerParams}`)
            return;
        }
        const loanApproval = await approveLoan(conn, reqBody)
        res.status(201).json(loanApproval);
    }
    catch(err){
        throw err;
    }
}

module.exports = {
    check_loanEligibility, approveLoan
};