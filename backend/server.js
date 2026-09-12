const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Ms WebPilot backend is running"
    });
});

app.post("/api/task", (req, res) => {
    const { task } = req.body;

    console.log("Received task:", task);

    res.json({
        success: true,
        message: "Task received",
        task
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});