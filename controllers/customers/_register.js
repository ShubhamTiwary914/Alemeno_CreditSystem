const registerParams = ['first_name', 'last_name', 'age', 'monthly_income', 'phone_number']


function getMaxID(conn) {
    return new Promise((resolve, reject) => {
        const query = "SELECT MAX(customer_id) AS max_value FROM customers";
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


function registerQuery(conn, customerData){
    const keys = Object.keys(customerData);
    const values = Object.values(customerData);
    const query = `INSERT INTO customers (${keys.join(', ')}) VALUES (${values.map(value => conn.escape(value)).join(', ')})`;

    conn.query(query, (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            throw err;
        }
    });
}


async function registerCustomer(conn, reqBody, res, validate_reqParams){
    try{
        if(!validate_reqParams(reqBody, registerParams)){
            res.status(203).send(`ERROR: Incorrect Parameters,  Required: ${registerParams}`)
            return;
        }
        //Check Max_ID -> set new ID = Max_ID+1
        let newCustomerID = await getMaxID(conn) + 1
        let approved_limit = Math.ceil((reqBody.monthly_income * 36) / 100000) * 100000;

        let customerData = {...reqBody}
        customerData['customer_id'] = newCustomerID
        customerData['approved_limit'] = approved_limit
        customerData['monthly_salary'] = customerData['monthly_income']
        customerData['current_debt'] = 0
        delete customerData['monthly_income']
        
        registerQuery(conn, customerData)
        res.status(200).json(customerData);
    }
    catch(err){
        throw err;
    }
}


module.exports = registerCustomer

