"use client";

import { useEffect, useState } from "react";

const steps = [
  "SEE",
  "PROTECT",
  "THINK",
  "VALIDATE",
  "ACT",
  "OBSERVE",
  "COMPLETE",
];

export default function AboutPage() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-flow-step]");

    const updateActive = () => {
      const midpoint = window.innerHeight * 0.48;

      let closest = 0;
      let distance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const currentDistance = Math.abs(center - midpoint);

        if (currentDistance < distance) {
          distance = currentDistance;
          closest = Number(section.dataset.flowStep);
        }
      });

      setActiveStep(closest);
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    updateActive();

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#07111f] font-mono text-[#e8edf2]">
      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#26374b] bg-[#07111f]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-6 lg:px-10">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e8edf2]">
              MS / WEBPILOT
            </div>

            <div className="mt-1 text-[8px] uppercase tracking-[0.18em] text-[#a5b8c8]">
              Architecture / Privacy / Browser Agent
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-[8px] uppercase tracking-[0.18em] text-[#b0bfcc] sm:block">
              SYSTEM ARCHITECTURE
            </div>

            <div className="flex items-center gap-2 border border-[#30465d] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#61e294] shadow-[0_0_10px_rgba(97,226,148,0.6)]" />
              <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#c0ccd6]">
                LOCAL FIRST
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden border-b border-[#26374b] px-6 pb-24 pt-32 lg:px-10">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a5b8c8]">
              SIH26171
            </span>

            <span className="h-px w-16 bg-[#40566d]" />

            <span className="text-[9px] uppercase tracking-[0.16em] text-[#a5b8c8]">
              ISRO / SMART AUTOMATION
            </span>
          </div>

          <h1 className="max-w-[1200px] text-[clamp(4rem,11vw,11rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
            SEE.
            <br />
            <span className="text-[#71899f]">PROTECT.</span>
            <br />
            BROWSE.
          </h1>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="max-w-[760px] text-[clamp(1rem,1.6vw,1.35rem)] leading-[1.7] text-[#c5d0d9]">
                Ms WebPilot is a privacy-first browser agent designed to
                understand webpages, protect sensitive information locally,
                reason about tasks, and execute browser actions safely.
              </p>
            </div>

            <div className="border-l-2 border-[#526f8c] pl-5">
              <div className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#a5b8c8]">
                CORE PRINCIPLE
              </div>

              <div className="text-[18px] font-bold uppercase leading-[1.3] tracking-[-0.03em] text-[#e8edf2]">
                Protect locally.
                <br />
                Reason intelligently.
                <br />
                Act safely.
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 right-6 hidden text-right lg:block">
            <div className="text-[8px] uppercase tracking-[0.18em] text-[#8fa6bb]">
              SCROLL TO TRACE THE AGENT
            </div>
            <div className="mt-2 text-[14px] text-[#71899f]">↓</div>
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section className="border-b border-[#26374b] px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-16 grid gap-8 lg:grid-cols-[280px_1fr]">
            <SectionLabel number="00" title="THE IDEA" />

            <div>
              <h2 className="max-w-[900px] text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.06em] text-[#e8edf2]">
                The browser sees.
                <br />
                The firewall protects.
                <br />
                The model reasons.
              </h2>

              <p className="mt-8 max-w-[780px] text-[15px] leading-[1.8] text-[#c0ccd6]">
                Instead of sending raw browser screenshots and page data
                directly to an AI system, Ms WebPilot introduces a local
                privacy layer before reasoning takes place.
              </p>
            </div>
          </div>

          <div className="grid border border-[#30465d] lg:grid-cols-5">
            <PipelineBox
              number="01"
              title="LOCAL VISION"
              text="Understand the current browser state."
            />

            <PipelineArrow />

            <PipelineBox
              number="02"
              title="PRIVACY FIREWALL"
              text="Detect and sanitize sensitive information locally."
            />

            <PipelineArrow />

            <PipelineBox
              number="03"
              title="SANITIZED CONTEXT"
              text="Only safe context moves forward."
            />
          </div>

          <div className="mt-3 grid border border-[#30465d] lg:grid-cols-5">
            <PipelineBox
              number="04"
              title="AI REASONING"
              text="Determine what action should happen next."
            />

            <PipelineArrow />

            <PipelineBox
              number="05"
              title="ACTION VALIDATOR"
              text="Reject malformed or unsafe model output."
            />

            <PipelineArrow />

            <PipelineBox
              number="06"
              title="BROWSER ACTION"
              text="Execute the validated action."
            />
          </div>
        </div>
      </section>

      {/* AGENT LOOP */}
      <section className="border-b border-[#26374b] px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-20 grid gap-8 lg:grid-cols-[280px_1fr]">
            <SectionLabel number="01" title="AGENT LOOP" />

            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#a5b8c8]">
                SEVEN STAGES / ONE CONTINUOUS LOOP
              </div>

              <p className="mt-6 max-w-[760px] text-[15px] leading-[1.8] text-[#c5d0d9]">
                Every browser interaction follows a controlled sequence.
                Perception happens locally, sensitive information is filtered,
                reasoning produces a structured action, and the browser is
                observed again after execution.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[31px] top-0 hidden h-full w-px bg-[#30465d] lg:block" />

            {steps.map((step, index) => (
              <FlowSection
                key={step}
                index={index}
                title={step}
                active={activeStep === index}
              >
                {index === 0 && (
                  <StepContent
                    title="LOCAL PERCEPTION"
                    description="The extension captures the current browser state and identifies the elements that matter for the task."
                    rows={[
                      ["INPUT", "DOM / TEXT / VISUAL STATE"],
                      ["PROCESS", "LOCAL VISION MODEL"],
                      ["OUTPUT", "STRUCTURED PAGE CONTEXT"],
                    ]}
                  />
                )}

                {index === 1 && (
                  <StepContent
                    title="PRIVACY FIREWALL"
                    description="Sensitive information is detected before AI reasoning receives browser context."
                    rows={[
                      ["TEXT", "EMAILS / PHONE / PASSWORDS"],
                      ["IDENTIFIERS", "CARDS / GOVERNMENT IDS / API KEYS"],
                      ["VISUAL", "LOCAL FACE DETECTION + REDACTION"],
                    ]}
                  />
                )}

                {index === 2 && (
                  <StepContent
                    title="AI REASONING"
                    description="Only sanitized context reaches the reasoning layer. The model decides what should happen next."
                    rows={[
                      ["INPUT", "SANITIZED PAGE CONTEXT"],
                      ["MODEL", "QWEN2.5-VL / GEMMA"],
                      ["OUTPUT", "STRUCTURED ACTION JSON"],
                    ]}
                  />
                )}

                {index === 3 && (
                  <StepContent
                    title="ACTION VALIDATION"
                    description="Model output is never trusted directly. Every action passes through a validation layer."
                    rows={[
                      ["TYPE", "CLICK / TYPE / SCROLL / URL"],
                      ["FIELDS", "REQUIRED VALUES PRESENT"],
                      ["TARGET", "SAFE STRUCTURE + FORMAT"],
                      ["CONFIDENCE", "REASONABLE ACTION CONFIDENCE"],
                    ]}
                  />
                )}

                {index === 4 && (
                  <StepContent
                    title="BROWSER EXECUTION"
                    description="The Chrome extension executes only the validated instruction."
                    rows={[
                      ["EXECUTE", "CLICK / TYPE / SCROLL"],
                      ["NAVIGATE", "BACK / OPEN URL"],
                      ["CONTROL", "MANIFEST V3 EXTENSION"],
                    ]}
                  />
                )}

                {index === 5 && (
                  <StepContent
                    title="OBSERVE AGAIN"
                    description="After the action, the browser state changes. That new state becomes the next perception input."
                    rows={[
                      ["EVENT", "PAGE STATE UPDATE"],
                      ["SIGNAL", "DOM / VISUAL CHANGE"],
                      ["NEXT", "RETURN TO SEE"],
                    ]}
                  />
                )}

                {index === 6 && (
                  <StepContent
                    title="TASK COMPLETION"
                    description="The loop stops when the requested task is completed or the system determines that it cannot safely continue."
                    rows={[
                      ["SUCCESS", "TASK COMPLETED"],
                      ["FAILURE", "SAFE STOP / RECOVERY"],
                      ["OUTPUT", "FINAL BROWSER STATE"],
                    ]}
                  />
                )}
              </FlowSection>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="border-b border-[#26374b] px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
            <SectionLabel number="02" title="PRIVACY" />

            <div>
              <div className="mb-12">
                <div className="mb-4 text-[9px] uppercase tracking-[0.2em] text-[#a5b8c8]">
                  PRIVACY FIREWALL
                </div>

                <h2 className="max-w-[900px] text-[clamp(2.4rem,5vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#e8edf2]">
                  Raw browser
                  <br />
                  data stops here.
                </h2>

                <p className="mt-8 max-w-[800px] text-[15px] leading-[1.8] text-[#c5d0d9]">
                  The privacy firewall sits between the browser and AI
                  reasoning. Its purpose is simple: sensitive information
                  should not leave the device in raw form.
                </p>
              </div>

              <PrivacyLayer
                number="LAYER 01"
                title="DOM / TEXT"
                items={[
                  "EMAIL ADDRESSES",
                  "PHONE NUMBERS",
                  "PASSWORD VALUES",
                  "PAYMENT / CARD DATA",
                  "GOVERNMENT IDS",
                  "API KEYS / SECRETS",
                  "BANKING INFORMATION",
                  "ADDRESSES",
                ]}
              />

              <PrivacyLayer
                number="LAYER 02"
                title="VISUAL"
                items={[
                  "LOCAL FACE DETECTION",
                  "FACE REDACTION",
                  "VISUAL PII MASKING",
                  "NO UNREDACTED FACE SENT TO SERVER",
                ]}
              />

              <div className="mt-10 border border-[#526f8c] bg-[#0b192a] p-6">
                <div className="mb-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#61e294]">
                  DATA BOUNDARY
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.12em]">
                  <span className="border border-[#30465d] px-3 py-2 text-[#c0ccd6]">
                    BROWSER
                  </span>

                  <span className="text-[#71899f]">→</span>

                  <span className="border border-[#526f8c] px-3 py-2 text-[#e8edf2]">
                    PRIVACY FIREWALL
                  </span>

                  <span className="text-[#71899f]">→</span>

                  <span className="border border-[#30465d] px-3 py-2 text-[#c0ccd6]">
                    AI REASONING
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTION VALIDATION */}
      <section className="border-b border-[#26374b] px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
            <SectionLabel number="03" title="SAFETY" />

            <div>
              <div className="mb-10">
                <div className="mb-4 text-[9px] uppercase tracking-[0.2em] text-[#a5b8c8]">
                  ACTION VALIDATOR
                </div>

                <h2 className="max-w-[850px] text-[clamp(2.4rem,5vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#e8edf2]">
                  Never trust
                  <br />
                  model output
                  <br />
                  directly.
                </h2>
              </div>

              <ActionBox
                number="01"
                title="ALLOWED ACTION"
                text="Is the requested action one the browser extension is permitted to execute?"
              />

              <ActionBox
                number="02"
                title="REQUIRED FIELDS"
                text="Does the structured action contain every value required for execution?"
              />

              <ActionBox
                number="03"
                title="TARGET FORMAT"
                text="Does the target selector, URL, or input structure match the expected format?"
              />

              <ActionBox
                number="04"
                title="CONFIDENCE"
                text="Does the action meet the confidence threshold required by the system?"
              />

              <div className="mt-8 border border-[#30465d] p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c0ccd6]">
                    AI
                  </span>

                  <span className="text-[#71899f]">→</span>

                  <span className="border border-[#526f8c] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-[#e8edf2]">
                    ACTION VALIDATOR
                  </span>

                  <span className="text-[#71899f]">→</span>

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c0ccd6]">
                    BROWSER
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="border-b border-[#26374b] px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
            <SectionLabel number="04" title="ARCHITECTURE" />

            <div>
              <div className="mb-12">
                <div className="mb-4 text-[9px] uppercase tracking-[0.2em] text-[#a5b8c8]">
                  FULL SYSTEM
                </div>

                <h2 className="max-w-[1000px] text-[clamp(2.2rem,4.5vw,4.8rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-[#e8edf2]">
                  Device.
                  <br />
                  Firewall.
                  <br />
                  Reasoning.
                  <br />
                  Browser.
                </h2>
              </div>

              <div className="space-y-3">
                <PipelineBox
                  number="01"
                  title="USER TASK"
                  text="Natural language instruction enters the agent."
                />

                <PipelineBox
                  number="02"
                  title="CHROME EXTENSION / MANIFEST V3"
                  text="Controls the browser and collects page state."
                />

                <PipelineBox
                  number="03"
                  title="LOCAL PERCEPTION"
                  text="SmolVLM + WebGPU + Transformers.js / ONNX Runtime Web."
                />

                <PipelineBox
                  number="04"
                  title="LOCAL PRIVACY FIREWALL"
                  text="DOM sanitization, PII detection and visual redaction."
                />

                <PipelineBox
                  number="05"
                  title="SANITIZED CONTEXT"
                  text="Only the minimum safe information is sent forward."
                />

                <PipelineBox
                  number="06"
                  title="SERVER REASONING"
                  text="Node.js + Express + Socket.IO + OpenRouter model gateway."
                />

                <PipelineBox
                  number="07"
                  title="STRUCTURED JSON"
                  text="The reasoning layer produces a machine-readable action."
                />

                <PipelineBox
                  number="08"
                  title="ACTION VALIDATOR"
                  text="Unsafe, malformed or unsupported actions are rejected."
                />

                <PipelineBox
                  number="09"
                  title="BROWSER EXECUTION"
                  text="Validated click, type, scroll, navigation or URL action."
                />

                <PipelineBox
                  number="10"
                  title="NEW PAGE STATE"
                  text="The updated browser becomes the next perception input."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DATA CLASSIFICATION */}
      <section className="border-b border-[#26374b] px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
            <SectionLabel number="05" title="DATA" />

            <div>
              <div className="mb-10">
                <div className="mb-4 text-[9px] uppercase tracking-[0.2em] text-[#a5b8c8]">
                  DATA CLASSIFICATION
                </div>

                <h2 className="max-w-[900px] text-[clamp(2.2rem,4vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-[#e8edf2]">
                  What stays
                  <br />
                  on the device.
                </h2>
              </div>

              <div className="overflow-x-auto border border-[#30465d]">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#30465d]">
                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#b0bfcc]">
                        DATA
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#b0bfcc]">
                        LOCATION
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#b0bfcc]">
                        SERVER
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <DataRow
                      data="Raw PII"
                      location="DEVICE"
                      server="NO"
                    />

                    <DataRow
                      data="Password values"
                      location="DEVICE"
                      server="NO"
                    />

                    <DataRow
                      data="Detected faces"
                      location="DEVICE"
                      server="NO UNREDACTED FACE"
                    />

                    <DataRow
                      data="Sanitized DOM text"
                      location="DEVICE → SERVER"
                      server="YES"
                    />

                    <DataRow
                      data="Sanitized visual context"
                      location="DEVICE → SERVER"
                      server="WHEN REQUIRED"
                    />

                    <DataRow
                      data="AI action JSON"
                      location="SERVER → DEVICE"
                      server="YES"
                    />

                    <DataRow
                      data="Browser execution"
                      location="DEVICE"
                      server="NO"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRADITIONAL VS WEBPILOT */}
      <section className="border-b border-[#26374b] px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
            <SectionLabel number="06" title="DIFFERENCE" />

            <div>
              <div className="mb-12">
                <div className="mb-4 text-[9px] uppercase tracking-[0.2em] text-[#a5b8c8]">
                  ARCHITECTURE COMPARISON
                </div>

                <h2 className="max-w-[900px] text-[clamp(2.3rem,4.5vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#e8edf2]">
                  The privacy
                  <br />
                  boundary moves
                  <br />
                  before AI.
                </h2>
              </div>

              <ComparisonBlock
                label="TRADITIONAL BROWSER AGENT"
                items={[
                  "BROWSER",
                  "RAW SCREENSHOT / RAW PAGE DATA",
                  "CLOUD AI",
                  "ACTION",
                ]}
              />

              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-[#30465d]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#61e294]">
                  PRIVACY BOUNDARY
                </span>
                <span className="h-px flex-1 bg-[#30465d]" />
              </div>

              <ComparisonBlock
                label="MS WEBPILOT"
                highlight
                items={[
                  "BROWSER",
                  "LOCAL PERCEPTION",
                  "LOCAL PRIVACY FIREWALL",
                  "SANITIZED CONTEXT",
                  "AI REASONING",
                  "ACTION VALIDATOR",
                  "BROWSER",
                  "OBSERVE AGAIN",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEASIBILITY */}
      <section className="border-b border-[#26374b] px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
            <SectionLabel number="07" title="FEASIBILITY" />

            <div>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                  title="LOCAL VISION"
                  text="Lightweight browser perception can run locally using WebGPU and compact vision models."
                />

                <InfoCard
                  title="PRIVACY"
                  text="PII and face detection happen before server-side reasoning receives browser context."
                />

                <InfoCard
                  title="STRUCTURED ACTIONS"
                  text="Reasoning is constrained to a small set of browser actions instead of unrestricted execution."
                />

                <InfoCard
                  title="RECOVERY"
                  text="Socket-based state updates allow the system to observe browser changes and continue the loop."
                />
              </div>

              <div className="mt-10 border border-[#30465d] p-6">
                <div className="mb-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[#a5b8c8]">
                  MEASUREMENTS
                </div>

                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    "PII DETECTION / MASKING",
                    "FACE DETECTION / REDACTION",
                    "LEAKAGE RATE",
                    "TASK COMPLETION",
                    "ACTION ACCURACY",
                    "INVALID-ACTION REJECTION",
                    "ACTION COUNT",
                    "INFERENCE LATENCY",
                    "PRIVACY LATENCY",
                    "SERVER LATENCY",
                    "END-TO-END LATENCY",
                    "MEMORY USAGE",
                    "WEBGPU VS CPU",
                    "RECOVERY SUCCESS",
                    "BROWSER EXECUTION",
                  ].map((metric) => (
                    <div
                      key={metric}
                      className="border-l border-[#40566d] pl-3 text-[9px] font-bold uppercase tracking-[0.1em] text-[#b5c3ce]"
                    >
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="border-b border-[#26374b] px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
            <SectionLabel number="08" title="APPLICATIONS" />

            <div>
              <h2 className="max-w-[1000px] text-[clamp(2.3rem,5vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#e8edf2]">
                Automation
                <br />
                without
                <br />
                surrendering
                <br />
                privacy.
              </h2>

              <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  "PRODUCTIVITY",
                  "ENTERPRISE AUTOMATION",
                  "PRIVACY-SENSITIVE WORKFLOWS",
                  "FINANCIAL INTERFACES",
                  "HEALTHCARE PORTALS",
                  "GOVERNMENT SERVICES",
                  "PERSONAL ACCOUNTS",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="border border-[#30465d] p-5 transition hover:border-[#526f8c]"
                  >
                    <div className="mb-8 text-[8px] text-[#71899f]">
                      0{index + 1}
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#c7d2db]">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL */}
      <section className="relative flex min-h-[80vh] items-center px-6 py-28 lg:px-10">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="mb-8 text-[9px] font-bold uppercase tracking-[0.22em] text-[#a5b8c8]">
            MS WEBPILOT / CORE PROPOSITION
          </div>

          <h2 className="max-w-[1200px] text-[clamp(3.2rem,8vw,9rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
            Protect
            <br />
            <span className="text-[#71899f]">locally.</span>
            <br />
            Reason
            <br />
            intelligently.
            <br />
            <span className="text-[#61e294]">Act safely.</span>
          </h2>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <p className="max-w-[760px] text-[15px] leading-[1.8] text-[#c5d0d9]">
              Privacy protection should happen before AI reasoning, not after
              it. Ms WebPilot treats the browser as a controlled environment:
              perceive locally, sanitize locally, reason with only what is
              necessary, validate every action, and observe the result again.
            </p>

            <div className="border-l-2 border-[#61e294] pl-5">
              <div className="text-[9px] uppercase tracking-[0.18em] text-[#a5b8c8]">
                TEAM
              </div>

              <div className="mt-2 text-[15px] font-bold uppercase text-[#e8edf2]">
                MS WEBPILOT
              </div>

              <div className="mt-2 text-[9px] uppercase tracking-[0.15em] text-[#b0bfcc]">
                SMART AUTOMATION / SIH26171
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#26374b] px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 text-[8px] uppercase tracking-[0.16em] text-[#8fa6bb] sm:flex-row sm:items-center sm:justify-between">
          <span>MS / WEBPILOT</span>

          <span>PRIVACY-FIRST BROWSER AGENT</span>

          <span>LOCAL → SANITIZE → REASON → VALIDATE → ACT</span>
        </div>
      </footer>
    </main>
  );
}

/* --------------------------------------------------
   COMPONENTS
-------------------------------------------------- */

function SectionLabel({ number, title }) {
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="mb-3 text-[9px] font-bold tracking-[0.18em] text-[#71899f]">
        {number}
      </div>

      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b5c3ce]">
        {title}
      </div>

      <div className="mt-5 h-px w-12 bg-[#526f8c]" />
    </div>
  );
}

