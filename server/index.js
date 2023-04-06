import express from "express";
import dotenv from "dotenv"; 
import { data } from "./data/data.js";
import cors from "cors"


const app= express();
dotenv.config();
app.use(express.json())
app.use(cors())

const port = process.env.PORT

app.get('/', (req,res)=>{
    res.send('Welcome to the Girls World');
})


app.get('/api/product',(req,res)=>{
    res.status(200).json(data)
})
// listen to port

app.listen(port,()=>{
    console.log(`server is connected to port ${port}`)
});