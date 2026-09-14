import {
    AutoProcessor,
    AutoModelForVision2Seq,
    load_image,
    env
} from "@huggingface/transformers";

import {
    initializeFaceDetector,
    detectFaces,
    blurFaces
} from "../privacy/faceDetector.js";

import {
    sanitizeText,
    sanitizeInput
} from "../privacy/privacy.js";


// =========================
// BUILD TEST
// =========================

console.log(
    "🚨🚨🚨 VISION BUILD TEST: PRIVACY BLUR VERSION 2 🚨🚨🚨"
);


env.backends.onnx.wasm.wasmPaths =
    chrome.runtime.getURL("ort/");

env.useBrowserCache = true;


console.log(
    "🤖 Transformers.js version:",
    env.version
);

console.log(
    "💾 Browser cache enabled:",
    env.useBrowserCache
);

console.log(
    "🔥 VISION PAGE STARTED"
);


let processor = null;
let visionModel = null;

let visionReady = false;
let faceDetectorReady = false;


// =========================
// LOAD SMOLVLM
// =========================

async function loadVisionModel() {

    console.log(
        "🔥 LOADING SMOLVLM..."
    );

    const modelId =
        "HuggingFaceTB/SmolVLM-256M-Instruct";


    console.log(
        "📦 Loading processor..."
    );


    processor =
        await AutoProcessor.from_pretrained(
            modelId
        );


    console.log(
        "✅ PROCESSOR LOADED"
    );


    console.log(
        "🧠 Loading vision model..."
    );


    visionModel =
        await AutoModelForVision2Seq.from_pretrained(
            modelId,
            {
                dtype: "q8",
                device: "webgpu"
            }
        );


    console.log(
        "✅ SMOLVLM LOADED"
    );


    return visionModel;
}


// =========================
// IMAGE ANALYSIS
// =========================

async function analyzeImage(
    imageSource,
    question
) {

    console.log(
        "👁️ ANALYZING IMAGE..."
    );


    const image =
        await load_image(
            imageSource
        );


    console.log(
        "🖼️ IMAGE LOADED"
    );


    const messages = [
        {
            role: "user",

            content: [
                {
                    type: "image"
                },

                {
                    type: "text",
                    text: question
                }
            ]
        }
    ];


    const prompt =
        processor.apply_chat_template(
            messages,
            {
                add_generation_prompt: true
            }
        );


    const inputs =
        await processor(
            prompt,
            [image],
            {
                return_tensors: "pt"
            }
        );


    console.log(
        "🧠 RUNNING VISION INFERENCE..."
    );


    const output =
        await visionModel.generate(
            {
                ...inputs,

                max_new_tokens: 128
            }
        );


    const inputLength =
        inputs.input_ids.dims[1];


    const generatedTokens =
        output.slice(
            null,
            [
                inputLength,
                output.dims[1]
            ]
        );


    const result =
        processor.batch_decode(
            generatedTokens,
            {
                skip_special_tokens: true
            }
        );


    console.log(
        "✅ VISION RESULT:",
        result
    );


    return result[0];
}


// =========================
// RECEIVE SCREENSHOT
// =========================

