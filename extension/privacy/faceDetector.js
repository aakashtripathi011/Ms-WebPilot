
import {
    FaceDetector,
    FilesetResolver
} from "@mediapipe/tasks-vision";

let faceDetector = null;


// =========================
// INITIALIZE FACE DETECTOR
// =========================

export async function initializeFaceDetector() {

    console.log("👤 INITIALIZING FACE DETECTOR...");

    const vision = await FilesetResolver.forVisionTasks(
        chrome.runtime.getURL("mediapipe/wasm")
    );

    faceDetector = await FaceDetector.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath:
                    chrome.runtime.getURL(
                        "mediapipe/blaze_face_full_range.tflite"
                    ),

                delegate: "GPU"
            },

            runningMode: "IMAGE",

            minDetectionConfidence: 0.3
        }
    );

    console.log("✅ FACE DETECTOR READY");

    return faceDetector;
}


// =========================
// GET FACE DETECTOR
// =========================

export function getFaceDetector() {

    return faceDetector;

}


// =========================
// DETECT FACES
// =========================

export async function detectFaces(image) {

    if (!faceDetector) {

        throw new Error(
            "Face detector is not initialized"
        );

    }

    console.log("👤 DETECTING FACES...");

    const result = faceDetector.detect(image);

    console.log(
        "👤 FACES DETECTED:",
        result.detections.length
    );

    return result.detections;
}


// =========================
// BLUR DETECTED FACES
// =========================



export async function blurFaces(
    image,
    detections
) {
console.log("🚨🚨🚨 BLUR FUNCTION TEST: VERSION 2 🚨🚨🚨");
    console.log("🚨 BLUR STEP 1: blurFaces() ENTERED");

    console.log(
        "🚨 BLUR STEP 2: detections =",
        detections
    );

    console.log(
        "🚨 BLUR STEP 3: detection count =",
        detections.length
    );


    // =========================
    // CREATE CANVAS
    // =========================

    console.log(
        "🚨 BLUR STEP 4: Creating canvas..."
    );

    const canvas =
        document.createElement("canvas");

    console.log(
        "🚨 BLUR STEP 5: Canvas created"
    );


    canvas.width = image.width;
    canvas.height = image.height;

    console.log(
        "🚨 BLUR STEP 6: Canvas size =",
        canvas.width,
        "x",
        canvas.height
    );


    // =========================
    // GET CONTEXT
    // =========================

    console.log(
        "🚨 BLUR STEP 7: Getting canvas context..."
    );

    const ctx =
        canvas.getContext("2d");

    console.log(
        "🚨 BLUR STEP 8: Context =",
        ctx
    );


    if (!ctx) {

        console.error(
            "❌ BLUR FAILED: Canvas context unavailable"
        );

        throw new Error(
            "Could not create canvas context"
        );

    }


    // =========================
    // DRAW ORIGINAL IMAGE
    // =========================

    console.log(
        "🚨 BLUR STEP 9: Drawing original image..."
    );

    ctx.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
    );

    console.log(
        "🚨 BLUR STEP 10: Original image drawn"
    );


    // =========================
    // PROCESS EACH FACE
    // =========================

    for (
        let i = 0;
        i < detections.length;
        i++
    ) {

        console.log(
            `🚨 BLUR STEP 11.${i}: Processing face ${i + 1}`
        );


        const detection =
            detections[i];


        console.log(
            `🚨 BLUR STEP 12.${i}: Detection =`,
            detection
        );


        const box =
            detection.boundingBox;


        console.log(
            `🚨 BLUR STEP 13.${i}: Bounding box =`,
            box
        );


        if (!box) {

            console.warn(
                `⚠️ FACE ${i + 1} HAS NO BOUNDING BOX`
            );

            continue;

        }


        // =========================
        // FACE PADDING
        // =========================

        const padding = 0.15;

        const padX =
            box.width * padding;

        const padY =
            box.height * padding;


        console.log(
            `🚨 BLUR STEP 14.${i}: Padding =`,
            {
                padX,
                padY
            }
        );


        // =========================
        // CALCULATE BOX
        // =========================

        const x =
            Math.max(
                0,
                box.originX - padX
            );

        const y =
            Math.max(
                0,
                box.originY - padY
            );

        const right =
            Math.min(
                canvas.width,
                box.originX +
                box.width +
                padX
            );

        const bottom =
            Math.min(
                canvas.height,
                box.originY +
                box.height +
                padY
            );


        const width =
            right - x;

        const height =
            bottom - y;


        console.log(
            `🚨 BLUR STEP 15.${i}: Final blur box =`,
            {
                x,
                y,
                width,
                height
            }
        );


        // =========================
        // SAVE CONTEXT
        // =========================

        console.log(
            `🚨 BLUR STEP 16.${i}: Saving canvas state`
        );

        ctx.save();


        // =========================
        // CLIP
        // =========================

        console.log(
            `🚨 BLUR STEP 17.${i}: Creating clip`
        );

        ctx.beginPath();

        ctx.rect(
            x,
            y,
            width,
            height
        );

        ctx.clip();


        console.log(
            `🚨 BLUR STEP 18.${i}: Clip created`
        );


        // =========================
        // APPLY BLUR
        // =========================

        console.log(
            `🚨 BLUR STEP 19.${i}: Applying blur`
        );

        ctx.filter =
            "blur(18px)";


        console.log(
            `🚨 BLUR STEP 20.${i}: Filter applied =`,
            ctx.filter
        );


        // =========================
        // REDRAW FACE
        // =========================

        console.log(
            `🚨 BLUR STEP 21.${i}: Redrawing face region`
        );

        ctx.drawImage(
            image,

            x,
            y,
            width,
            height,

            x,
            y,
            width,
            height
        );


        console.log(
            `🚨 BLUR STEP 22.${i}: Face region redrawn`
        );


        // =========================
        // RESTORE
        // =========================

        ctx.restore();

        console.log(
            `🚨 BLUR STEP 23.${i}: Canvas state restored`
        );

    }


    // =========================
    // COMPLETE
    // =========================

    console.log(
        "🚨 BLUR STEP 24: ALL FACES PROCESSED"
    );

    console.log(
        "✅ FACE BLUR COMPLETE"
    );


    return canvas;

}