const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// HTTP SERVER
// =========================

const server = http.createServer(app);


// =========================
// SOCKET.IO
// =========================

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


// =========================
// HEALTH CHECK
// =========================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Ms WebPilot backend is running"
    });
});


app.post("/api/click", (req, res) => {

    const { selector } = req.body;

    console.log("CLICK REQUEST:", selector);

    io.emit("browser-action", {
        action: "click",
        payload: {
            selector
        }
    });

    res.json({
        success: true,
        message: "Click action sent",
        selector
    });

});

// =========================
// TASK API
// =========================

app.post("/api/task", (req, res) => {

    const { task } = req.body;

    console.log("Received task:", task);

    res.json({
        success: true,
        message: "Task received",
        task
    });
});


app.post("/api/type", (req, res) => {

    const { selector, text } = req.body;

    console.log("TYPE REQUEST:", selector, text);

    io.emit("browser-action", {
        action: "type",
        payload: {
            selector,
            text
        }
    });

    res.json({
        success: true,
        message: "Type action sent",
        selector,
        text
    });

});

app.post("/api/scroll", (req, res) => {

    const { amount } = req.body;

    console.log("SCROLL REQUEST:", amount);

    io.emit("browser-action", {
        action: "scroll",
        payload: {
            amount
        }
    });

    res.json({
        success: true,
        message: "Scroll action sent",
        amount
    });

});

app.post("/api/back", async (req, res) => {

    console.log("BACK REQUEST");

    io.emit("browser-action", {
        action: "back",
        payload: {}
    });

    res.json({
        success: true,
        message: "Back action sent"
    });

});

app.post("/api/screenshot", (req, res) => {

    console.log("SCREENSHOT REQUEST");

    io.emit("browser-action", {
        action: "screenshot",
        payload: {}
    });

    res.json({
        success: true,
        message: "Screenshot action sent"
    });

});


// =========================
// SOCKET CONNECTION
// =========================

io.on("connection", (socket) => {

    console.log(
        "Browser extension connected:",
        socket.id
    );

     

socket.on("page-state", (state) => { 
    console.log("PAGE STATE"); 
    console.log("URL:", state.url); 
    console.log("TITLE:", state.title); 
    console.log("TEXT:", state.text); 
});


    socket.on("disconnect", () => {

        console.log(
            "Browser extension disconnected:",
            socket.id
        );

    });

});


// =========================
// START SERVER
// =========================

const PORT = 5000;

server.listen(PORT, () => {

    console.log(
        `Backend running on http://localhost:${PORT}`
    );

});