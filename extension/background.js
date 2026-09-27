import { io } from "socket.io-client";


// =====================================================
// BACKEND CONNECTION
// =====================================================

const socket = io("http://localhost:5000", {
    transports: ["websocket"]
});


// =====================================================
// CONTROLLED TAB
// =====================================================

let controlledTabId = null;


// =====================================================
// LIVE BROWSER PREVIEW
// =====================================================

let previewRunning = false;

const PREVIEW_INTERVAL = 1200;


// =====================================================
// DASHBOARD CHECK
// =====================================================

function isDashboardTab(tab) {

    if (!tab || !tab.url) {
        return false;
    }

    try {

        const url = new URL(tab.url);

        return (
            url.hostname === "localhost" &&
            url.port === "3000"
        );

    } catch (error) {

        return false;

    }
}


// =====================================================
// TRACK BROWSER TAB
// =====================================================

chrome.tabs.onActivated.addListener(
    async ({ tabId }) => {

        try {

            const tab =
                await chrome.tabs.get(tabId);

            if (!isDashboardTab(tab)) {

                controlledTabId = tabId;

                console.log(
                    "🎯 CONTROLLED TAB:",
                    tabId,
                    tab.url
                );

            } else {

                console.log(
                    "⏭️ DASHBOARD ACTIVE"
                );

            }

        } catch (error) {

            console.error(
                "❌ TAB ACTIVATION ERROR:",
                error.message
            );

        }

    }
);


// =====================================================
// LIVE BROWSER PREVIEW
// =====================================================

async function captureBrowserPreview() {

    if (!controlledTabId) {
        return;
    }


    try {

        const controlledTab =
            await chrome.tabs.get(
                controlledTabId
            );


        // Dashboard can NEVER be preview source

        if (
            !controlledTab ||
            isDashboardTab(controlledTab)
        ) {

            return;

        }


        // -------------------------------------------------
        // IMPORTANT:
        // Only capture if controlled tab is ACTIVE
        // inside its own browser window.
        // -------------------------------------------------

        const activeTabs =
            await chrome.tabs.query({
                active: true,
                windowId:
                    controlledTab.windowId
            });


        const activeTab =
            activeTabs[0];


        if (
            !activeTab ||
            activeTab.id !== controlledTabId
        ) {

            console.log(
                "⏭️ PREVIEW SKIPPED — CONTROLLED TAB NOT ACTIVE"
            );

            return;

        }


        // -------------------------------------------------
        // Never capture dashboard
        // -------------------------------------------------

        if (
            isDashboardTab(activeTab)
        ) {

            return;

        }


        // -------------------------------------------------
        // Capture active tab from CONTROLLED WINDOW
        // -------------------------------------------------

        const image =
            await chrome.tabs.captureVisibleTab(
                controlledTab.windowId,
                {
                    format: "jpeg",
                    quality: 70
                }
            );


        console.log(
            "📺 LIVE PREVIEW CAPTURED:",
            activeTab.url
        );


        socket.emit(
            "browser-preview",
            {
                image,
                tabId:
                    activeTab.id,
                url:
                    activeTab.url || "",
                title:
                    activeTab.title || ""
            }
        );


    } catch (error) {

        console.error(
            "❌ LIVE PREVIEW ERROR:",
            error.message
        );

    }

}


// =====================================================
// START LIVE PREVIEW
// =====================================================

function startBrowserPreview() {

    if (previewRunning) {
        return;
    }


    previewRunning = true;


    console.log(
        "📺 LIVE BROWSER PREVIEW STARTED"
    );


    const previewLoop =
        async () => {

            if (!previewRunning) {
                return;
            }


            await captureBrowserPreview();


            setTimeout(
                previewLoop,
                PREVIEW_INTERVAL
            );

        };


    previewLoop();

}


// =====================================================
// STOP LIVE PREVIEW
// =====================================================

