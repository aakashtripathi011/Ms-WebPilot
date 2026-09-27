🕵️ Ms WebPilot — A Privacy-First Browser Agent

An intelligent browser automation agent that understands your screen, protects your sensitive data locally, and safely executes tasks — without ever sending raw personal information to the cloud.

Ms WebPilot is a full-stack browser agent built for Smart India Hackathon 2026 (Problem Statement ID: 26171 — On-device Visual Perception for Light-weight Browser Agents).

The system runs perception and privacy protection locally in the browser, sanitizing sensitive data before any network request is made, and only sends safe, redacted context to a server-side AI model for reasoning.

It also features a Privacy Firewall, an on-device protection layer that detects and redacts PII, credentials, and faces using local vision and text sanitization models — before the AI reasoning layer ever sees the data.

---

## 💻 Repository

🔧 Status: Prototype under active development — not yet deployed

💻 GitHub Repository:
`<add your repo link here>`

---

## ✨ Features

### 🔐 Privacy Firewall
- Local PII detection (email, phone, government IDs, card numbers)
- Face detection and blurring
- Password/credential black-out
- Redaction metadata generation for server-side awareness

### 👁️ Local Visual Perception
- On-device screen understanding using a lightweight vision model
- Runs entirely in-browser via WebGPU
- No raw screenshot ever leaves the device unprotected

### 🧠 AI-Powered Reasoning
- Sanitized context sent to a server-side vision-language model
- Model interprets the task and returns a structured action
- Works with open-weight models (swappable, model-agnostic)

### ✅ Action Validation
- Every AI-generated action is checked against a JSON schema before execution
- Rejects malformed, unsafe, or low-confidence actions
- Prevents the agent from blindly trusting model output

### ⚡ Browser Automation
- Executes validated actions — click, type, scroll, navigate, submit
- Runs as a browser extension (Chrome Manifest V3 + Firefox WebExtensions)
- Continuously observes new page state and loops back into perception

---

## 🤖 Privacy-Preserving Pipeline

Ms WebPilot processes every task through a 7-stage loop, ensuring sensitive data never reaches the server unprotected.

**Agent Loop**

```
SEE → PROTECT → THINK → VALIDATE → ACT → OBSERVE → REPEAT
```

| Stage | What Happens |
|---|---|
| **See** | Extension captures the current browser state (DOM + screenshot) |
| **Protect** | Local vision model + Privacy Firewall detect and redact sensitive elements |
| **Think** | Sanitized context is sent to the server; AI model reasons about the task |
| **Validate** | Action Validator checks the AI's response against a JSON schema |
| **Act** | Browser extension executes the validated action |
| **Observe** | New page state is captured; loop continues until task completion |

The extracted action is validated before execution rather than being treated as automatically safe — the extension checks it against schema rules first.

---

## 🛡️ Redaction Scheme

| Data Type | Redaction Method |
|---|---|
| Faces | Blurred |
| Passwords / credentials | Blacked out |
| PII (email, phone, ID, card numbers) | Masked |

Redaction metadata is passed along with the sanitized context so the server-side model knows which regions were intentionally hidden.

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │        User           │
                         └──────────┬────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │  Browser Extension     │
                         │  Chrome MV3 / Firefox  │
                         │     WebExtensions      │
                         └──────────┬────────────┘
                                    │
                          Local perception + redaction
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │      🔒 LOCAL / ON-DEVICE       │
                    │  (raw data never leaves here)  │
                    │                                 │
                    │  Local Perception (WebGPU)      │
                    │        ↓                        │
                    │  Privacy Firewall                │
                    │  (faces blurred, passwords       │
                    │   blacked out, PII masked)        │
                    │        ↓                          │
                    │  Sanitized Context + Metadata     │
                    └───────────────┬───────────────────┘
                                    │  sanitized context only
                                    ▼
                    ┌───────────────────────────────┐
                    │     ☁️ SECURE REASONING          │
                    │      (external server)          │
                    │                                  │
                    │  AI Reasoning (VLM)               │
                    │        ↓                          │
                    │  Action Validator (JSON Schema)   │
                    │        ↓                          │
                    │  Structured Action Response        │
                    └───────────────┬───────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Browser Execution    │
                         │  click · type · scroll │
                         │   navigate · submit    │
                         └──────────┬────────────┘
                                    │
                                    ▼
                            Observe Result
                                    │
                          (loops back to Local
                             Perception / See)
```

**Architecture Overview**
- **Client:** Browser extension (Chrome MV3 + Firefox WebExtensions) captures screen state and runs local perception
- **Privacy Layer:** On-device Privacy Firewall sanitizes PII, credentials, and faces before anything leaves the device
- **Server:** Reasoning model interprets sanitized context and returns a structured, validated action
- **Execution:** Extension executes only validated actions and re-observes the browser state

---

## 🔄 Application Flow

**End-to-End Task Flow**

```
User gives a task
       ↓
