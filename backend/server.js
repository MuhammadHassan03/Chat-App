const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const path = require('path');




const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
// app.get("/", (req, res) => {
//     res.send("Api is Running");
// })
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)

// --------------Deployment-----------------------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1, '/frontend/build')));
    // console.log(__dirname1);

    app.get('*', (req, res) => {
        const vare = path.resolve(__dirname1, 'frontend', 'build', 'index.html')
        console.log(vare);
        res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
    })
}
else{
    app.get('/', (req, res) => {
        res.send('API running sucessfully');
    })
}

// --------------Deployment-----------------------


app.use(notFound);
app.use(errorHandler);





const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, console.log(`Server is listeneing on PORT ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on("connection", (socket) => {
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined room ", room);

    })
    socket.on("typing",(room)=>{
        socket.in(room).emit("typing");
    })
    socket.on("stop typing",(room)=>{
        socket.in(room).emit("stop typing");
    })
    socket.on("New Message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.user is not defined");
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("Message Recieved", newMessageRecieved);
        });
    });

    socket.off('setup', ()=>{
        console.log("user disconnected");
        socket.leave(userData._id)
    })
});