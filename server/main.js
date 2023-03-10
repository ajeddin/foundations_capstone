require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
app.use(express.static('public'))

const {
seed,addQoute,getQoute,getAllQoutes,deleteQoute,getGIF
} = require('./controller.js')
app.use(express.json())
app.use(cors())
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public'))
})


app.post('/seed', seed)
app.post('/addQoute', addQoute) 
app.post('/getQoute', getQoute) 
app.post('/getGIF', getGIF) 
app.get('/getAllQoutes',getAllQoutes)
app.delete ('/deleteQoute/:id',deleteQoute)

console.log('connected');




app.listen(8765, () => console.log(`up on ${SERVER_PORT}`))