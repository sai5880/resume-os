import { V as jsxRuntimeExports } from "./server-vmEPNGJQ.js";
import { L as Link } from "./router-BvjE7Hmm.js";
import { m as motion } from "./proxy-B-Od97nL.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function Privacy() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto max-w-6xl px-6 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "font-mono-display text-base", children: [
        "ResumeOS",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ai", children: "." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-5 text-[12px] font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/features", className: "text-ink-soft hover:text-ink", children: "Features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "text-ink-soft hover:text-ink", children: "Privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/editor", className: "rounded-md bg-ink text-paper px-3 py-1.5 hover:opacity-90 transition", children: "Open editor →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative mx-auto max-w-6xl px-6 pt-16 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
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
        "Privacy First"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 font-mono-display text-[clamp(40px,7vw,84px)] leading-[1.02] font-semibold tracking-[-0.04em]", children: [
        "Your data stays",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative", children: [
          "on your device",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ai", children: "." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-[15px] leading-relaxed text-ink-soft", children: "Unlike other resume builders that upload your data to the cloud, ResumeOS runs entirely in your browser. Your resume content never leaves your device." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-6xl px-6 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-8", children: [{
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }),
      title: "Local Processing",
      description: "All AI inference happens in your browser using WebGPU. No data is sent to external servers.",
      details: "We use advanced WebGPU technology to run AI models directly on your device, ensuring complete data privacy."
    }, {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" }) }),
      title: "Local Storage",
      description: "Your resume data is stored locally in your browser. You control your data completely.",
      details: "Use browser developer tools to export, backup, or delete your resume data anytime."
    }, {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
      title: "No Tracking",
      description: "We don't track your usage, collect analytics, or share data with third parties.",
      details: "ResumeOS is built with privacy in mind. No cookies, no analytics, no data collection."
    }, {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
      title: "Open Source",
      description: "Our code is open source, allowing anyone to verify our privacy claims.",
      details: "Transparent development means you can inspect exactly how ResumeOS handles your data."
    }].map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 24
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: index * 0.1,
      duration: 0.6
    }, className: "rounded-xl border border-rule bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-ink mb-3", children: item.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono-display text-lg mb-2", children: item.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-ink-soft leading-relaxed mb-3", children: item.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-ink-soft/70 leading-relaxed", children: item.details })
    ] }, item.title)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-6xl px-6 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-rule bg-card p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-mono-display text-2xl mb-6", children: "Technical Implementation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-[14px] uppercase tracking-[0.18em] text-ink-soft mb-3", children: "AI Processing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-[13px] text-ink-soft", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• WebGPU inference in dedicated Web Worker" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Model weights cached locally after first load" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• No internet connection required for AI features" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Zero data transmission to external services" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-[14px] uppercase tracking-[0.18em] text-ink-soft mb-3", children: "Data Storage" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-[13px] text-ink-soft", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Browser Local Storage for resume data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• IndexedDB for larger files and cache" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• No cloud backup or synchronization" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Export functionality for manual backups" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-6xl px-6 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-rule bg-card p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-mono-display text-2xl mb-4", children: "Experience true privacy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] text-ink-soft mb-6 max-w-md mx-auto", children: "Start using ResumeOS today and keep your career data completely private." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/editor", className: "rounded-md bg-ink text-paper px-6 py-3 text-[13px] font-mono hover:opacity-90 transition inline-block", children: "Start editing privately →" })
    ] }) }),
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
  Privacy as component
};
