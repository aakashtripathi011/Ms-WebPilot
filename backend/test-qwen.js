require("dotenv").config();

const { askQwen } = require("./qwen");

async function testQwen() {

    console.log("🧪 TESTING QWEN...");
    console.log("");

    const testPageState = {
        url: "https://example.com",
        title: "Example Domain",
        text: "Example Domain. This domain is for use in illustrative examples.",
        inputs: []
    };

    try {

        const result = await askQwen(testPageState);

        console.log("");
        console.log("🤖 QWEN RESULT:");
        console.log(result);
        console.log("");

    } catch (error) {

        console.error("");
        console.error("❌ QWEN TEST FAILED:");
        console.error(error.message);
        console.error("");

    }
}

testQwen();