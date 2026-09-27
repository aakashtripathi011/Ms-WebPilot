
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { io } from "socket.io-client";

export default function Home() {
    const [task, setTask] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [agentStatus, setAgentStatus] =
        useState("CONNECTING");

    const [currentPage, setCurrentPage] = useState({
        url: "",
        title: "",
    });

    const [currentState, setCurrentState] =
        useState("Awaiting task...");

    const [activity, setActivity] = useState([]);

    // =========================================================
    // LIVE BROWSER PREVIEW
    // =========================================================

    const [browserPreview, setBrowserPreview] =
        useState("");


    // =========================================================
    // SOCKET.IO — DASHBOARD CONNECTION
    // =========================================================

    useEffect(() => {
        const socket = io("http://localhost:5000", {
            transports: ["websocket"],
        });


        // =====================================================
        // CONNECT
        // =====================================================

        socket.on("connect", () => {
            console.log(
                "Dashboard connected:",
                socket.id
            );

            setAgentStatus("CONNECTED");

            setActivity((prev) => [
                ...prev,
                {
                    type: "SYSTEM",
                    text: "Dashboard connected to backend",
                    active: true,
                },
            ]);
        });


        // =====================================================
        // CONNECTION ERROR
        // =====================================================

        socket.on("connect_error", (error) => {
            console.error(
                "Dashboard socket error:",
                error
            );

            setAgentStatus("OFFLINE");
        });


        // =====================================================
        // DISCONNECT
        // =====================================================

        socket.on("disconnect", () => {
            console.log(
                "Dashboard disconnected"
            );

            setAgentStatus("OFFLINE");
        });


        // =====================================================
        // TASK STARTED
        // =====================================================

        socket.on("task-started", (data) => {
            setCurrentState(
                "Executing task..."
            );

            setActivity((prev) => [
                ...prev,
                {
                    type: "TASK",
                    text: data.task,
                    active: true,
                },
            ]);
        });


        // =====================================================
        // PAGE STATE
        // =====================================================

        socket.on("page-state-update", (data) => {
            setCurrentPage({
                url: data.url,
                title: data.title,
            });

            setCurrentState(
                `Page detected: ${data.title || data.url}`
            );

            setActivity((prev) => [
                ...prev,
                {
                    type: "BROWSER",
                    text: `Page: ${data.url}`,
                    active: true,
                },
            ]);
        });


        // =====================================================
        // AI ACTION
        // =====================================================

        socket.on("ai-action", (data) => {
            const actionText =
                data.value
                    ? `${data.action}: ${data.value}`
                    : data.action;

            setCurrentState(
                `AI selected ${data.action}`
            );

            setActivity((prev) => [
                ...prev,
                {
                    type: "AI",
                    text: actionText,
                    active: true,
                },
            ]);
        });


        // =====================================================
        // BROWSER ACTION
        // =====================================================

        socket.on("browser-action-status", (data) => {
            const actionText =
                data.value
                    ? `${data.action}: ${data.value}`
                    : data.action;

            setCurrentState(
                `Executing ${data.action}...`
            );

            setActivity((prev) => [
                ...prev,
                {
                    type: "BROWSER",
                    text: actionText,
                    active: true,
                },
            ]);
        });


        // =====================================================
        // LIVE BROWSER PREVIEW
        // =====================================================

        socket.on("browser-preview", (preview) => {

            if (!preview?.image) {
                return;
            }

            setBrowserPreview(
                preview.image
            );

            // Keep browser information in sync
            // with the live preview source.
            if (
                preview.url ||
                preview.title
            ) {
                setCurrentPage({
                    url: preview.url || "",
                    title: preview.title || "",
                });
            }
        });


        // =====================================================
        // CLEANUP
        // =====================================================

        return () => {
            socket.disconnect();
        };

    }, []);


    // =========================================================
    // SEND TASK
    // =========================================================

    const sendTask = async () => {

        if (!task.trim()) {
            setMessage("Please enter a task.");
            return;
        }

        try {

            setLoading(true);
            setMessage("");

            const response = await fetch(
                "http://localhost:5000/api/task",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        task: task.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to send task"
                );
            }

            setMessage(
                "Task sent successfully."
            );

        } catch (error) {

            setMessage(
                error.message ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // EXAMPLE TASK
    // =========================================================

    const useExample = (example) => {
        setTask(example);
        setMessage("");
    };


    // =========================================================
    // UI
    // =========================================================

    return (
        <main className="min-h-screen bg-[#07111f] font-mono text-[#e8edf2]">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <header className="border-b border-[#26374b] bg-[#081525]">

                <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4 md:px-10">


                    {/* =================================================
                        LOGO
                    ================================================== */}

                    <div className="flex items-center gap-4">

                        <div className="flex h-9 w-9 items-center justify-center border border-[#40556d] bg-[#0d1c2d] text-sm font-black">
                            🍁
                        </div>

                        <div>

                            <div className="flex items-center gap-3">

                                <h1 className="text-base font-black tracking-[-0.05em]">
                                    MS / WEBPILOT
                                </h1>

                                <span className="border border-[#33495f] px-2 py-0.5 text-[8px] tracking-[0.2em] text-[#7890a8]">
                                    AGENT
                                </span>

                            </div>

                            <p className="mt-0.5 text-[8px] uppercase tracking-[0.18em] text-[#53697e]">
                                Autonomous browser control
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT CONTROLS
                    ================================================== */}

                    <div className="flex items-center gap-3">


                        {/* ABOUT BUTTON */}

                        <Link
                            href="/about"
                            className="group border border-[#30465d] bg-[#0a1829] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.18em] text-[#91a5b8] transition hover:border-[#607f9c] hover:bg-[#0d1c2d] hover:text-[#e8edf2]"
                        >

                            <span className="mr-2 text-[#526f8c] transition-colors group-hover:text-[#61e294]">
                                /
                            </span>

                            ABOUT

                        </Link>


                        {/* DIVIDER */}

                        <span className="hidden h-5 w-px bg-[#26374b] sm:block" />


                        {/* SYSTEM STATUS */}

                        <span
                            className={`h-2 w-2 rounded-full ${
                                agentStatus === "CONNECTED"
                                    ? "bg-[#61e294] shadow-[0_0_10px_rgba(97,226,148,0.7)]"
                                    : "bg-[#e58b8b]"
                            }`}
                        />

                        <span className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-[#91a5b8] sm:block">

                            {agentStatus === "CONNECTED"
                                ? "System online"
                                : agentStatus}

                        </span>


                        {/* LOCAL */}

                        <span className="border border-[#263b50] px-2 py-1 text-[7px] uppercase tracking-[0.2em] text-[#53697e]">
                            LOCAL
                        </span>

                    </div>

                </div>

            </header>


            {/* =====================================================
                MAIN
            ====================================================== */}

            <section className="mx-auto max-w-[1500px] px-6 py-8 md:px-10 md:py-10">


                {/* =================================================
                    HERO
                ================================================== */}

                <div className="mb-8 grid gap-6 border-b border-[#26374b] pb-8 md:grid-cols-[1fr_auto] md:items-end">

                    <div>

                        <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#5f7891]">
                            / CONTROL ROOM
                        </p>

                        <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.07em] md:text-6xl lg:text-[4.5rem]">

                            Give it a task.

                            <br />

                            <span className="text-[#607f9c]">
                                Let it browse.
                            </span>

                        </h2>

                    </div>


                    {/* Product flow */}

                    <div className="border-l border-[#26374b] pl-5 text-left md:text-right">

                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#53697e]">
                            INPUT
                        </p>

                        <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#91a5b8]">
                            Natural language
                        </p>

                        <p className="my-1 text-[9px] text-[#40566d]">
                            ↓
                        </p>

                        <p className="text-[9px] uppercase tracking-[0.15em] text-[#91a5b8]">
                            Autonomous action
                        </p>

                        <p className="my-1 text-[9px] text-[#40566d]">
                            ↓
                        </p>

                        <p className="text-[9px] uppercase tracking-[0.15em] text-[#91a5b8]">
                            Browser result
                        </p>

                    </div>

                </div>


                {/* =================================================
                    SYSTEM STATUS
                ================================================== */}

                <div className="mb-8 grid grid-cols-1 border border-[#2b3e54] md:grid-cols-3">

                    <StatusBlock
                        number="01"
                        label="BACKEND"
                        value={
                            agentStatus === "CONNECTED"
                                ? "CONNECTED"
                                : agentStatus
                        }
                        detail="localhost:5000"
                        online={
                            agentStatus === "CONNECTED"
                        }
                    />

                    <StatusBlock
                        number="02"
                        label="AI ENGINE"
                        value="READY"
                        detail="OpenRouter"
                        online
                    />

                    <StatusBlock
                        number="03"
                        label="BROWSER"
                        value="CONNECTED"
                        detail="Awaiting instruction"
                        online
                    />

                </div>


                {/* =================================================
                    LIVE BROWSER PREVIEW
                ================================================== */}

                <section className="mb-8 border border-[#3a5068] bg-[#0a1829] shadow-[6px_6px_0_rgba(0,0,0,0.18)]">

                    {/* Preview Header */}

                    <div className="flex items-center justify-between border-b border-[#2b3e54] px-5 py-4">

                        <div className="flex items-center gap-3">

                            <span className="text-[9px] text-[#536b82]">
                                03
                            </span>

                            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                                Live Browser
                            </h3>

                        </div>

                        <div className="flex items-center gap-2">

                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    browserPreview
                                        ? "animate-pulse bg-[#61e294] shadow-[0_0_8px_rgba(97,226,148,0.7)]"
                                        : "bg-[#40566d]"
                                }`}
                            />

                            <span className="text-[8px] uppercase tracking-[0.2em] text-[#536b82]">
                                {browserPreview
                                    ? "LIVE"
                                    : "WAITING"}
                            </span>

                        </div>

                    </div>


                    {/* Browser toolbar */}

                    <div className="border-b border-[#26384c] bg-[#07111f] px-4 py-3">

                        <div className="flex items-center gap-3">

                            <div className="flex gap-2">

                                <span className="text-[10px] text-[#40566d]">
                                    ←
                                </span>

                                <span className="text-[10px] text-[#40566d]">
                                    →
                                </span>

                                <span className="text-[10px] text-[#536b82]">
                                    ↻
                                </span>

                            </div>


                            <div className="flex min-w-0 flex-1 items-center border border-[#263b50] bg-[#0a1829] px-3 py-2">

                                <span className="mr-2 text-[8px] text-[#61e294]">
                                    ●
                                </span>

                                <span className="truncate text-[8px] uppercase tracking-[0.08em] text-[#71879b]">
                                    {currentPage.url ||
                                        "Waiting for controlled browser..."}
                                </span>

                            </div>


                            <span className="text-[10px] text-[#536b82]">
                                ⋮
                            </span>

                        </div>

                    </div>


                    {/* Preview image */}

                    <div className="bg-[#020810] p-3">

                        <div className="relative aspect-video w-full overflow-hidden border border-[#1d3044] bg-[#050c15]">

                            {browserPreview ? (

                                <img
                                    src={browserPreview}
                                    alt="Live browser preview"
                                    className="h-full w-full object-contain"
                                />

                            ) : (

                                <div className="absolute inset-0 flex flex-col items-center justify-center">

                                    <div className="mb-4 flex items-center gap-2">

                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#536b82]" />

                                        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#536b82]">
                                            Waiting for browser
                                        </span>

                                    </div>

                                    <p className="text-[8px] uppercase tracking-[0.15em] text-[#354a60]">
                                        Activate a browser tab to begin preview
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* Preview footer */}

                    <div className="flex items-center justify-between border-t border-[#26384c] px-5 py-3">

                        <span className="text-[7px] uppercase tracking-[0.18em] text-[#40566d]">
                            CONTROLLED BROWSER
                        </span>

                        <span className="text-[7px] uppercase tracking-[0.18em] text-[#40566d]">
                            LIVE MONITOR
                        </span>

                    </div>

                </section>


                {/* =================================================
                    WORKSPACE
                ================================================== */}

                <div className="grid gap-8 lg:grid-cols-[1.55fr_0.85fr]">


                    {/* =================================================
                        PRIMARY — TASK PANEL
                    ================================================== */}

                    <section className="border border-[#3a5068] bg-[#0a1829] shadow-[6px_6px_0_rgba(0,0,0,0.18)]">


                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-[#2b3e54] px-5 py-4">

                            <div className="flex items-center gap-3">

                                <span className="text-[9px] text-[#536b82]">
                                    01
                                </span>

                                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                                    Task instruction
                                </h3>

                            </div>

                            <span className="text-[8px] uppercase tracking-[0.2em] text-[#50677e]">
                                PRIMARY INPUT
                            </span>

                        </div>


                        {/* Content */}

                        <div className="p-5 md:p-7">

                            <p className="mb-5 max-w-xl text-[10px] leading-6 tracking-[0.04em] text-[#70869b]">
                                Tell WebPilot what you want it
                                to accomplish in plain language.
                            </p>


                            {/* Textarea */}

                            <div className="relative">

                                <span className="absolute left-4 top-4 text-[10px] text-[#42586e]">
                                    $
                                </span>

                                <textarea
                                    className="min-h-[180px] w-full resize-none border border-[#30465d] bg-[#06111f] p-4 pl-9 text-sm leading-7 text-[#e8edf2] outline-none transition placeholder:text-[#3f5367] focus:border-[#6d8ca8]"
                                    placeholder="Find a black backpack on Amazon under ₹2000..."
                                    value={task}
                                    onChange={(e) =>
                                        setTask(e.target.value)
                                    }
                                />

                                <span className="absolute bottom-3 right-3 text-[8px] uppercase tracking-[0.15em] text-[#3d5267]">
                                    NATURAL LANGUAGE
                                </span>

                            </div>


                            {/* Examples */}

                            <div className="mt-5">

                                <div className="mb-2 flex items-center gap-3">

                                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#526a81]">
                                        Try an example
                                    </span>

                                    <span className="h-px flex-1 bg-[#1e3044]" />

                                </div>


                                <div className="flex flex-wrap gap-2">

                                    <ExampleButton
                                        text="Search Amazon"
                                        onClick={() =>
                                            useExample(
                                                "Find a black backpack on Amazon under ₹2000"
                                            )
                                        }
                                    />

                                    <ExampleButton
                                        text="Find latest news"
                                        onClick={() =>
                                            useExample(
                                                "Find the latest news about artificial intelligence"
                                            )
                                        }
                                    />

                                    <ExampleButton
                                        text="Open GitHub"
                                        onClick={() =>
                                            useExample(
                                                "Open GitHub"
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            {/* Action */}

                            <div className="mt-6 flex flex-col gap-4 border-t border-[#1e3044] pt-5 sm:flex-row sm:items-center sm:justify-between">

                                <div className="min-h-[20px] text-[9px] uppercase tracking-[0.12em]">

                                    {message && (
                                        <span
                                            className={
                                                message.includes("success")
                                                    ? "text-[#61e294]"
                                                    : "text-[#e58b8b]"
                                            }
                                        >
                                            {message}
                                        </span>
                                    )}

                                    {!message && (
                                        <span className="text-[#42586e]">
                                            ENTER ↵ TO RUN
                                        </span>
                                    )}

                                </div>


                                <button
                                    onClick={sendTask}
                                    disabled={loading}
                                    className="group flex items-center justify-center gap-4 bg-[#dce5ec] px-8 py-3.5 text-xs font-black uppercase tracking-[0.15em] text-[#07111f] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    {loading ? (
                                        <>
                                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#07111f] border-t-transparent" />

                                            Executing
                                        </>
                                    ) : (
                                        <>
                                            Execute task

                                            <span className="transition-transform group-hover:translate-x-1">
                                                →
                                            </span>
                                        </>
                                    )}

                                </button>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        SECONDARY — AGENT PANEL
                    ================================================== */}

                    <section className="border border-[#26384c] bg-[#091725]">


                        {/* Header */}

                        <div className="border-b border-[#26384c] px-5 py-4">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <span className="text-[9px] text-[#536b82]">
                                        02
                                    </span>

                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                                        Agent
                                    </h3>

                                </div>

                                <span className="text-[8px] uppercase tracking-[0.2em] text-[#536b82]">
                                    LIVE
                                </span>

                            </div>

                        </div>


                        <div className="p-5">


                            {/* =================================================
                                AGENT STATE
                            ================================================== */}

                            <div className="mb-6 border border-[#203348] bg-[#07111f] p-5">

                                <div className="mb-4 flex items-center justify-between">

                                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#526a81]">
                                        Agent state
                                    </span>

                                    <span
                                        className={`h-2 w-2 rounded-full ${
                                            loading
                                                ? "animate-pulse bg-[#e5c261] shadow-[0_0_10px_rgba(229,194,97,0.5)]"
                                                : agentStatus === "CONNECTED"
                                                    ? "bg-[#61e294]"
                                                    : "bg-[#e58b8b]"
                                        }`}
                                    />

                                </div>


                                <p className="text-base font-bold uppercase tracking-[-0.02em] text-[#d0dbe5]">

                                    {loading
                                        ? "EXECUTING"
                                        : agentStatus === "OFFLINE"
                                            ? "OFFLINE"
                                            : currentState}

                                </p>


                                <p className="mt-2 text-[8px] uppercase tracking-[0.15em] text-[#52687d]">

                                    {loading
                                        ? "AI is controlling browser"
                                        : "Awaiting instruction"}

                                </p>

                            </div>


                            {/* =================================================
                                CURRENT PAGE
                            ================================================== */}

                            <div className="mb-6 border-b border-[#1e3044] pb-6">

                                <div className="mb-3 flex items-center justify-between">

                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#526a81]">
                                        Current browser
                                    </p>

                                    <span className="text-[7px] uppercase tracking-[0.15em] text-[#40566d]">
                                        LIVE
                                    </span>

                                </div>


                                {currentPage.title ? (
                                    <>

                                        <p className="text-sm font-bold text-[#d0dbe5]">
                                            {currentPage.title}
                                        </p>

                                        <p className="mt-1 break-all text-[8px] text-[#60778d]">
                                            {currentPage.url}
                                        </p>

                                    </>
                                ) : (
                                    <>

                                        <p className="text-sm text-[#53697e]">
                                            No page detected
                                        </p>

                                        <p className="mt-1 text-[8px] uppercase tracking-[0.1em] text-[#3f5367]">
                                            Browser awaiting task
                                        </p>

                                    </>
                                )}

                            </div>


                            {/* =================================================
                                ACTIVITY TIMELINE
                            ================================================== */}

                            <div>

                                <div className="mb-2 flex items-center justify-between">

                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#526a81]">
                                        Activity
                                    </p>

                                    <span className="text-[7px] uppercase tracking-[0.15em] text-[#40566d]">
                                        {activity.length} EVENTS
                                    </span>

                                </div>


                                <div>

                                    {activity.length === 0 ? (

                                        <ActivityItem
                                            time="--:--"
                                            type="SYSTEM"
                                            text="Waiting for activity..."
                                        />

                                    ) : (

                                        activity
                                            .slice(-8)
                                            .map(
                                                (
                                                    item,
                                                    index
                                                ) => (

                                                    <ActivityItem
                                                        key={index}
                                                        time={
                                                            item.time ||
                                                            new Date().toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    second: "2-digit",
                                                                }
                                                            )
                                                        }
                                                        type={
                                                            item.type ||
                                                            "SYSTEM"
                                                        }
                                                        text={
                                                            item.text
                                                        }
                                                        active={
                                                            item.active
                                                        }
                                                    />

                                                )
                                            )

                                    )}

                                </div>

                            </div>


                            {/* =================================================
                                METRICS
                            ================================================== */}

                            <div className="mt-6 grid grid-cols-3 border-t border-[#1e3044] pt-5">

                                <Metric
                                    label="EVENTS"
                                    value={activity.length}
                                />

                                <Metric
                                    label="PAGE"
                                    value={
                                        currentPage.url
                                            ? "01"
                                            : "00"
                                    }
                                />

                                <Metric
                                    label="STATUS"
                                    value={
                                        loading
                                            ? "RUN"
                                            : "IDLE"
                                    }
                                />

                            </div>

                        </div>

                    </section>

                </div>


                {/* =================================================
                    FOOTER
                ================================================== */}

                <footer className="mt-10 flex flex-col gap-2 border-t border-[#26374b] pt-5 text-[8px] uppercase tracking-[0.18em] text-[#50667c] sm:flex-row sm:items-center sm:justify-between">

                    <span>
                        MS / WEBPILOT / PRIVATE BROWSER AGENT
                    </span>

                    <span>
                        LOCAL CONTROL · V0.1
                    </span>

                </footer>

            </section>

        </main>
    );
}


/* =============================================================
   STATUS BLOCK
============================================================= */

function StatusBlock({
    number,
    label,
    value,
    detail,
    online,
}) {

    return (

        <div className="border-b border-[#2b3e54] p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">

            <div className="mb-6 flex items-center justify-between">

                <span className="text-[9px] text-[#536b82]">
                    {number}
                </span>

                <span
                    className={`h-1.5 w-1.5 rounded-full ${
                        online
                            ? "bg-[#61e294]"
                            : "bg-[#e58b8b]"
                    }`}
                />

            </div>


            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#70869b]">
                {label}
            </p>


            <div className="mt-2 flex items-center gap-2">

                <span
                    className={`text-[11px] font-bold tracking-[-0.02em] ${
                        online
                            ? "text-[#d0dbe5]"
                            : "text-[#e58b8b]"
                    }`}
                >
                    {value}
                </span>

            </div>


            <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-[#42596f]">
                {detail}
            </p>

        </div>

    );
}


/* =============================================================
   EXAMPLE BUTTON
============================================================= */

function ExampleButton({
    text,
    onClick,
}) {

    return (

        <button
            type="button"
            onClick={onClick}
            className="border border-[#293e53] bg-[#07111f] px-3 py-2 text-[8px] uppercase tracking-[0.12em] text-[#657b90] transition hover:border-[#526b82] hover:text-[#d0dbe5]"
        >
            {text}
        </button>

    );
}


/* =============================================================
   ACTIVITY ITEM
============================================================= */

function ActivityItem({
    time,
    type,
    text,
    active,
}) {

    return (

        <div className="flex gap-3 border-b border-[#1b2b3d] py-3 last:border-b-0">

            <span className="w-[52px] shrink-0 text-[7px] text-[#43596e]">
                {time}
            </span>


            <span
                className={
                    active
                        ? "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#61e294]"
                        : "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#405367]"
                }
            />


            <div className="min-w-0">

                <span className="mr-2 text-[7px] font-bold tracking-[0.12em] text-[#536b82]">
                    {type}
                </span>

                <span
                    className={
                        active
                            ? "break-words text-[9px] uppercase tracking-[0.05em] text-[#9aabba]"
                            : "break-words text-[9px] uppercase tracking-[0.05em] text-[#52687d]"
                    }
                >
                    {text}
                </span>

            </div>

        </div>

    );
}


/* =============================================================
   METRIC
============================================================= */

function Metric({
    label,
    value,
}) {

    return (

        <div>

            <p className="text-[7px] uppercase tracking-[0.15em] text-[#40566d]">
                {label}
            </p>

            <p className="mt-1 text-xs font-bold text-[#91a5b8]">
                {value}
            </p>

        </div>

    );
}

