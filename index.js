import express from "express";
import { isUuid, uuid  } from "uuidv4";
const fs = require("fs");

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.disable("trust proxy")
const filePath = "user.json";
const encoding = "UTF-8";
let data = JSON.parse(fs.readFileSync(filePath, encoding))

 const  wiriteTofile  =(data,filePath)=>{
    fs.writeFile( filePath, JSON.stringify(data),"utf8",(err)=>{
        if(err){
            console.log(err)
        }
        console.log("file updated")
    })
}





app.get('/users', (req , res)=>{
    res.send(data)
})

app.get('/user/:id', (req , res)=>{
    let id = req.params.id;
        const user = data.find(user => user.id == id);
        if(user == null) {
            id = 0;
            res.send("user not found")
        }else res.send(user);
})

app.post('/user', (req , res)=>{
    try{
        let reqData = req.body;
            const user = data.find(user=> user.email == reqData.email)
            if(user)res.send("email already exist in the database");
            else{
            const newUser = {id:uuid(),...reqData}
            data = [ ...data, newUser]
            wiriteTofile(data,filePath);
            res.send(`${newUser.first_name} has been added successfully`)
        }
    }catch(e){
        res.send(e)
    }
   
})
app.put('/user/:id', (req,res)=>{
    const id = req.params.id;
    const reqData = req.body;
        const userFound = data.find(user=> user.id == id)
        if(userFound){
            const userIndex = data.findIndex((user => user.id == id));
            const updatedDetails = {id:data[userIndex].id, first_name: reqData.first_name, last_name: reqData.last_name, email:data[userIndex].email, gender: reqData.gender, ip_address: reqData.ip_address }
            data[userIndex] = updatedDetails;
            wiriteTofile(data,filePath);
            res.send("user updated successfully");
        } else res.send("user not found")

})

const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log("now listening on port "+port)
})