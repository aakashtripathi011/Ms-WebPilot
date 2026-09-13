console.log("MS WEBPILOT CONTENT SCRIPT STARTED");


// =========================
// PAGE STATE
// =========================

function getPageState() {

    return {
        url: window.location.href,
        title: document.title,
        text: document.body.innerText.slice(0, 10000)
    };

}


console.log("🔥 PAGE STATE CREATED");

const pageState = getPageState();

console.log("🔥 SENDING PAGE STATE TO BACKGROUND");

chrome.runtime.sendMessage({
    type: "page-state",
    data: pageState
});


// =========================
// RECEIVE BROWSER ACTION
// =========================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log(
        "🔥 CONTENT RECEIVED MESSAGE:",
        message
    );


    // =========================
    // CLICK ACTION
    // =========================

    if (message.type === "click") {

        const selector = message.selector;

        console.log(
            "🔥 CLICK REQUEST:",
            selector
        );


        const element = document.querySelector(selector);


        if (!element) {

            console.error(
                "❌ ELEMENT NOT FOUND:",
                selector
            );

            sendResponse({
                success: false,
                error: "Element not found"
            });

            return;
        }


        console.log(
            "🔥 ELEMENT FOUND:",
            element
        );


        element.click();


        console.log(
            "✅ ELEMENT CLICKED:",
            selector
        );


        sendResponse({
            success: true,
            selector
        });

    }

    // =========================
// TYPE ACTION
// =========================

if (message.type === "type") {

    const selector = message.selector;
    const text = message.text;

    console.log(
        "🔥 TYPE REQUEST:",
        selector,
        text
    );

    const element = document.querySelector(selector);

    if (!element) {

        console.error(
            "❌ INPUT ELEMENT NOT FOUND:",
            selector
        );

        sendResponse({
            success: false,
            error: "Input element not found"
        });

        return;
    }

    console.log(
        "🔥 INPUT ELEMENT FOUND:",
        element
    );

    element.focus();

const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
).set;

nativeSetter.call(element, text);

element.dispatchEvent(
    new Event("input", {
        bubbles: true
    })
);

element.dispatchEvent(
    new Event("change", {
        bubbles: true
    })
);

console.log(
    "✅ TEXT ENTERED:",
    element.value
);

  

    sendResponse({
        success: true,
        selector,
        text
    });

}

    // =========================
    // SCROLL ACTION
    // =========================

    if (message.type === "scroll") {

        const amount = message.amount;

        console.log(
            "🔥 SCROLL REQUEST:",
            amount
        );

        window.scrollBy({
            top: amount,
            left: 0,
            behavior: "smooth"
        });

        console.log(
            "✅ PAGE SCROLLED:",
            amount
        );

        sendResponse({
            success: true,
            action: "scroll",
            amount
        });

    }

});