chrome.runtime.onMessage.addListener(

    async (
        message,
        sender,
        sendResponse
    ) => {


        // =========================
        // CHECK MESSAGE TYPE
        // =========================

        if (
            message.type !==
            "analyze-screenshot"
        ) {

            return;

        }


        console.log(
            "📸 SCREENSHOT RECEIVED BY VISION"
        );


        // =========================
        // SANITIZED SCREENSHOT
        // =========================
        //
        // IMPORTANT:
        // This starts as null.
        //
        // We will ONLY assign a value
        // after privacy processing succeeds.
        //

        let sanitizedScreenshot = null;


        // =========================
        // LOCAL PRIVACY FILTER
        // =========================

        if (!faceDetectorReady) {

            console.log(
                "⏳ FACE DETECTOR NOT READY YET"
            );


            sendResponse(
                {
                    success: false,

                    error:
                        "Privacy filter is still loading"
                }
            );


            return true;
        }


        try {

            console.log(
                "🔒 STARTING LOCAL PRIVACY FILTER"
            );


            // =========================
            // LOAD ORIGINAL SCREENSHOT
            // =========================

            const response =
                await fetch(
                    message.screenshot
                );


            const blob =
                await response.blob();


            const imageBitmap =
                await createImageBitmap(
                    blob
                );


            console.log(
                "📸 SCREENSHOT READY FOR PRIVACY SCAN"
            );


            console.log(
                "🖼️ IMAGE SIZE:",
                imageBitmap.width,
                "x",
                imageBitmap.height
            );


            // =========================
            // DETECT FACES LOCALLY
            // =========================

            const faces =
                await detectFaces(
                    imageBitmap
                );


            console.log(
                "👤 DETECTED FACES:",
                faces.length
            );


            console.log(
                "👤 FACE BOXES:",
                faces.map(
                    face =>
                        face.boundingBox
                )
            );


            // =========================
            // BLUR FACES LOCALLY
            // =========================

            const sanitizedCanvas =
                await blurFaces(
                    imageBitmap,
                    faces
                );


            console.log(
                "🔒 FACE REDACTION COMPLETE"
            );


            // =========================
            // CREATE SANITIZED IMAGE
            // =========================

            sanitizedScreenshot =
                sanitizedCanvas.toDataURL(
                    "image/png"
                );

                chrome.runtime.sendMessage({
    type: "debug-sanitized-screenshot",
    screenshot: sanitizedScreenshot
});


            console.log(
                "🛡️ SANITIZED SCREENSHOT CREATED"
            );

          

console.log(
    "🧪 DEBUG: SHOWING SANITIZED SCREENSHOT"
);

const debugImage =
    document.createElement("img");

debugImage.src =
    sanitizedScreenshot;

debugImage.style.position = "fixed";
debugImage.style.top = "10px";
debugImage.style.left = "10px";
debugImage.style.width = "500px";
debugImage.style.zIndex = "999999";

document.body.appendChild(
    debugImage
);

console.log(
    "🧪 DEBUG: SANITIZED IMAGE ADDED TO PAGE"
);


            // =========================
            // RELEASE ORIGINAL IMAGE
            // =========================

            imageBitmap.close();


            console.log(
                "🔐 ORIGINAL SCREENSHOT RELEASED"
            );


        } catch (error) {


            console.error(
                "❌ PRIVACY FILTER FAILED:",
                error
            );


            // =========================
            // FAIL-CLOSED PRIVACY
            // =========================
            //
            // NEVER send the original
            // screenshot if privacy
            // processing fails.
            //

            sendResponse(
                {
                    success: false,

                    error:
                        "Privacy filter failed. Raw screenshot was not sent."
                }
            );


            return true;
        }


        // =========================
        // SAFETY CHECK
        // =========================
        //
        // Extra protection:
        // If somehow sanitizedScreenshot
        // was not created, STOP.
        //

        if (!sanitizedScreenshot) {

            console.error(
                "❌ SANITIZED SCREENSHOT NOT AVAILABLE"
            );


            sendResponse(
                {
                    success: false,

                    error:
                        "Sanitized screenshot unavailable. Raw screenshot was not sent."
                }
            );


            return true;
        }


        // =========================
        // CHECK VISION MODEL
        // =========================

        if (!visionReady) {

            console.log(
                "⏳ VISION MODEL NOT READY YET"
            );


            sendResponse(
                {
                    success: false,

                    error:
                        "Vision model is still loading"
                }
            );


            return true;
        }


        // =========================
        // ANALYZE SANITIZED IMAGE
        // =========================

        try {

            console.log(
                "🛡️ SENDING SANITIZED IMAGE TO VISION MODEL"
            );


            const result =
                await analyzeImage(
                    sanitizedScreenshot,

                    "Describe what is visible on this webpage."
                );


            console.log(
                "🎯 SCREENSHOT VISION RESULT:",
                result
            );


            // =========================
            // SEND RESULT
            // =========================

            sendResponse(
                {
                    success: true,

                    result: result
                }
            );


        } catch (error) {


            console.error(
                "❌ VISION ANALYSIS FAILED:",
                error
            );


            sendResponse(
                {
                    success: false,

                    error:
                        error.message
                }
            );

        }


        return true;

    }
);


// =========================
// START VISION MODEL
// =========================

loadVisionModel()

    .then(() => {

        visionReady = true;


        console.log(
            "🧠 VISION MODEL READY"
        );

    })

    .catch((error) => {

        console.error(
            "❌ VISION MODEL LOAD FAILED"
        );


        console.error(
            error
        );

    });


// =========================
// START FACE DETECTOR
// =========================

initializeFaceDetector()

    .then(() => {

        faceDetectorReady = true;


        console.log(
            "👤 FACE DETECTOR READY"
        );

    })

    .catch((error) => {

        console.error(
            "❌ FACE DETECTOR LOAD FAILED"
        );


        console.error(
            error
        );

    });