function stopBrowserPreview() {

    previewRunning = false;


    console.log(
        "📺 LIVE BROWSER PREVIEW STOPPED"
    );

}


// =====================================================
// SOCKET CONNECT
// =====================================================

socket.on("connect", () => {

    console.log(
        "Connected to Ms WebPilot backend"
    );

    console.log(
        "Socket ID:",
        socket.id
    );


    // Start preview independently
    // from existing AI/browser logic

    startBrowserPreview();

});


// =====================================================
// SOCKET ERROR
// =====================================================

socket.on("connect_error", (error) => {

    console.error(
        "Socket connection error:",
        error
    );

});


// =====================================================
// SOCKET DISCONNECT
// =====================================================

socket.on("disconnect", () => {

    console.log(
        "Disconnected from Ms WebPilot backend"
    );


    stopBrowserPreview();

});


// =====================================================
// GET CONTROLLED TAB
// =====================================================

async function getControlledTab() {

    // Try existing controlled tab first

    if (controlledTabId) {

        try {

            const tab =
                await chrome.tabs.get(
                    controlledTabId
                );

            if (
                tab &&
                !isDashboardTab(tab)
            ) {

                return tab;

            }

        } catch (error) {

            controlledTabId = null;

        }

    }


    // Find browser tabs

    const tabs =
        await chrome.tabs.query({
            currentWindow: true
        });


    const browserTabs =
        tabs.filter((tab) => {

            if (!tab.id || !tab.url) {
                return false;
            }

            if (isDashboardTab(tab)) {
                return false;
            }

            if (
                tab.url.startsWith("chrome://")
            ) {
                return false;
            }

            if (
                tab.url.startsWith(
                    "chrome-extension://"
                )
            ) {
                return false;
            }

            return true;

        });


    if (browserTabs.length === 0) {

        console.error(
            "❌ NO BROWSER TAB FOUND"
        );

        return null;

    }


    const activeTab =
        browserTabs.find(
            (tab) => tab.active
        );


    const tab =
        activeTab ||
        browserTabs[0];


    controlledTabId =
        tab.id;


    console.log(
        "🎯 SELECTED CONTROLLED TAB:",
        tab.id,
        tab.url
    );


    return tab;

}


// =====================================================
// SEND MESSAGE TO CONTENT SCRIPT
// =====================================================

function sendMessageToTab(
    tabId,
    message
) {

    return new Promise(
        (resolve, reject) => {

            chrome.tabs.sendMessage(
                tabId,
                message,
                (response) => {

                    if (
                        chrome.runtime.lastError
                    ) {

                        reject(
                            new Error(
                                chrome.runtime
                                    .lastError
                                    .message
                            )
                        );

                        return;

                    }

                    resolve(response);

                }
            );

        }
    );

}


// =====================================================
// REQUEST PAGE STATE
// =====================================================

async function requestPageState(
    tabId
) {

    if (!tabId) {

        console.error(
            "❌ TAB ID MISSING"
        );

        return;

    }


    console.log(
        "📄 REQUESTING FRESH PAGE STATE:",
        tabId
    );


    try {

        const response =
            await sendMessageToTab(
                tabId,
                {
                    action:
                        "request-page-state"
                }
            );


        console.log(
            "✅ PAGE STATE RESPONSE:",
            response
        );

    } catch (error) {

        console.error(
            "❌ PAGE STATE REQUEST FAILED:",
            error.message
        );

    }

}


// =====================================================
// WAIT
// =====================================================

function wait(ms) {

    return new Promise(
        (resolve) => {

            setTimeout(
                resolve,
                ms
            );

        }
    );

}


// =====================================================
// REFRESH PAGE STATE AFTER ACTION
// =====================================================

async function refreshPageState(
    tabId,
    delay = 500
) {

    await wait(delay);


    try {

        const tab =
            await chrome.tabs.get(
                tabId
            );


        if (
            tab.status === "loading"
        ) {

            console.log(
                "⏳ PAGE STILL LOADING..."
            );

            await wait(1000);

        }


        await requestPageState(
            tabId
        );

    } catch (error) {

        console.error(
            "❌ REFRESH STATE ERROR:",
            error.message
        );

    }

}


