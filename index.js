import express from "express";
import { isUuid, uuid  } from "uuidv4";
import multer from "multer";
const fs = require("fs");
const path = require("path")
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.disable("trust proxy")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,__dirname+'/public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, uuid() + path.extname(file.originalname)) //Appending extension
    }
  });

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

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        const {first_name,last_name,email,gender,ip_address} = req.body
        if(first_name.trim() == "" || last_name.trim() == "" || email.trim() == "" || gender.trim() == "" || ip_address.trim() == "") return callback(new Error('fields are empty'))
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
});


app.post('/user', upload.single('img'),  (req , res)=>{
    try{
        const reqData = req.body;
        const {first_name,last_name,email,gender,ip_address} = req.body
        console.log("file "+req.file)
        if(first_name.trim() == "" || last_name.trim() == "" || email.trim() == "" || gender.trim() == "" || ip_address.trim() == "" || req.file.path == "") return res.send({status:"failed", message:"field is empty"})
        if(req.file == undefined) return res.send({status:"failed", message:"no image selected"})
        const user = data.find(user=> user.email == email)
        if(user)return res.send({status:"failed", message:"email already exist in the database"});
        const newUser = {id:uuid(),...reqData, img:req.file.path}
        data = [ ...data, newUser]
        wiriteTofile(data,filePath);
        return res.send({status:"success", message:`${newUser.first_name} has been added successfully`});
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