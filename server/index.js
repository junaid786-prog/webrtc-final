import express from "express"
import cors from "cors"
import server from "http"
import socketIO from "socket.io"
import { v4 as uuidV4 } from "uuid"
import { ExpressPeerServer } from "peer"
// import './mailer.js';

const app = express()
const serve = server.Server(app)
const io = socketIO(serve)
const port = process.env.PORT || 5000

const peerServer = ExpressPeerServer(serve, {
  debug: true,
})
// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/peerjs", peerServer)

app.get("/join", (req, res) => {
  res.send({ link: uuidV4() })
})

let connections = [{}] // updated
io.on("connection", (socket) => {
  console.log("socket established")
  socket.on("join-room", (userData) => {
    const { roomID, userID } = userData
    // updated
    connections[userID] = userData
    //
    socket.join(roomID)
    socket.to(roomID).broadcast.emit("new-user-connect", userData)
    socket.on("disconnect", () => {
      socket.to(roomID).broadcast.emit("user-disconnected", userID)
    })
    socket.on("broadcast-message", (message) => {
      socket
        .to(roomID)
        .broadcast.emit("new-broadcast-messsage", { ...message, userData })
    })
    // socket.on('reconnect-user', () => {
    //     socket.to(roomID).broadcast.emit('new-user-connect', userData);
    // });
    socket.on("display-media", (value) => {
      socket.to(roomID).broadcast.emit("display-media", { userID, value })
    })
    socket.on("user-video-off", (value) => {
      socket.to(roomID).broadcast.emit("user-video-off", value)
    })
    socket.on("all_users", () => {
      console.log("all users", connections)
      socket.to(roomID).broadcast.emit("all_users_peers", connections)
    })
  })
})

// Server listen initilized
serve
  .listen(port, () => {
    console.log(`Listening on the port ${port}`)
  })
  .on("error", (e) => {
    console.error(e)
  })