Extension captures browser state
       ↓
Local Perception reads the screen
       ↓
Privacy Firewall redacts sensitive data
       ↓
Sanitized context sent to server
       ↓
AI Reasoning generates next action
       ↓
Action Validator checks the action
       ↓
Browser executes the validated action
       ↓
New page state observed
       ↓
Loop continues until task is complete
```

**Example Task**

```
Task: "Search Amazon for a black bag"

Extension  → Capture screen (DOM + screenshot)
Firewall   → Redact saved address / payment / login info
Extension  → Send sanitized context to server
Server     → Action: click search bar
Extension  → Execute click
Server     → Action: type "black bag"
Extension  → Execute type
Server     → Action: press Enter
Extension  → Execute Enter
             → Search results displayed to user
```

No personal or account data ever leaves the device during this flow.

---

## 📊 Evaluation Metric Alignment

| Metric | Weight | Our Approach |
|---|---|---|
| Accuracy of visual context | 25% | Local vision model + DOM/visual context for structured screen understanding |
| PII detection recall/precision | 20% | DOM + text sanitization + face detection (layered detection) |
| Precision of redaction | 20% | Region-level, type-specific redaction (blur/black-out/mask) preserving usable context |
| Client-side resource utilization | 20% | Quantized local model via WebGPU, with CPU fallback |
| End-to-end latency | 15% | Optimized capture → perception → protection → reasoning → validation → action pipeline |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Chrome Manifest V3 | Browser extension runtime (Chrome) |
| Firefox WebExtensions | Browser extension runtime (Firefox) |
| WebGPU | Local ML inference acceleration |
| Transformers.js | In-browser model execution |
| ONNX Runtime Web | Runs ML models directly inside the browser |
| Local Vision Model | Lightweight on-device visual perception |
| DOM/Text Sanitization | Local PII detection and redaction |
| Face Detection | Local face detection and blurring |
| Node.js | Backend runtime |
| Express.js | REST API / server framework |
| Socket.IO | Real-time browser–server coordination |
| Vision-Language Model | Server-side reasoning (open-weight, swappable) |
| JSON Schema | Action validation before execution |

---

## 🔒 Why It's Different

| | Traditional Browser Agent | Ms WebPilot |
|---|---|---|
| Data sent to cloud | Raw screenshot / full page data | Sanitized, PII-redacted context only |
| Privacy boundary | After AI reasoning (or none) | Before AI reasoning |
| Action trust | AI output executed directly | Every action passes an Action Validator |
| Model flexibility | Tightly coupled | Modular — perception/reasoning models are swappable |

---

## 🔐 Security

- Raw screenshots and page data never leave the device unprotected
- Faces, passwords, and PII are redacted locally before any network request
- Every AI-generated action is validated against a schema before execution
- Sensitive credentials (API keys, server secrets) are managed via environment variables

The following should never be committed to the repository:
- `.env` files
- API keys / model gateway credentials
- Server secrets
- Any raw user data captured during testing

---

## 🚀 Future Improvements

- Adaptive resolution perception for better latency/accuracy balance
- Broader PII detection coverage (multilingual text, handwritten fields)
- Support for additional browsers (Edge, Safari)
- On-device caching of frequent action patterns
- Visual explainability — show users what was redacted before sending
- Offline-first fallback reasoning for low-connectivity environments
- Expanded benchmark suite for accuracy, recall, and latency metrics

---

## 🎯 Project Objective

Background AI agents are becoming increasingly common, but most agentic pipelines run entirely server-side — limiting the type of data users can safely share with them.

Ms WebPilot's objective is to bridge local and cloud environments: run lightweight perception and privacy protection on the user's device, while still leveraging the reasoning power of server-based AI — without ever exposing raw personal data.

Instead of choosing between capability and privacy, Ms WebPilot aims to provide both.

---

## 🏆 Project Highlights

Ms WebPilot combines:
- On-device visual perception (WebGPU)
- Local privacy firewall (PII + face redaction)
- Server-side AI reasoning (open-weight, swappable models)
- Structured action validation before execution
- Cross-browser extension support (Chrome + Firefox)
- Privacy-by-design architecture — protection before reasoning, not after

---

## 📌 Project Status

🚧 Under Development

Ms WebPilot is an actively developed prototype built for SIH 2026 (Problem Statement 26171), with ongoing improvements to perception accuracy, redaction precision, and end-to-end latency.

---

## 📄 License

This project is currently intended for educational, hackathon, and project demonstration purposes.
