
import {
    sanitizeText,
    sanitizeInput
} from "./privacy/privacy.js";


console.log("MS WEBPILOT CONTENT SCRIPT STARTED");


// =========================
// CHECK IF DASHBOARD
// =========================

function isDashboardPage() {

    return (
        window.location.hostname === "localhost" &&
        window.location.port === "3000"
    );

}


// =========================
// GENERATE UNIQUE CSS SELECTOR
// =========================

function getSelector(element) {

    function isUnique(selector) {

        try {

            return document.querySelectorAll(selector).length === 1;

        } catch (error) {

            return false;

        }

    }


    // =========================
    // 1. UNIQUE ID
    // =========================

    if (element.id) {

        const selector =
            `#${CSS.escape(element.id)}`;

        if (isUnique(selector)) {

            return selector;

        }

    }


    // =========================
    // 2. UNIQUE NAME
    // =========================

    const name =
        element.getAttribute("name");

    if (name) {

        const selector =
            `${element.tagName.toLowerCase()}[name="${CSS.escape(name)}"]`;

        if (isUnique(selector)) {

            return selector;

        }

    }


    // =========================
    // 3. UNIQUE ARIA LABEL
    // =========================

    const ariaLabel =
        element.getAttribute("aria-label");

    if (ariaLabel) {

        const selector =
            `${element.tagName.toLowerCase()}[aria-label="${CSS.escape(ariaLabel)}"]`;

        if (isUnique(selector)) {

            return selector;

        }

    }


    // =========================
    // 4. UNIQUE DATA-TESTID
    // =========================

    const dataTestId =
        element.getAttribute("data-testid");

    if (dataTestId) {

        const selector =
            `[data-testid="${CSS.escape(dataTestId)}"]`;

        if (isUnique(selector)) {

            return selector;

        }

    }


    // =========================
    // 5. UNIQUE DATA ATTRIBUTE
    // =========================

    for (const attribute of Array.from(element.attributes)) {

        if (
            attribute.name.startsWith("data-") &&
            attribute.name !== "data-testid"
        ) {

            const selector =
                `${element.tagName.toLowerCase()}[${attribute.name}="${CSS.escape(attribute.value)}"]`;

            if (isUnique(selector)) {

                return selector;

            }

        }

    }


    // =========================
    // 6. UNIQUE CLASS
    // =========================

    const tag =
        element.tagName.toLowerCase();

    const classes =
        Array.from(element.classList);


    for (const className of classes) {

        const selector =
            `${tag}.${CSS.escape(className)}`;

        if (isUnique(selector)) {

            return selector;

        }

    }


    // =========================
    // 7. MULTIPLE CLASSES
    // =========================

    if (classes.length > 0) {

        const selector =
            tag +
            classes
                .map(className =>
                    `.${CSS.escape(className)}`
                )
                .join("");

        if (isUnique(selector)) {

            return selector;

        }

    }


    // =========================
    // 8. BUILD FULL DOM PATH
    // =========================

    const path = [];

    let current =
        element;


    while (
        current &&
        current.nodeType === Node.ELEMENT_NODE
    ) {

        const currentTag =
            current.tagName.toLowerCase();


        if (currentTag === "html") {

            path.unshift("html");

            break;

        }


        // =========================
        // UNIQUE ID DURING WALK
        // =========================

        if (current.id) {

            const idSelector =
                `#${CSS.escape(current.id)}`;

            if (isUnique(idSelector)) {

                path.unshift(idSelector);

                break;

            }

        }


        const parent =
            current.parentElement;


        if (!parent) {

            path.unshift(currentTag);

            break;

        }


        // =========================
        // POSITION AMONG CHILDREN
        // =========================

        const children =
            Array.from(parent.children);


        const index =
            children.indexOf(current) + 1;


        if (index > 0) {

            path.unshift(
                `${currentTag}:nth-child(${index})`
            );

        } else {

            path.unshift(currentTag);

        }


        // =========================
        // CHECK COMPLETE PATH
        // =========================

        const selector =
            path.join(" > ");


        if (isUnique(selector)) {

            return selector;

        }


        current =
            parent;

    }


    // =========================
    // FINAL PATH CHECK
    // =========================

    const finalSelector =
        path.join(" > ");


    if (
        finalSelector &&
        isUnique(finalSelector)
    ) {

        return finalSelector;

    }


    return null;

}


