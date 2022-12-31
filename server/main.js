require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const {
seed,addQoute,getQoute
} = require('./controller.js')

app.use(express.json())
app.use(cors())


app.post('/seed', seed)
app.post('/addQoute', addQoute) 
app.post('/getQoute', getQoute) 



console.log('connected');




app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))