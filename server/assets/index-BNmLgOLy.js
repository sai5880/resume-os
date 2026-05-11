import { V as jsxRuntimeExports } from "./server-vmEPNGJQ.js";
import { L as Link } from "./router-BvjE7Hmm.js";
import { m as motion } from "./proxy-B-Od97nL.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto max-w-6xl px-6 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono-display text-base", children: [
        "ResumeOS",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ai", children: "." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-5 text-[12px] font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/features", className: "text-ink-soft hover:text-ink", children: "Features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "text-ink-soft hover:text-ink", children: "Privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/editor", className: "rounded-md bg-ink text-paper px-3 py-1.5 hover:opacity-90 transition", children: "Open editor →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-6xl px-6 pt-16 pb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 16
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.7
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-rule bg-card px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-ai animate-shimmer-ai" }),
          "Local · WebGPU · v0.1"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 font-mono-display text-[clamp(40px,7vw,84px)] leading-[1.02] font-semibold tracking-[-0.04em]", children: [
          "Your AI Career",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative", children: [
            "Operating System",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ai", children: "." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-[15px] leading-relaxed text-ink-soft", children: "Section-level AI rewriting, recruiter-grade ATS scoring, and true text-layer PDFs. Runs entirely in your browser via WebGPU — your resume never leaves your device." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/editor", className: "rounded-md bg-ink text-paper px-5 py-3 text-[13px] font-mono hover:opacity-90 transition", children: "Open the editor →" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/features", className: "rounded-md border border-ink/20 px-5 py-3 text-[13px] font-mono hover:border-ink transition", children: "How it works" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 24
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.2,
        duration: 0.8
      }, className: "relative mt-16 rounded-2xl border border-rule bg-card p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-7 rounded-xl border border-rule p-4 bg-paper", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ai mb-2", children: "AI streaming" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[13px] leading-snug", children: [
            "Architected a streaming inference pipeline cutting ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-ai/15 text-ai", children: "p95 latency from 1.4s → 280ms" }),
            " across 40M monthly requests; led migration ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-through opacity-40", children: "that took some time" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-ai/15 text-ai", children: "reducing deploy time 8×" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ai-caret" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-rule p-4 bg-paper", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-mono text-ink-soft", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ATS SCORE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ai", children: "+18" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono-display text-4xl mt-1", children: [
              "87",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base text-ink-soft", children: "/100" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-1 rounded-full bg-rule overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-ink w-[87%]" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-rule p-4 bg-paper", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-ink-soft", children: "Model" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[13px] mt-1", children: "Gemma 2 · 9B (Pro)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-ink-soft mt-0.5", children: "WebGPU · 6.5GB · cached locally" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-rule", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-6 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-4 gap-8 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono-display text-base mb-4", children: [
            "ResumeOS",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ai", children: "." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-ink-soft leading-relaxed", children: "Local-first AI resume builder for the modern professional." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-[12px] uppercase tracking-[0.18em] text-ink-soft mb-3", children: "Product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-[12px] text-ink-soft", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/features", className: "hover:text-ink transition", children: "Features" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/editor", className: "hover:text-ink transition", children: "Editor" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "hover:text-ink transition", children: "Privacy" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-[12px] uppercase tracking-[0.18em] text-ink-soft mb-3", children: "Resources" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-[12px] text-ink-soft", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com", target: "_blank", rel: "noopener noreferrer", className: "hover:text-ink transition", children: "GitHub" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://docs.example.com", target: "_blank", rel: "noopener noreferrer", className: "hover:text-ink transition", children: "Documentation" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:support@resumeos.com", className: "hover:text-ink transition", children: "Support" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-rule pt-6 flex justify-between text-[10px] font-mono text-ink-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ResumeOS · Local-first AI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "© 2024 ResumeOS. Made for engineers, students & researchers" })
      ] })
    ] }) })
  ] });
}
export {
  Index as component
};
