import sqlite3 from 'sqlite3';
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"

const port = 8800;

const app = express();
app.use(cors())
app.use(bodyParser.json());

let db = new sqlite3.Database('./website_database.db');

app.get("/",(req,res)=>{
    res.json("hello this is the backend")
})

app.get("/users",(req,res)=>{
    const q = "SELECT * FROM user"
    db.all(q, function(err,data) {
        if (err) {
          console.log(err.message);
        }
        return res.json(data);
      });
})

app.post("/user", async(req,res)=>{
    const q = "INSERT INTO user (userprofile, usernom, userprenom, userphone) VALUES (?,?,?,?)"
    const values = [
        req.body.userprofile,
        req.body.usernom,
        req.body.userprenom,
        req.body.userphone  
    ];
    db.run(q, values, (err,data)=>{
        if(err)return res.json(err)
        console.log(`user added : ${req.body.usernom}`)
        return res.json(data);
    })
})

app.put("/user/:id", async (req,res)=>{
    const userid = req.params.id;
    const q = "UPDATE user SET usernom = ?, userprenom = ?, userprofile = ?, userphone = ? WHERE userid = ?"
    const values = [
        req.body.usernom,
        req.body.userprenom,
        req.body.userprofile,
        req.body.userphone,
    ]
    db.run(q, [...values, userid], (err,data)=>{
        if(err) console.log(err)
        console.log('user edited')
        return res.json(data);
    })
})

app.delete("/user/:id", async (req,res)=>{
    const userid = req.params.id;
    const q = "DELETE FROM user WHERE userid = ?";
    db.run(q,[userid],(err, data)=>{
        if(err)return res.json(err);
        console.log('user deleted')
        return res.json(data);
    })
})


app.get("/user/:id",(req,res)=>{
    const userid = req.params.id;
    const q = "SELECT * FROM user WHERE userid = ?"
    db.all(q, [userid], (err,data)=>{
        if(err)return res.json(err)
        return res.json(data)
    })
})




























app.listen(port,()=>{
    console.log("Le serveur est lancé au port " + port + " ...");
});