// =========================
// PAGE STATE
// =========================

function getPageState() {

    // =========================
    // VISIBLE PAGE TEXT
    // =========================

    const pageText =
        document.body?.innerText?.slice(0, 10000) || "";


    // =========================
    // SANITIZE VISIBLE TEXT
    // =========================

    const sanitizedText =
        sanitizeText(pageText);


    // =========================
    // INPUT ELEMENTS
    // =========================

    const inputs =
        Array.from(
            document.querySelectorAll(
                "input, textarea, select"
            )
        );


    const sanitizedInputs =
        inputs.map((element) => {

            return {

                type:
                    element.getAttribute("type") || "",

                name:
                    element.getAttribute("name") || "",

                id:
                    element.getAttribute("id") || "",

                placeholder:
                    element.getAttribute("placeholder") || "",

                value:
                    sanitizeInput(element),

                selector:
                    getSelector(element)

            };

        });


    // =========================
    // INTERACTIVE ELEMENTS
    // =========================

    const interactiveElements =
        Array.from(
            document.querySelectorAll(
                "button, a, [role='button'], input[type='button'], input[type='submit'], [onclick]"
            )
        );


    const sanitizedInteractiveElements =
        interactiveElements
            .slice(0, 100)
            .map((element) => {

                const selector =
                    getSelector(element);


                if (!selector) {

                    return null;

                }


                const rawText =
                    element.innerText ||
                    element.getAttribute("aria-label") ||
                    element.getAttribute("title") ||
                    element.getAttribute("alt") ||
                    element.value ||
                    "";


                return {

                    tag:
                        element.tagName.toLowerCase(),

                    text:
                        sanitizeText(rawText),

                    ariaLabel:
                        sanitizeText(
                            element.getAttribute("aria-label") || ""
                        ),

                    title:
                        sanitizeText(
                            element.getAttribute("title") || ""
                        ),

                    type:
                        element.getAttribute("type") || "",

                    id:
                        element.getAttribute("id") || "",

                    name:
                        element.getAttribute("name") || "",

                    selector

                };

            })
            .filter(Boolean);


    return {

        url:
            window.location.href,

        title:
            sanitizeText(
                document.title
            ),

        text:
            sanitizedText,

        inputs:
            sanitizedInputs,

        interactiveElements:
            sanitizedInteractiveElements

    };

}


// =========================
// INITIAL PAGE STATE
// =========================

