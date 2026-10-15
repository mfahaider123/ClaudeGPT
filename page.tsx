"use client";

import { useMemo, useState } from "react";
import { ArrowUp, Bot, Check, ChevronDown, CircleHelp, Copy, ExternalLink, Github, Menu, MessageSquareText, Moon, Plus, Sparkles, Sun, Users, X } from "lucide-react";

type Message = { role: "chatgpt" | "claude" | "final"; title: string; body: string };

const examples = [
  { icon: "✦", title: "Explore an idea", prompt: "Explain a big idea in a simple, memorable way." },
  { icon: "⌘", title: "Solve a problem", prompt: "Help me solve a problem by comparing different approaches." },
  { icon: "↗", title: "Make a plan", prompt: "Create a practical step-by-step plan for a goal." },
  { icon: "✎", title: "Write something", prompt: "Help me write something clear, engaging, and original." },
];

function createDemo(topic: string): Message[] {
  const clean = topic.trim();
  return [
    {
      role: "chatgpt",
      title: "ChatGPT · First perspective",
      body: `Let's break down “${clean}” into the core question, the useful context, and the outcome we're aiming for. A strong answer should be clear, practical, and specific rather than trying to cover everything at once. I'd start by identifying the main goal, then organize the response into steps or key points.`,
    },
    {
      role: "claude",
      title: "Claude · Challenge & refine",
      body: `I'd challenge one assumption: a response can sound organized without actually solving the user's problem. We should make the advice concrete, mention important trade-offs, and avoid presenting uncertain details as facts. The best approach is to keep the explanation focused while giving the user a clear next action.`,
    },
    {
      role: "chatgpt",
      title: "ChatGPT · Rebuttal",
      body: `Agreed on being concrete. I'd add a quick way to evaluate whether the approach is working: define what success looks like, test the first step, and adjust based on the result. That keeps the answer useful in the real world, not just persuasive on paper.`,
    },
    {
      role: "final",
      title: "ClaudeGPT · Combined answer",
      body: `For “${clean}”, use a focused, practical approach:\n\n1. **Define the goal.** Be clear about what a good result looks like.\n2. **Choose the simplest useful path.** Break it into small, actionable steps.\n3. **Check assumptions.** Look for missing context, trade-offs, and anything that needs verification.\n4. **Test and improve.** Try the first step, review the result, and adapt.\n\n**Bottom line:** aim for an answer that is clear enough to act on, careful enough to trust, and flexible enough to improve. This is a demonstration of the ClaudeGPT workflow; no live AI models are connected in this prototype.`,
    },
  ];
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [dark, setDark] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatgptUrl, setChatgptUrl] = useState("https://chatgpt.com/");
  const [claudeUrl, setClaudeUrl] = useState("https://claude.ai/");
  const [copied, setCopied] = useState(false);
  const [rounds, setRounds] = useState("2");

  const ready = topic.trim().length > 0;
  const countLabel = useMemo(() => messages.length ? `${messages.length} demo messages` : "Ready when you are", [messages.length]);

  function collaborate(value = topic) {
    if (!value.trim() || busy) return;
    setTopic(value);
    setBusy(true);
    setMessages([]);
    const demo = createDemo(value);
    demo.forEach((message, i) => {
      window.setTimeout(() => {
        setMessages((prev) => [...prev, message]);
        if (i === demo.length - 1) setBusy(false);
      }, 550 * (i + 1));
    });
  }

  async function copyAnswer() {
    const final = [...messages].reverse().find((m) => m.role === "final");
    if (!final) return;
    try {
      await navigator.clipboard.writeText(final.body);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className={dark ? "app dark" : "app"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={19} strokeWidth={2.3} /></div>
          <span>ClaudeGPT</span>
        </div>
        <button className="new-chat" onClick={() => { setMessages([]); setTopic(""); }}><Plus size={17} /> New collaboration</button>
        <div className="side-label">WORKSPACE</div>
        <button className="side-item active"><MessageSquareText size={17} /> AI collaboration</button>
        <button className="side-item" onClick={() => setShowSettings(true)}><Users size={17} /> Connect AI links</button>
        <div className="sidebar-bottom">
          <div className="prototype-note"><span className="status-dot" /><div><strong>Free prototype</strong><small>Simulated teamwork</small></div></div>
          <button className="side-item" onClick={() => setShowSettings(true)}><CircleHelp size={17} /> How it works</button>
          <button className="side-item" onClick={() => setDark(!dark)}>{dark ? <Sun size={17} /> : <Moon size={17} />} {dark ? "Light appearance" : "Dark appearance"}</button>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Menu"><Menu size={19} /></button>
          <div className="model-select">ClaudeGPT <ChevronDown size={15} /></div>
          <div className="top-actions"><span className="demo-pill"><span className="status-dot" /> Demo mode</span><button className="icon-button" aria-label="Settings" onClick={() => setShowSettings(true)}><ExternalLink size={17} /></button></div>
        </header>

        <div className="content">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="hero-icon"><Sparkles size={25} /></div>
              <h1>Two perspectives.<br /><span>One better answer.</span></h1>
              <p className="subtitle">ClaudeGPT brings different ways of thinking together to help you explore ideas, solve problems, and get things done.</p>
              <div className="example-grid">
                {examples.map((item) => (
                  <button key={item.title} className="example-card" onClick={() => setTopic(item.prompt)}>
                    <span className="example-icon">{item.icon}</span><span className="example-title">{item.title}</span><span className="example-prompt">{item.prompt}</span>
                  </button>
                ))}
              </div>
              <div className="composer-wrap">
                <textarea value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); collaborate(); } }} placeholder="Ask ClaudeGPT anything..." rows={3} />
                <div className="composer-footer"><span className="composer-hint">Any topic · Shift + Enter for a new line</span><button className="send-button" disabled={!ready || busy} onClick={() => collaborate()} aria-label="Start collaboration"><ArrowUp size={19} /></button></div>
              </div>
              <div className="below-composer">A free prototype with simulated AI teamwork. Live model APIs are not connected yet.</div>
            </div>
          ) : (
            <div className="conversation">
              <div className="user-question"><div className="user-avatar">Y</div><div><span className="small-label">YOUR QUESTION</span><p>{topic}</p></div></div>
              <div className="collab-heading"><div className="hero-icon small"><Users size={19} /></div><div><h2>Working it through</h2><p>{busy ? "The perspectives are coming together…" : countLabel}</p></div></div>
              <div className="timeline">
                {messages.map((message, i) => (
                  <article key={`${message.role}-${i}`} className={`message ${message.role === "final" ? "final-message" : ""}`}>
                    <div className={`message-avatar ${message.role}`}>{message.role === "chatgpt" ? <Bot size={18} /> : message.role === "claude" ? <span>✳</span> : <Sparkles size={18} />}</div>
                    <div className="message-main"><div className="message-title">{message.title}{message.role === "final" && <span className="final-tag">FINAL</span>}</div><div className="message-body">{message.body.split("\n").map((line, idx) => <p key={idx}>{line || "\u00a0"}</p>)}</div>{message.role === "final" && <button className="copy-button" onClick={copyAnswer}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy answer"}</button>}</div>
                  </article>
                ))}
                {busy && <div className="typing"><span /><span /><span /> <small>ClaudeGPT is thinking…</small></div>}
              </div>
              {!busy && <div className="followup"><textarea value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); collaborate(); } }} placeholder="Ask a follow-up..." rows={2} /><button className="send-button" disabled={!ready || busy} onClick={() => collaborate()}><ArrowUp size={18} /></button></div>}
              <button className="start-over" onClick={() => { setMessages([]); setTopic(""); }}> <Plus size={15} /> Start a new collaboration</button>
            </div>
          )}
        </div>
        <footer className="footer"><span>ClaudeGPT</span><span>Independent prototype · Not affiliated with Anthropic or OpenAI</span></footer>
      </section>

      {showSettings && <div className="modal-backdrop" onClick={() => setShowSettings(false)}><section className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><div><div className="modal-icon"><Users size={19} /></div><h2>Connect your AI links</h2><p>Save the official websites for quick access.</p></div><button className="icon-button" onClick={() => setShowSettings(false)} aria-label="Close"><X size={18} /></button></div>
        <label>ChatGPT website link<input type="url" value={chatgptUrl} onChange={(e) => setChatgptUrl(e.target.value)} placeholder="https://chatgpt.com/" /></label>
        <label>Claude website link<input type="url" value={claudeUrl} onChange={(e) => setClaudeUrl(e.target.value)} placeholder="https://claude.ai/" /></label>
        <div className="link-actions"><a href={chatgptUrl} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Open ChatGPT</a><a href={claudeUrl} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Open Claude</a></div>
        <div className="notice"><CircleHelp size={17} /><p><strong>Important:</strong> Website links only open each service. They cannot make the two AIs automatically exchange messages. Real collaboration requires connecting their APIs with secure server-side keys.</p></div>
        <button className="primary-button" onClick={() => setShowSettings(false)}>Done</button>
      </section></div>}
    </main>
  );
}