function FlowSection({ index, title, active, children }) {
  return (
    <section
      data-flow-step={index}
      className="relative border-t border-[#30465d] py-12 lg:pl-20"
    >
      <div
        className={`absolute left-[20px] top-[46px] hidden h-[23px] w-[23px] -translate-x-1/2 items-center justify-center border lg:flex ${
          active
            ? "border-[#61e294] bg-[#0b192a]"
            : "border-[#40566d] bg-[#07111f]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 ${
            active ? "bg-[#61e294]" : "bg-[#71899f]"
          }`}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[180px_1fr]">
        <div>
          <div
            className={`text-[clamp(1.5rem,3vw,2.6rem)] font-black uppercase tracking-[-0.05em] ${
              active ? "text-[#e8edf2]" : "text-[#71899f]"
            }`}
          >
            {title}
          </div>

          <div className="mt-2 text-[8px] uppercase tracking-[0.16em] text-[#8fa6bb]">
            STEP 0{index + 1}
          </div>
        </div>

        <div>{children}</div>
      </div>
    </section>
  );
}

function StepContent({ title, description, rows }) {
  return (
    <div>
      <div className="mb-5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#b5c3ce]">
        {title}
      </div>

      <p className="mb-7 max-w-[760px] text-[14px] leading-[1.8] text-[#c5d0d9]">
        {description}
      </p>

      <div className="border border-[#30465d]">
        {rows.map(([label, value], index) => (
          <div
            key={label}
            className={`grid gap-3 px-4 py-4 sm:grid-cols-[150px_1fr] ${
              index !== 0 ? "border-t border-[#26374b]" : ""
            }`}
          >
            <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#a5b8c8]">
              {label}
            </div>

            <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#c7d2db]">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineBox({ number, title, text }) {
  return (
    <div className="border-[#30465d] bg-[#091727] p-5 lg:border-r last:lg:border-r-0">
      <div className="mb-8 text-[8px] font-bold tracking-[0.16em] text-[#71899f]">
        {number}
      </div>

      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#e8edf2]">
        {title}
      </div>

      <div className="text-[10px] leading-[1.7] text-[#b5c3ce]">
        {text}
      </div>
    </div>
  );
}

function PipelineArrow() {
  return (
    <div className="hidden items-center justify-center border-r border-[#30465d] bg-[#081523] lg:flex">
      <span className="text-[14px] text-[#71899f]">→</span>
    </div>
  );
}

function PrivacyLayer({ number, title, items }) {
  return (
    <div className="mb-5 border border-[#30465d]">
      <div className="flex flex-col justify-between gap-3 border-b border-[#30465d] bg-[#091727] px-5 py-4 sm:flex-row sm:items-center">
        <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#e8edf2]">
          {title}
        </div>

        <div className="text-[8px] uppercase tracking-[0.16em] text-[#a5b8c8]">
          {number}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={item}
            className={`px-5 py-4 text-[9px] font-bold uppercase tracking-[0.08em] text-[#b5c3ce] ${
              index > 0 ? "border-t border-[#26374b] sm:border-t-0" : ""
            }`}
          >
            <span className="mr-2 text-[#61e294]">+</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionBox({ number, title, text }) {
  return (
    <div className="mb-3 border border-[#30465d] p-5">
      <div className="flex gap-5">
        <div className="shrink-0 text-[9px] font-bold text-[#71899f]">
          {number}
        </div>

        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#e8edf2]">
            {title}
          </div>

          <div className="max-w-[700px] text-[11px] leading-[1.7] text-[#b5c3ce]">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataRow({ data, location, server }) {
  return (
    <tr className="border-t border-[#26374b]">
      <td className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#c7d2db]">
        {data}
      </td>

      <td className="px-5 py-4 text-[9px] uppercase tracking-[0.08em] text-[#b5c3ce]">
        {location}
      </td>

      <td
        className={`px-5 py-4 text-[9px] font-bold uppercase tracking-[0.08em] ${
          server === "NO" || server === "NO UNREDACTED FACE"
            ? "text-[#61e294]"
            : "text-[#c0ccd6]"
        }`}
      >
        {server}
      </td>
    </tr>
  );
}

function ComparisonBlock({ label, items, highlight = false }) {
  return (
    <div
      className={`border p-6 ${
        highlight
          ? "border-[#526f8c] bg-[#091827]"
          : "border-[#30465d] bg-[#081523]"
      }`}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div
          className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
            highlight ? "text-[#61e294]" : "text-[#a5b8c8]"
          }`}
        >
          {label}
        </div>

        {highlight && (
          <span className="h-2 w-2 rounded-full bg-[#61e294] shadow-[0_0_8px_rgba(97,226,148,0.5)]" />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-2">
            <span
              className={`border px-3 py-2 text-[8px] font-bold uppercase tracking-[0.1em] ${
                highlight
                  ? "border-[#30465d] text-[#c7d2db]"
                  : "border-[#26374b] text-[#a5b8c8]"
              }`}
            >
              {item}
            </span>

            {index !== items.length - 1 && (
              <span className="text-[10px] text-[#71899f]">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="border border-[#30465d] bg-[#081523] p-6">
      <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e8edf2]">
        {title}
      </div>

      <p className="text-[11px] leading-[1.8] text-[#b5c3ce]">
        {text}
      </p>
    </div>
  );
}

function SmallTag({ children }) {
  return (
    <span className="border border-[#30465d] px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-[#b5c3ce]">
      {children}
    </span>
  );
}