if (isDashboardPage()) {

    console.log(
        "⏭️ MS WEBPILOT DASHBOARD — SKIPPING PAGE STATE"
    );

} else {

    console.log(
        "🔥 PAGE STATE CREATED"
    );


    const pageState =
        getPageState();


    console.log(
        "🔒 SANITIZED PAGE STATE READY"
    );


    console.log(
        "🔥 INTERACTIVE ELEMENTS:",
        pageState.interactiveElements
    );


    console.log(
        "🔥 SENDING SANITIZED PAGE STATE TO BACKGROUND"
    );


    chrome.runtime.sendMessage({

        type: "page-state",

        data: pageState

    });

}


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
        // REQUEST FRESH PAGE STATE
        // =========================

        if (
            message.action ===
            "request-page-state"
        ) {

            if (isDashboardPage()) {

                console.log(
                    "⏭️ DASHBOARD — IGNORING PAGE STATE REQUEST"
                );


                sendResponse({

                    success: false,

                    skipped: true,

                    reason:
                        "Dashboard page"

                });


                return true;

            }


            console.log(
                "📄 FRESH PAGE STATE REQUESTED"
            );


            const freshPageState =
                getPageState();


            console.log(
                "📄 FRESH PAGE STATE CREATED:",
                freshPageState
            );


            chrome.runtime.sendMessage({

                type: "page-state",

                data: freshPageState

            });


            sendResponse({

                success: true

            });


            return true;

        }


        // =========================
        // DEBUG ACTION
        // =========================

        console.log(
            "🔥 ACTION:",
            message.action
        );


        console.log(
            "🔥 PAYLOAD:",
            message.payload
        );


        console.log(
            "🔥 SELECTOR:",
            message.payload?.selector
        );


        console.log(
            "🔥 TEXT:",
            message.payload?.text
        );


        // =========================
        // CLICK ACTION
        // =========================

        if (
            message.action ===
            "click"
        ) {

            const selector =
                message.payload?.selector;


            console.log(
                "🔥 CLICK REQUEST:",
                selector
            );


            if (!selector) {

                console.error(
                    "❌ CLICK SELECTOR MISSING"
                );


                sendResponse({

                    success: false,

                    error:
                        "Click selector missing"

                });


                return true;

            }


            const element =
                document.querySelector(
                    selector
                );


            if (!element) {

                console.error(
                    "❌ ELEMENT NOT FOUND:",
                    selector
                );


                sendResponse({

                    success: false,

                    error:
                        "Element not found"

                });


                return true;

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


            return true;

        }


        // =========================
        // TYPE ACTION
        // =========================

        if (
            message.action ===
            "type"
        ) {

            const selector =
                message.payload?.selector;


            const text =
                message.payload?.text ?? "";


            console.log(
                "🔥 TYPE REQUEST:",
                selector,
                text
            );


            if (!selector) {

                console.error(
                    "❌ TYPE SELECTOR MISSING"
                );


                sendResponse({

                    success: false,

                    error:
                        "Type selector missing"

                });


                return true;

            }


            const element =
                document.querySelector(
                    selector
                );


            if (!element) {

                console.error(
                    "❌ INPUT ELEMENT NOT FOUND:",
                    selector
                );


                sendResponse({

                    success: false,

                    error:
                        "Input element not found"

                });


                return true;

            }


            console.log(
                "🔥 INPUT ELEMENT FOUND:",
                element
            );


            // =========================
            // FOCUS ELEMENT
            // =========================

            element.focus();


            // =========================
            // SET VALUE SAFELY
            // =========================

            try {

                let prototype;

                if (
                    element instanceof
                    HTMLTextAreaElement
                ) {

                    prototype =
                        HTMLTextAreaElement.prototype;

                } else if (
                    element instanceof
                    HTMLInputElement
                ) {

                    prototype =
                        HTMLInputElement.prototype;

                } else if (
                    element instanceof
                    HTMLSelectElement
                ) {

                    prototype =
                        HTMLSelectElement.prototype;

                }


                const descriptor =
                    prototype
                        ? Object.getOwnPropertyDescriptor(
                            prototype,
                            "value"
                        )
                        : null;


                if (
                    descriptor &&
                    typeof descriptor.set ===
                    "function"
                ) {

                    descriptor.set.call(
                        element,
                        text
                    );

                } else {

                    element.value =
                        text;

                }


                // =========================
                // TRIGGER INPUT EVENT
                // =========================

                element.dispatchEvent(
                    new Event(
                        "input",
                        {
                            bubbles: true
                        }
                    )
                );


                // =========================
                // TRIGGER CHANGE EVENT
                // =========================

                element.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles: true
                        }
                    )
                );


                console.log(
                    "✅ TEXT ENTERED:",
                    text
                );


                sendResponse({

                    success: true,

                    selector,

                    value: text

                });


            } catch (error) {

                console.error(
                    "❌ TYPE ACTION FAILED:",
                    error
                );


                // =========================
                // SAFE FALLBACK
                // =========================

                try {

                    element.value =
                        text;


                    element.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );


                    element.dispatchEvent(
                        new Event(
                            "change",
                            {
                                bubbles: true
                            }
                        )
                    );


                    console.log(
                        "✅ TEXT ENTERED USING FALLBACK"
                    );


                    sendResponse({

                        success: true,

                        selector,

                        value: text,

                        fallback: true

                    });


                } catch (fallbackError) {

                    console.error(
                        "❌ TYPE FALLBACK FAILED:",
                        fallbackError
                    );


                    sendResponse({

                        success: false,

                        selector,

                        error:
                            fallbackError.message

                    });

                }

            }


            return true;

        }


        // =========================
        // SCROLL ACTION
        // =========================

        if (
            message.action ===
            "scroll"
        ) {

            const amount =
                Number(
                    message.payload?.amount
                );


            console.log(
                "🔥 SCROLL REQUEST:",
                amount
            );


            window.scrollBy({

                top:
                    amount,

                left:
                    0,

                behavior:
                    "smooth"

            });


            console.log(
                "✅ PAGE SCROLLED:",
                amount
            );


            sendResponse({

                success: true,

                action:
                    "scroll",

                amount

            });


            return true;

        }

    }
);

