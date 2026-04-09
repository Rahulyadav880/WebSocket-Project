import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let allSockets = [];
//here socket is a reference to a socket which lets you to talk to the Client which has just 
// connected to the websocket server, now the server can start receiving messages from the  
// client on the socket and also can send messages using the same socket object
wss.on("connection", (socket) => {
    // allSockets.push(socket);//pushing all the sockets in the array for broadcasting
    // userCount += 1;
    // console.log("user connected # " + userCount);
    // //to send and receive the messages, we need a handler (socket.on is that handler)
    // socket.on("message", (msg)=>{//whenever there is a new message which is coming to the server, call the callback
    //     console.log("message received " + msg.toString());
    //     for(let i = 0; i < allSockets.length; i++){
    //         //@ts-ignore
    //         const s : WebSocket = allSockets[i];
    //          s.send(msg.toString())
    //     }
    //WebSocket only deals with string and binary(not with the json format or object)
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message); //to access the type of the request
        if (parsedMessage.type === "join") { //we need to convert the string into an object
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") { //if the user(socket) wants to chat then
            // const currentUserRoomId = allSockets.find((x) => x.socket == socket).room;
            let currentUserRoomId = null;
            for (let i = 0; i < allSockets.length; i++) { //check the room of the user from the global array
                //@ts-ignore
                if (allSockets[i].socket == socket) {
                    //@ts-ignore
                    currentUserRoomId = allSockets[i].room;
                }
            }
            for (let i = 0; i < allSockets.length; i++) { //send the message to the users that are the part of the same room
                //@ts-ignore
                if (allSockets[i].room == currentUserRoomId) {
                    allSockets[i]?.socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
});
//# sourceMappingURL=index.js.map