// =====================================================
// REPORT SUCCESSFUL ACTION
// =====================================================

function reportActionSuccess({
    action,
    target = "",
    value = "",
    tabId = null,
    url = ""
}) {

    console.log(
        "🧠 REPORTING SUCCESSFUL ACTION:",
        {
            action,
            target,
            value,
            tabId,
            url
        }
    );


    socket.emit(
        "browser-action-result",
        {
            success: true,

            action,

            target,

            value,

            tabId,

            url
        }
    );

}


// =====================================================
// REPORT FAILED ACTION
// =====================================================

function reportActionFailure({
    action,
    target = "",
    value = "",
    tabId = null,
    error = ""
}) {

    console.error(
        "❌ REPORTING FAILED ACTION:",
        {
            action,
            target,
            value,
            tabId,
            error
        }
    );


    socket.emit(
        "browser-action-result",
        {
            success: false,

            action,

            target,

            value,

            tabId,

            error
        }
    );

}


// =====================================================
// CONTENT SCRIPT MESSAGE
// =====================================================

chrome.runtime.onMessage.addListener(
    (
        message,
        sender,
        sendResponse
    ) => {

        console.log(
            "🔥 BACKGROUND RECEIVED MESSAGE:",
            message
        );


        // =============================================
        // PAGE STATE
        // =============================================

        if (
            message.type ===
            "page-state"
        ) {

            if (
                sender.tab &&
                sender.tab.id &&
                !isDashboardTab(
                    sender.tab
                )
            ) {

                controlledTabId =
                    sender.tab.id;

            }


            console.log(
                "🔥 FORWARDING PAGE STATE TO BACKEND"
            );


            console.log(
                "🎯 PAGE STATE TAB:",
                controlledTabId
            );


            socket.emit(
                "page-state",
                {
                    ...message.data,

                    tabId:
                        controlledTabId
                }
            );


            sendResponse({
                success: true
            });


            return true;

        }


        // =============================================
        // DEBUG SCREENSHOT
        // =============================================

        if (
            message.type ===
            "debug-sanitized-screenshot"
        ) {

            console.log(
                "🧪 RECEIVED SANITIZED SCREENSHOT"
            );


            const newTabUrl =
                "data:text/html," +
                encodeURIComponent(
                    `
                    <html>

                    <body
                        style="
                            margin:0;
                            background:#111;
                        "
                    >

                        <img
                            src="${message.screenshot}"
                            style="
                                max-width:100%;
                                height:auto;
                            "
                        />

                    </body>

                    </html>
                    `
                );


            chrome.tabs.create({
                url: newTabUrl
            });


            return false;

        }

    }
);


// =====================================================
// TASK STARTED
// =====================================================

socket.on(
    "task-started",
    async (data) => {

        console.log(
            "🎯 TASK STARTED:",
            data?.task
        );


        const tab =
            await getControlledTab();


        if (!tab) {

            console.error(
                "❌ NO CONTROLLED TAB"
            );

            return;

        }


        controlledTabId =
            tab.id;


        console.log(
            "🎯 TASK RUNNING ON:",
            tab.id,
            tab.url
        );


        await requestPageState(
            controlledTabId
        );

    }
);


// =====================================================
// BROWSER ACTION
// =====================================================

