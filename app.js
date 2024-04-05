//*Load Dependencies
require("dotenv").config()
const express = require("express")
const morgan = require('morgan')

const App = express()
const CustomerRouter = require('./routes/customer')
const LoansRouter = require('./routes/loans')


//*Middlewares
App.use(morgan('dev'))
App.use(express.json())
App.use(CustomerRouter)
App.use('/', LoansRouter)


//*Test Connection
App.get('/', (req,res)=>{
    res.send("Sucessfully Connected to the Server!")
})



//*Start the HTTP Server
const host = process.env.HOST || "localhost"
const port = process.env.PORT || 8000
App.listen(port, ()=>{
    console.log(`HTTP Server Started @PORT: ${port} \nInitiate a test GET Request @ http://${host}:${port}/`)
})


