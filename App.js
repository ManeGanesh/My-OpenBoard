const express = require('express')
const socket =require('socket.io')

const app=express();  // initialized and server ready

app.use(express.static("Public"));

let port=process.env.PORT || 3000;
let server = app.listen(port,() =>{
    console.log("listening to port " + port);
});


let io = socket(server);

io.on("connection",(socket) => {

console.log("Made socket connection");

// Received data

socket.on("beginPath",(data) =>{
    // data from frontend
    // now transfer data to all connected computers
    io.sockets.emit("beginPath",data);


    

})


socket.on("drawStroke",(data) => {

    io.sockets.emit("drawStroke",data);


})

socket.on("undeoRedoCanvas",(data)=>{


    io.sockets.emit("undeoRedoCanvas",data);
})


})


