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


// =========================
// SOCKET CONNECTION
// =========================

io.on("connection", (socket) => {

    console.log(
        "Browser extension connected:",
        socket.id
    );

     // =========================
    // TEST BROWSER ACTION
    // =========================

    socket.on("test-browser-action", () => {

        console.log("Sending browser action...");

        socket.emit("browser-action", {

            action: "open_url",

            payload: {
                url: "https://github.com"
            }

        });

    });

    socket.on("action-result", (result) => {

    console.log("Browser action result:", result);

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