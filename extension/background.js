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

    

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log("🔥 BACKGROUND RECEIVED MESSAGE:", message);

    if (message.type === "page-state") {

        console.log("🔥 FORWARDING PAGE STATE TO BACKEND");

        socket.emit("page-state", message.data);
    }

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

    // =========================
// CLICK ELEMENT
// =========================

if (command.action === "click") {

    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (tabs.length === 0) {

        console.error(
            "❌ No active tab found"
        );

        return;
    }


    const tabId = tabs[0].id;


    console.log(
        "🔥 SENDING CLICK TO TAB:",
        tabId
    );


    chrome.tabs.sendMessage(tabId, {

        type: "click",

        selector: command.payload.selector

    });

}

if (command.action === "type") {

    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (tabs.length === 0) {

        console.error(
            "❌ No active tab found"
        );

        return;
    }

    const tabId = tabs[0].id;

    console.log(
        "🔥 SENDING TYPE TO TAB:",
        tabId
    );

chrome.tabs.sendMessage(tabId, {
    type: "type",
    selector: command.payload.selector,
    text: command.payload.text
}, (response) => {

    if (chrome.runtime.lastError) {

        console.error(
            "❌ TYPE MESSAGE ERROR:",
            chrome.runtime.lastError.message
        );

        return;
    }

    console.log(
        "✅ TYPE RESPONSE FROM CONTENT:",
        response
    );

});



}

if (command.action === "scroll") {

    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (tabs.length === 0) {

        console.error(
            "❌ No active tab found"
        );

        return;
    }

    const tabId = tabs[0].id;

    console.log(
        "🔥 SENDING SCROLL TO TAB:",
        tabId
    );

    chrome.tabs.sendMessage(tabId, {
        type: "scroll",
        amount: command.payload.amount
    }, (response) => {

        if (chrome.runtime.lastError) {

            console.error(
                "❌ SCROLL MESSAGE ERROR:",
                chrome.runtime.lastError.message
            );

            return;
        }

        console.log(
            "✅ SCROLL RESPONSE:",
            response
        );

    });

}

if (command.action === "back") {

    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (tabs.length === 0) {

        console.error(
            "❌ No active tab found"
        );

        return;
    }

    const tabId = tabs[0].id;

    console.log(
        "🔥 GOING BACK:",
        tabId
    );

    await chrome.tabs.goBack(tabId);

    console.log(
        "✅ BACK COMPLETED"
    );

    socket.emit("action-result", {

        success: true,

        action: "back"

    });

}

if (command.action === "screenshot") {

    const image = await chrome.tabs.captureVisibleTab(
        null,
        {
            format: "png"
        }
    );

    console.log("📸 SCREENSHOT CAPTURED");

    chrome.runtime.sendMessage(
        {
            type: "analyze-screenshot",
            screenshot: image
        },
        (response) => {

            if (chrome.runtime.lastError) {

                console.error(
                    "❌ VISION MESSAGE ERROR:",
                    chrome.runtime.lastError.message
                );

                return;
            }

            console.log(
                "🧠 LOCAL VISION RESULT:",
                response
            );

            if (response?.success) {

                socket.emit("vision-result", {
                    success: true,
                    result: response.result
                });

            } else {

                socket.emit("vision-result", {
                    success: false,
                    error: response?.error
                });

            }
        }
    );
}

});

chrome.runtime.onInstalled.addListener(async () => {
    console.log("🔥 EXTENSION INSTALLED");

    await chrome.offscreen.createDocument({
        url: "vision.html",
        reasons: ["DOM_PARSER"],
        justification: "Run local vision model in a DOM-capable extension environment"
    });

    console.log("✅ VISION OFFSCREEN DOCUMENT CREATED");
});