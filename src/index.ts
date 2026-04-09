import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port : 8080});

//let userCount = 0;
//for broadcasting we have to maintain a global array in which all the sockets(socket of each client)
//will be present and we will the message to every element(socket) of the array(of sockets)

//let allSockets : WebSocket[] = [];

    interface User {
        socket : WebSocket;
        room : string
    }

    let allSockets : User[] = [];

//here socket is a reference to a socket which lets you to talk to the Client which has just 
// connected to the websocket server, now the server can start receiving messages from the  
// client on the socket and also can send messages using the same socket object

wss.on("connection", (socket)=>{ 
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
        socket.on("message", (message)=>{
            const parsedMessage = JSON.parse(message as unknown as string); //to access the type of the request
            if(parsedMessage.type === "join"){//we need to convert the string into an object
                allSockets.push({ // if the type is join then push the socket and roomId to all elements in the array
                    socket,
                    room : parsedMessage.payload.roomId
                })
            }

            if(parsedMessage.type === "chat"){//if the user(socket) wants to chat then
               // const currentUserRoomId = allSockets.find((x) => x.socket == socket).room;
               let currentUserRoomId = null;
                for(let i = 0; i < allSockets.length; i++){ //check the room of the user from the global array
                    //@ts-ignore
                    if(allSockets[i].socket == socket){
                    //@ts-ignore
                    currentUserRoomId = allSockets[i].room;
                    }
                }

                for(let i = 0; i < allSockets.length; i++){ //send the message to the users that are the part of the same room
                    //@ts-ignore
                    if(allSockets[i].room == currentUserRoomId){
                        allSockets[i]?.socket.send(parsedMessage.payload.message)
                    }
                }
            }
        })
    })

