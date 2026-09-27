const { validateAction } = require("./actionValidator");

console.log("🧪 TESTING ACTION VALIDATOR...\n");


const validAction = {
    action: "click",
    target: "#search",
    value: "",
    confidence: 0.95
};

console.log("VALID ACTION:");
console.log(validateAction(validAction));


const invalidAction = {
    action: "delete_files",
    target: "",
    value: "",
    confidence: 0.99
};

console.log("\nINVALID ACTION:");
console.log(validateAction(invalidAction));


const badConfidence = {
    action: "click",
    target: "#search",
    value: "",
    confidence: 5
};

console.log("\nBAD CONFIDENCE:");
console.log(validateAction(badConfidence));