import express from "express";
const fs = require("fs");

const AppRouter = express.Router();
const app = express();
const filePath = "user.json";
const encoding = "UTF-8";





app.get('/users', (req , res)=>{
    const jsonFormat = fs.readFile(filePath, encoding,(err, data)=>{
        res.send(JSON.parse(data));
    });
})

app.get('/user/:id', (req , res)=>{
    const id = req.params.id;
    const jsonFormat = fs.readFile(filePath, encoding,(err, data)=>{
        const userData = JSON.parse(data);
        res.send(userData.filter(user => user.id == id));
        res.send("found")
    });
})

const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log("now listening on port "+port)
})



