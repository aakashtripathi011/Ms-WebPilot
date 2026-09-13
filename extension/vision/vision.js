import {
    AutoProcessor,
    AutoModelForVision2Seq,
    load_image,
    env
} from "@huggingface/transformers";

env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL("ort/");

env.useBrowserCache = true;

console.log("🤖 Transformers.js version:", env.version);
console.log("💾 Browser cache enabled:", env.useBrowserCache);

console.log("🔥 VISION PAGE STARTED");

let processor = null;
let visionModel = null;
let visionReady = false;


// =========================
// LOAD SMOLVLM
// =========================

async function loadVisionModel() {

    console.log("🔥 LOADING SMOLVLM...");

    const modelId = "HuggingFaceTB/SmolVLM-256M-Instruct";

    console.log("📦 Loading processor...");

    processor = await AutoProcessor.from_pretrained(
        modelId
    );

    console.log("✅ PROCESSOR LOADED");

    console.log("🧠 Loading vision model...");

   visionModel = await AutoModelForVision2Seq.from_pretrained(
    modelId,
    {
        dtype: "q8",  // fp32 ki jagah
        device: "webgpu"
    }
);

    console.log("✅ SMOLVLM LOADED");

    return visionModel;
}


// =========================
// IMAGE ANALYSIS
// =========================

async function analyzeImage(imageSource, question) {

    console.log("👁️ ANALYZING IMAGE...");

    const image = await load_image(imageSource);

    console.log("🖼️ IMAGE LOADED");

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

    const prompt = processor.apply_chat_template(
        messages,
        {
            add_generation_prompt: true
        }
    );

    const inputs = await processor(
        prompt,
        [image],
        {
            return_tensors: "pt"
        }
    );

    console.log("🧠 RUNNING VISION INFERENCE...");

    const output = await visionModel.generate({
        ...inputs,
        max_new_tokens: 128
    });

    const inputLength = inputs.input_ids.dims[1];

    const generatedTokens = output.slice(
        null,
        [inputLength, output.dims[1]]
    );

    const result = processor.batch_decode(
        generatedTokens,
        {
            skip_special_tokens: true
        }
    );

    console.log("✅ VISION RESULT:", result);

    return result[0];
}


// =========================
// RECEIVE SCREENSHOT
// =========================

chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {



        if (message.type !== "analyze-screenshot") {
            return;
        }

        console.log("📸 SCREENSHOT RECEIVED BY VISION");

          if (!visionReady) {

            console.log("⏳ VISION MODEL NOT READY YET");

            sendResponse({
                success: false,
                error: "Vision model is still loading"
            });

            return true;
        }

        try {

            const result = await analyzeImage(
                message.screenshot,
                "Describe what is visible on this webpage."
            );

            console.log(
                "🎯 SCREENSHOT VISION RESULT:",
                result
            );

            sendResponse({
                success: true,
                result: result
            });

        } catch (error) {

            console.error(
                "❌ VISION ANALYSIS FAILED:",
                error
            );

            sendResponse({
                success: false,
                error: error.message
            });
        }

        return true;
    }
);


// =========================
// START MODEL
// =========================

loadVisionModel()
    .then(() => {

        visionReady = true;

        console.log("🧠 VISION MODEL READY");

    })
    .catch((error) => {

        console.error(
            "❌ VISION MODEL LOAD FAILED"
        );

        console.error(error);

    });