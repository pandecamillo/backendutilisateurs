import express, { json } from "express";
import mysql from "mysql2"
import cors from "cors"

const port = process.env.port || 8800;

const app = express();
const db = mysql.createPool({
host : 'database-iss-kin-utilisateurs.a.aivencloud.com',
user : 'avnadmin',	
password : 'AVNS_VSLSgnx6Ow2LMUaXxTG',
database : 'defaultdb',
port: 11901    
})

db.getConnection(()=>{
    console.log("connected to database !")
})

app.use(cors());
app.use(json());

app.get("/",(req,res)=>{
  res.json("hello this is the backend")
})

app.get("/users",(req,res)=>{
    const q = "SELECT `userid`, `usernom`, `userprenom`, `userphone` FROM user"
    db.query(q, (err,data)=>{
        if(err)return res.json(err)
        console.log("read all users")
        return res.json(data)
    })
})


app.post("/user", async(req,res)=>{
    const q = "INSERT INTO user (`usernom`, `userprenom`, `userphone`) VALUES (?,?,?)"
    const values = [
        req.body.usernom,
        req.body.userprenom,
        req.body.userphone  
    ];
    db.query(q, values, (err,data)=>{
        if(err)return res.json(err)
        console.log(`add user : ${req.body.usernom}`)
        return res.json(data);
    })
})


app.put("/user/:id", async (req,res)=>{
    const userid = req.params.id;
    const q = "UPDATE user SET usernom = ?, userprenom = ?, userphone = ? WHERE userid = ?"
    const values = [
        req.body.usernom,
        req.body.userprenom,
        req.body.userphone,
    ]
    db.query(q, [...values, userid], (err,data)=>{
        if(err) console.log(err)
        console.log('user edited')
        return res.json(data);
    })
})

app.delete("/user/:id", async (req,res)=>{
    const userid = req.params.id;
    const q = "DELETE FROM user WHERE userid = ?";
    db.query(q,[userid],(err, data)=>{
        if(err)return res.json(err);
        console.log('user deleted')
        return res.json(data);
    })
})

app.get("/user/:id",(req,res)=>{
    const userid = req.params.id;
    const q = "SELECT  `userid`, `usernom`, `userprenom`, `userphone` FROM user WHERE userid = ?"
    db.query(q, [userid], (err,data)=>{
    if(err)return res.json(err)
        return res.json(data)
    })
})


app.listen(port,()=>{
    console.log("Le serveur est lancé au port " + port + " ...");
});
