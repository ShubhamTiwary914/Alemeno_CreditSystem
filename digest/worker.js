require('dotenv').config()
//*Worker Runs on Redis Backend and Broker
const celery = require("celery-node");
const worker = celery.createWorker("redis://", "redis://");

const conn = require('./../controllers/conn')
const xlsx = require('xlsx');
const path = require('path');


//change column names to lowercase with underscores
function fitColumns(data){
    const newData = data.map(obj => {
    const newObj = {};
        Object.entries(obj).forEach(([key, value]) => {
            const newKey = key.toLowerCase().replace(/\s+/g, '_');
            newObj[newKey] = value;
        });
        return newObj;
    });
    return newData;
}


function databaseInsertion(data, table){
    data.forEach(row => {
        const keys = Object.keys(row);
        const values = Object.values(row);
        const placeholders = keys.map(() => '?').join(',');
        
        const query = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
        conn.query(query, values, (err, result) => {
            if (err) 
                throw err;
            console.log('Data inserted successfully:', result);
        });
    });
}


//processing data for parsing datses
function processRows(data){
    const processedData = data.map(row => {
        Object.entries(row).forEach(([key, value]) => {
            if (!isNaN(value) && value !== '') {
                row[key] = parseFloat(value);
            } else {
                const dateValue = new Date(value);
                if (!isNaN(dateValue.getTime())) {
                    row[key] = dateValue;
                }
            }
        });
        return row;
    });
    return processedData
}


//load Data from sheet and start saving into respective tables
async function saveData(fileName, table){
    const filePath = path.resolve(__dirname, fileName);
    const workbook = xlsx.readFile(filePath);

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const data = xlsx.utils.sheet_to_json(worksheet, { raw: false });
    const newData = fitColumns(data)

    const processedData = processRows(newData)
    databaseInsertion(processedData, table)
}




worker.register("customers.save", (fileName, table) => {
    saveData(fileName, table)
});

worker.register("loans.save", (filePath, table) => {
    saveData(filePath, table)
});


worker.start();

