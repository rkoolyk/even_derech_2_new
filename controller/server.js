const express = require('express')
const fileUpload = require('express -fileupload')
//const Model = require('../model/')
const app = express()

app.use(express.urlencoded({
    extended: false
}))
app.use(fileUpload())
app.use(express.static('../view'))

app.get("/", (req, res)=>{
    res.sendFile("./index.html")
})






app.listen(8080)