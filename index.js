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



const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log("now listening on port "+port)
})



