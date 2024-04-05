const celery = require("celery-node");


//Run the Customer Saving Service
const customerClient = celery.createClient("redis://", "redis://");
const customersTask = customerClient.createTask("customers.save");
customersTask.applyAsync([
    "customer_data.xlsx", "customers"
]).get().then(data=>{
    customerClient.disconnect();
});


//Run the Loans Saving Service
const loansClient = celery.createClient("redis://", "redis://");
const loansTask = loansClient.createTask("loans.save");
loansTask.applyAsync([
    "loan_data.xlsx", "loans"
]).get().then(data=>{
    loansClient.disconnect();
});










