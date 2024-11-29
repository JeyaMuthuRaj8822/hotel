const express =require('express');
const app=express();
const http= require('http');
const server= http.createServer(app);
const authRoutes= require('./routes/authRoutes')
const hotelRoutes= require('./routes/hotelRoutes')
const roomRoutes= require('./routes/roomRoutes')
const reservationRoutes= require('./routes/reservationRoutes')
const adminRoutes=require('./routes/adminRoutes')
const dotenv=require('dotenv')
dotenv.config();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//mongodb connection
const connectDB=require('./config/db');
connectDB();

app.use('/auth',authRoutes);

app.use('/admin',adminRoutes);

app.use('/hotel',hotelRoutes);

app.use('/room',roomRoutes);

app.use('/reservation' ,reservationRoutes);

//Server Listening
const port= process.env.port;
server.listen(port,()=>{
    console.log(`Server is Running on ${port}`);
});

