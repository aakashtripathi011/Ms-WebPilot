"use client";

import { useState } from "react";

export default function Home() {
    const [task, setTask] = useState("");
    const [message, setMessage] = useState("");

    const sendTask = async () => {
        const response = await fetch(
            "http://localhost:5000/api/task",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    task
                })
            }
        );

        const data = await response.json();

        setMessage(data.message);
    };

    return (
        <main className="min-h-screen p-10">
            <h1 className="text-3xl font-bold">
                Ms WebPilot
            </h1>

            <input
                className="border p-3 mt-5 w-full"
                placeholder="Enter browser task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />

            <button
                className="border px-5 py-3 mt-4"
                onClick={sendTask}
            >
                Send Task
            </button>

            <p className="mt-5">
                {message}
            </p>
        </main>
    );
}