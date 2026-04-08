import { WebSocketServer, type WebSocket } from "ws";

const wss = new WebSocketServer({port : 8080});

let userCount = 0;
//for broadcasting we have to maintain a global array in which all the sockets(socket of each client)
//will be present and we will the message to every element(socket) of the array(of sockets)

let allSockets : WebSocket[] = [];

//here socket is a reference to a socket which lets you to talk to the Client which has just 
// connected to the websocket server, now the server can start receiving messages from the  
// client on the socket and also can send messages using the same socket object

wss.on("connection", (socket)=>{ 
    userCount += 1;
    console.log("user connected # " + userCount);

    //to send and receive the messages, we need a handler (socket.on is that handler)
    socket.on("message", (msg)=>{//whenever there is a new message which is coming to the server, call the callback
        console.log("message received " + msg.toString());
        for(let i = 0; i < allSockets.length; i++){
            const s = allSockets[i];
             socket.send(msg.toString())
        }
    })
})