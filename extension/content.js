import {
    sanitizeText,
    sanitizeInput
} from "./privacy/privacy.js";


console.log("MS WEBPILOT CONTENT SCRIPT STARTED");


// =========================
// PAGE STATE
// =========================

function getPageState() {

    // Get visible page text
    const pageText = document.body.innerText.slice(0, 10000);

    // Sanitize visible text before sending it anywhere
    const sanitizedText = sanitizeText(pageText);


    // Find form/input elements
    const inputs = Array.from(
        document.querySelectorAll(
            "input, textarea, select"
        )
    );


    // Sanitize input information
    const sanitizedInputs = inputs.map((element) => {

        return {
            type: element.getAttribute("type") || "",
            name: element.getAttribute("name") || "",
            id: element.getAttribute("id") || "",
            placeholder:
                element.getAttribute("placeholder") || "",

            value: sanitizeInput(element)
        };

    });


    return {
        url: window.location.href,

        title: sanitizeText(
            document.title
        ),

        text: sanitizedText,

        inputs: sanitizedInputs
    };

}


console.log("🔥 PAGE STATE CREATED");

const pageState = getPageState();


console.log(
    "🔒 SANITIZED PAGE STATE READY"
);

console.log(
    "🔥 SENDING SANITIZED PAGE STATE TO BACKGROUND"
);


chrome.runtime.sendMessage({
    type: "page-state",
    data: pageState
});


// =========================
// RECEIVE BROWSER ACTION
// =========================

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

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


            const element =
                document.querySelector(selector);


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
                selector
            );


            const element =
                document.querySelector(selector);


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


            const nativeSetter =
                Object.getOwnPropertyDescriptor(
                    HTMLInputElement.prototype,
                    "value"
                ).set;


            nativeSetter.call(
                element,
                text
            );


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
                "✅ TEXT ENTERED"
            );


            sendResponse({
                success: true,
                selector
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

    }
);