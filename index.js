const express = require('express');
const app = express();
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer)

let connections = [];
io.on('connect',(socket) => {
    connections.push(socket);
    console.log(`${socket.id} has connected`);

    socket.on('down',(data) => {
        connections.forEach(con => {
            if(con.id !== socket.id){
                con.emit('ondown' , {x:data.x , y:data.y});
            }
        })
    })

    socket.on('draw' , (data) => {
      connections.forEach(con => {
        
            con.emit('ondraw' , { x : data.x , y : data.y});
        
      });  
    });

    socket.on('disconnect' ,(reason) => {
      connections = connections.filter(con => con.id !== socket.id); 
      console.log(reason);
    });
});
app.use(express.static("public"));

const PORT  = 5000;
httpServer.listen(PORT , ()=>console.log(`Server started on port ${PORT}`))