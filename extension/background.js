import { io } from "socket.io-client";


// =========================
// CONNECT TO BACKEND
// =========================

const socket = io("http://localhost:5000", {
    transports: ["websocket"]
});


// =========================
// SOCKET CONNECTED
// =========================

socket.on("connect", () => {

    console.log(
        "Connected to Ms WebPilot backend"
    );

    console.log(
        "Socket ID:",
        socket.id
    );

     socket.emit("test-browser-action");

});


// =========================
// SOCKET ERROR
// =========================

socket.on("connect_error", (error) => {

    console.error(
        "Socket connection error:",
        error
    );

});


// =========================
// SOCKET DISCONNECTED
// =========================

socket.on("disconnect", () => {

    console.log(
        "Disconnected from Ms WebPilot backend"
    );

});


// =========================
// RECEIVE BROWSER ACTION
// =========================

socket.on("browser-action", async (command) => {

    console.log(
        "Received browser action:",
        command
    );


    // =========================
    // OPEN URL
    // =========================

    if (command.action === "open_url") {

        await chrome.tabs.create({
            url: command.payload.url
        });


        console.log(
            "Opened URL:",
            command.payload.url
        );


        socket.emit("action-result", {

            success: true,

            action: "open_url"

        });

    }

});