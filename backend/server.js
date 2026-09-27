
require("dotenv").config();

console.log(
    "OpenRouter API key loaded:",
    !!process.env.OPENROUTER_API_KEY
);

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { askQwen } = require("./qwen");

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
// AGENT STATE
// =========================

let currentTask = "";

// Memory of successfully executed browser actions
let actionHistory = [];

// Prevent multiple AI requests at the same time
let aiThinking = false;


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
// CLICK API
// =========================

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

    if (!task || typeof task !== "string") {

        return res.status(400).json({
            success: false,
            message: "Task is required"
        });

    }

    // Store new task
    currentTask = task.trim();

    // IMPORTANT:
    // New task = new memory
    actionHistory = [];

    // Reset AI lock
    aiThinking = false;

    console.log(
        "🎯 USER TASK:",
        currentTask
    );

    console.log(
        "🧠 ACTION MEMORY RESET"
    );

    io.emit("task-started", {
        task: currentTask
    });

    res.json({
        success: true,
        message: "Task stored",
        task: currentTask
    });

});


// =========================
// TYPE API
// =========================

app.post("/api/type", (req, res) => {

    const { selector, text } = req.body;

    console.log(
        "TYPE REQUEST:",
        selector,
        text
    );

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


// =========================
// SCROLL API
// =========================

app.post("/api/scroll", (req, res) => {

    const { amount } = req.body;

    console.log(
        "SCROLL REQUEST:",
        amount
    );

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


// =========================
// BACK API
// =========================

app.post("/api/back", (req, res) => {

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


// =========================
// SCREENSHOT API
// =========================

app.post("/api/screenshot", (req, res) => {

    console.log(
        "SCREENSHOT REQUEST"
    );

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

    // Send connection event to dashboard
    io.emit("agent-status", {
        status: "connected",
        message: "Browser agent connected"
    });


        // =========================
    // LIVE BROWSER PREVIEW
    // =========================

    socket.on(
        "browser-preview",
        (preview) => {

            console.log(
                "📺 LIVE BROWSER PREVIEW RECEIVED"
            );

            // Forward preview to dashboard
            io.emit(
                "browser-preview",
                preview
            );

        }
    );


    // =========================
    // PAGE STATE
    // =========================

    socket.on(
        "page-state",
        async (state) => {

            io.emit("page-state-update", {
                url: state.url,
                title: state.title
            });

            console.log(
                "\n========================="
            );

            console.log(
                "📄 PAGE STATE RECEIVED"
            );

            console.log(
                "========================="
            );

            console.log(
                "URL:",
                state.url
            );

            console.log(
                "TITLE:",
                state.title
            );

            console.log(
                "TEXT:",
                state.text
            );

            console.log(
                "INPUTS:",
                state.inputs
            );

            console.log(
                "INTERACTIVE ELEMENTS:",
                state.interactiveElements
            );


            // =========================
            // NO TASK
            // =========================

            if (!currentTask) {

                console.log(
                    "⏸️ No user task. Waiting..."
                );

                return;

            }


            // =========================
            // AI ALREADY THINKING
            // =========================

            if (aiThinking) {

                console.log(
                    "⏳ AI is already thinking. Ignoring duplicate page state."
                );

                return;

            }


            // Lock AI
            aiThinking = true;


            // =========================
            // ASK AI
            // =========================

            try {

                console.log(
                    "\n🤖 ASKING AI..."
                );

                console.log(
                    "🎯 CURRENT TASK:",
                    currentTask
                );

                console.log(
                    "🧠 ACTION HISTORY:",
                    actionHistory
                );


                const action =
                    await askQwen(
                        state,
                        currentTask,
                        actionHistory
                    );


                console.log(
                    "🤖 AI ACTION:",
                    action
                );


                if (!action) {

                    console.log(
                        "⚠️ No action returned"
                    );

                    return;

                }


                // =========================
                // SEND AI ACTION TO DASHBOARD
                // =========================

                io.emit("ai-action", {
                    action: action.action,
                    target: action.target,
                    value: action.value,
                    confidence: action.confidence
                });


                // =========================
                // AI DECIDED NOTHING
                // =========================

                if (
                    action.action === "none"
                ) {

                    console.log(
                        "ℹ️ AI decided no action is needed"
                    );

                    return;

                }


                // =========================
                // SEND ACTION STATUS
                // =========================

                console.log(
                    "\n🚀 SENDING BROWSER ACTION..."
                );

                io.emit(
                    "browser-action-status",
                    {
                        action:
                            action.action,

                        target:
                            action.target,

                        value:
                            action.value
                    }
                );


                // =========================
                // SEND ACTION TO EXTENSION
                // =========================

                io.emit(
                    "browser-action",
                    {
                        action:
                            action.action,

payload: {

    selector:
        action.target,

    text:
        action.value,

    amount:
        action.value,

    url:
        action.action === "open_url"
            ? action.target
            : action.value

}


                    }
                );


                console.log(
                    "✅ BROWSER ACTION SENT"
                );


            } catch (error) {

                console.error(
                    "\n❌ AI ACTION ERROR:"
                );

                console.error(
                    error.message
                );

            } finally {

                // Allow next page state
                aiThinking = false;

            }

        }
    );


    // =========================
    // BROWSER ACTION RESULT
    // =========================
    //
    // Background.js will send this AFTER
    // the browser successfully executes
    // an action.
    //

    socket.on(
        "browser-action-result",
        (result) => {

            console.log(
                "\n📥 BROWSER ACTION RESULT:"
            );

            console.log(
                result
            );


            // Ignore failed actions
            if (
                !result ||
                result.success !== true
            ) {

                console.log(
                    "❌ Browser action failed. Not adding to memory."
                );

                return;

            }


            // Ignore invalid action
            if (!result.action) {

                console.log(
                    "⚠️ Invalid browser action result."
                );

                return;

            }


            // =========================
            // SAVE SUCCESSFUL ACTION
            // =========================

            const historyItem = {

                action:
                    result.action,

                target:
                    result.target || "",

                value:
                    result.value || "",

                url:
                    result.url || "",

                timestamp:
                    Date.now()

            };


            actionHistory.push(
                historyItem
            );


            console.log(
                "🧠 ACTION SAVED TO MEMORY:"
            );

            console.log(
                historyItem
            );


            console.log(
                "🧠 FULL ACTION HISTORY:"
            );

            console.log(
                actionHistory
            );

        }
    );


    // =========================
    // DISCONNECT
    // =========================

    socket.on(
        "disconnect",
        () => {

            console.log(
                "Browser extension disconnected:",
                socket.id
            );

        }
    );

});


// =========================
// START SERVER
// =========================

const PORT = 5000;

server.listen(
    PORT,
    () => {

        console.log(
            `Backend running on http://localhost:${PORT}`
        );

    }
);

