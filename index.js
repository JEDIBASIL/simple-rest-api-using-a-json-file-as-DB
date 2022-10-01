import express from "express";
import { isUuid, uuid  } from "uuidv4";
const fs = require("fs");

const AppRouter = express.Router();
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.disable("trust proxy")
const filePath = "user.json";
const encoding = "UTF-8";

 const  wiriteTofile  =(data,filePath)=>{
    fs.writeFile( filePath, JSON.stringify(data),"utf8",(err)=>{
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
    let id = req.params.id;
    const jsonFormat = fs.readFile(filePath, encoding,(err, data)=>{
        const userData = JSON.parse(data);
        const user = userData.filter(user => user.id == id);
        if(user.length == 0) {
            id = 0;
            res.send("user not found")
        }else res.send(user[0]);
    });
})

app.post('/user', (req , res)=>{
    try{
        let reqData = req.body;
        const jsonFormat = fs.readFile(filePath, encoding,(err, data)=>{
            let userData = JSON.parse(data);
            const user = userData.find(user=> user.email == reqData.email)
            if(user)res.send("email already exist in the database");
            else{
            const newUser = {id:uuid(),...reqData}
            userData = [ ...userData, newUser]
            wiriteTofile(userData,filePath);
            res.send("user added Successfully")
        }
        }) 
    }catch(e){
        res.send(e)
    }
   
})
app.put('/user/:id', (req,res)=>{
    const id = req.params.id;
    const reqData = req.body;
    const jsonFormat = fs.readFile(filePath, encoding,(err, data)=>{
        let userData = JSON.parse(data);
            const userFound = userData.find(user=> user.id == id)
            if(userFound){
                const userIndex = userData.findIndex((user => user.id == id));
                const updatedDetails = {id:userData[userIndex].id, first_name: reqData.first_name, last_name: reqData.last_name, email:userData[userIndex].email, gender: reqData.gender, ip_address: reqData.ip_address }
                userData[userIndex] = updatedDetails;
                console.log(userData)
            wiriteTofile(userData,filePath);
            res.send("user updated successfully");
            } else res.send("user not found")
             
        // 
    });
})

const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log("now listening on port "+port)
})