socket.on(
    "browser-action",
    async (command) => {

        console.log(
            "🚀 RECEIVED BROWSER ACTION:",
            command
        );


        // =============================================
        // OPEN URL
        // =============================================

        if (
            command.action ===
            "open_url"
        ) {

            const url =
                command.payload?.url ||
                command.payload?.value;


            if (!url) {

                console.error(
                    "❌ OPEN URL: EMPTY URL"
                );

                return;

            }


            try {

                if (controlledTabId) {

                    await chrome.tabs.update(
                        controlledTabId,
                        {
                            url: url
                        }
                    );

                } else {

                    const tab =
                        await chrome.tabs.create({
                            url: url
                        });


                    controlledTabId =
                        tab.id;

                }


                console.log(
                    "✅ URL OPENED:",
                    url
                );


                // IMPORTANT:
                // Tell backend this action actually succeeded

                reportActionSuccess({
                    action: "open_url",
                    value: url,
                    tabId: controlledTabId,
                    url: url
                });


                await refreshPageState(
                    controlledTabId,
                    1000
                );


            } catch (error) {

                console.error(
                    "❌ OPEN URL ERROR:",
                    error.message
                );


                reportActionFailure({
                    action: "open_url",
                    value: url,
                    tabId: controlledTabId,
                    error: error.message
                });

            }


            return;

        }


        // =============================================
        // REQUIRE CONTROLLED TAB
        // =============================================

        if (!controlledTabId) {

            console.error(
                "❌ NO CONTROLLED TAB"
            );

            return;

        }


        const tabId =
            controlledTabId;


        // =============================================
        // CLICK
        // =============================================

        if (
            command.action ===
            "click"
        ) {

            console.log(
                "🔥 SENDING CLICK TO TAB:",
                tabId
            );


            const target =
                command.payload?.selector || "";


            try {

                const response =
                    await sendMessageToTab(
                        tabId,
                        {
                            action: "click",

                            payload: {
                                selector:
                                    target
                            }
                        }
                    );


                console.log(
                    "✅ CLICK RESPONSE:",
                    response
                );


                const success =
                    response?.success ?? true;


                if (success) {

                    reportActionSuccess({
                        action: "click",
                        target: target,
                        tabId: tabId
                    });

                } else {

                    reportActionFailure({
                        action: "click",
                        target: target,
                        tabId: tabId,
                        error:
                            response?.error ||
                            "Click failed"
                    });

                }


                console.log(
                    "🔄 CLICK → NEXT PAGE STATE"
                );


                await refreshPageState(
                    tabId,
                    500
                );


            } catch (error) {

                console.error(
                    "❌ CLICK MESSAGE ERROR:",
                    error.message
                );


                reportActionFailure({
                    action: "click",
                    target: target,
                    tabId: tabId,
                    error: error.message
                });

            }


            return;

        }


        // =============================================
        // TYPE
        // =============================================

        if (
            command.action ===
            "type"
        ) {

            console.log(
                "🔥 SENDING TYPE TO TAB:",
                tabId
            );


            const target =
                command.payload?.selector || "";

            const text =
                command.payload?.text || "";


            try {

                const response =
                    await sendMessageToTab(
                        tabId,
                        {
                            action: "type",

                            payload: {
                                selector:
                                    target,

                                text:
                                    text
                            }
                        }
                    );


                console.log(
                    "✅ TYPE RESPONSE:",
                    response
                );


                const success =
                    response?.success ?? true;


                if (success) {

                    reportActionSuccess({
                        action: "type",
                        target: target,
                        value: text,
                        tabId: tabId
                    });

                } else {

                    reportActionFailure({
                        action: "type",
                        target: target,
                        value: text,
                        tabId: tabId,
                        error:
                            response?.error ||
                            "Type failed"
                    });

                }


                console.log(
                    "🔄 TYPE → NEXT PAGE STATE"
                );


                await refreshPageState(
                    tabId,
                    500
                );


            } catch (error) {

                console.error(
                    "❌ TYPE MESSAGE ERROR:",
                    error.message
                );


                reportActionFailure({
                    action: "type",
                    target: target,
                    value: text,
                    tabId: tabId,
                    error: error.message
                });

            }


            return;

        }


        // =============================================
        // SCROLL
        // =============================================

        if (
            command.action ===
            "scroll"
        ) {

            console.log(
                "🔥 SENDING SCROLL TO TAB:",
                tabId
            );


            const amount =
                command.payload?.amount;


            try {

                const response =
                    await sendMessageToTab(
                        tabId,
                        {
                            action: "scroll",

                            payload: {
                                amount:
                                    amount
                            }
                        }
                    );


                console.log(
                    "✅ SCROLL RESPONSE:",
                    response
                );


                const success =
                    response?.success ?? true;


                if (success) {

                    reportActionSuccess({
                        action: "scroll",
                        value: amount,
                        tabId: tabId
                    });

                } else {

                    reportActionFailure({
                        action: "scroll",
                        value: amount,
                        tabId: tabId,
                        error:
                            response?.error ||
                            "Scroll failed"
                    });

                }


                console.log(
                    "🔄 SCROLL → NEXT PAGE STATE"
                );


                await refreshPageState(
                    tabId,
                    800
                );


            } catch (error) {

                console.error(
                    "❌ SCROLL MESSAGE ERROR:",
                    error.message
                );


                reportActionFailure({
                    action: "scroll",
                    value: amount,
                    tabId: tabId,
                    error: error.message
                });

            }


            return;

        }


        // =============================================
        // BACK
        // =============================================

        if (
            command.action ===
            "back"
        ) {

            console.log(
                "🔥 GOING BACK:",
                tabId
            );


            try {

                await chrome.tabs.goBack(
                    tabId
                );


                console.log(
                    "✅ BACK COMPLETED"
                );


                reportActionSuccess({
                    action: "back",
                    tabId: tabId
                });


                await refreshPageState(
                    tabId,
                    800
                );


            } catch (error) {

                console.error(
                    "❌ BACK ERROR:",
                    error.message
                );


                reportActionFailure({
                    action: "back",
                    tabId: tabId,
                    error: error.message
                });

            }


            return;

        }


        // =============================================
        // SCREENSHOT
        // =============================================

        if (
            command.action ===
            "screenshot"
        ) {

            try {

                const image =
                    await chrome.tabs.captureVisibleTab(
                        null,
                        {
                            format: "png"
                        }
                    );


                console.log(
                    "📸 SCREENSHOT CAPTURED"
                );


                chrome.runtime.sendMessage(
                    {
                        type:
                            "analyze-screenshot",

                        screenshot:
                            image
                    },
                    (response) => {

                        if (
                            chrome.runtime.lastError
                        ) {

                            console.error(
                                "❌ VISION ERROR:",
                                chrome.runtime
                                    .lastError
                                    .message
                            );

                            return;

                        }


                        console.log(
                            "🧠 LOCAL VISION RESULT:",
                            response
                        );


                        if (
                            response?.success
                        ) {

                            socket.emit(
                                "vision-result",
                                {
                                    success: true,

                                    result:
                                        response.result
                                }
                            );

                        } else {

                            socket.emit(
                                "vision-result",
                                {
                                    success: false,

                                    error:
                                        response?.error
                                }
                            );

                        }

                    }
                );


            } catch (error) {

                console.error(
                    "❌ SCREENSHOT ERROR:",
                    error.message
                );

            }


            return;

        }


        // =============================================
        // UNKNOWN ACTION
        // =============================================

        console.warn(
            "⚠️ UNKNOWN ACTION:",
            command.action
        );

    }
);


// =====================================================
// EXTENSION INSTALLED
// =====================================================

chrome.runtime.onInstalled.addListener(
    async () => {

        console.log(
            "🔥 EXTENSION INSTALLED"
        );


        try {

            await chrome.offscreen.createDocument(
                {
                    url: "vision.html",

                    reasons: [
                        "DOM_PARSER"
                    ],

                    justification:
                        "Run local vision model in a DOM-capable extension environment"
                }
            );


            console.log(
                "✅ VISION OFFSCREEN DOCUMENT CREATED"
            );

        } catch (error) {

            console.error(
                "❌ OFFSCREEN DOCUMENT ERROR:",
                error.message
            );

        }

    }
);