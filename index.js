import express from "express";
import { isUuid, uuid } from "uuidv4";
const fs = require("fs");

const AppRouter = express.Router();
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const filePath = "user.json";
const encoding = "UTF-8";

 const  wiriteTofile  =(data,filePath)=>{
    const jsonData = JSON.stringify(data)
    fs.writeFile(filePath,jsonData,"utf8",(err)=>{
        if(err){
            console.log(err)
        }
        console.log("file updated")
    })
}





app.get('/users', (req , res)=>{
    const jsonFormat = fs.readFile(filePath, encoding,(err, data)=>{
        res.send(JSON.parse(data));
    });
})

app.get('/user/:id', (req , res)=>{
    const id = req.params.id;
    const jsonFormat = fs.readFile(filePath, encoding,(err, data)=>{
        const userData = JSON.parse(data);
        if(id = null) res.send("User not found")
        res.send(userData.filter(user => user.id == id));
        res.send("found")
    });
})

app.post('/user', async (req , res)=>{
    try{
        let reqData = req.body;
        const jsonFormat = fs.readFile(filePath, encoding,(err, data)=>{
            let userData = JSON.parse(data);
            const newUser = {id:uuid(),...reqData}
            userData = { ...userData, newUser}
            wiriteTofile(userData,filePath);
            res.send(userData)
        }) 
    }catch(e){
        res.send(e)
    }
   
})

const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log("now listening on port "+port)
})



