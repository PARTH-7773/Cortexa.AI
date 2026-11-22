import {
  ArrowUp,
  Bot,
  Calculator,
  Globe,
  LogOut,
  Mail,
  Plus,
  Send,
  Settings2,
  Sparkles,
  UserRound,
  Workflow,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "@/features/auth/hooks/useAuth";
import { setError, setUser } from "@/features/auth/authSlice";

const DEMO_AGENTS = [
  {
    id: "demo-1",
    name: "Research Assistant",
    role: "Web & synthesis",
    tools: ["Web Search", "Calculator"],
  },
  {
    id: "demo-2",
    name: "Inbox Triage",
    role: "Email drafting & summaries",
    tools: ["Read Gmail", "Send Emails"],
  },
  {
    id: "demo-3",
    name: "Workflow Planner",
    role: "Task & calculation helper",
    tools: ["Calculator", "Web Search"],
  },
];

const DEMO_STARTERS = [
  "Summarize my unread project updates and draft a quick reply",
  "Compare top tech stacks for a real-time dashboard",
  "Break down a weekly sprint plan with clear milestones",
];

const darkPanel =
  "border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl";

function ModernReveal({
  children,
  delay = 0,
  y = 22,
  scale = 0.98,
  blur = 8,
  className = "",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={className}
      style={{
        opacity: mounted ? 1 : 0,
        filter: mounted ? "blur(0px)" : `blur(${blur}px)`,
        transform: mounted
          ? "translate3d(0, 0, 0) scale(1)"
          : `translate3d(0, ${y}px, 0) scale(${scale})`,
        transition: `opacity 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}

function Home() {
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [selectedAgentId, setSelectedAgentId] = useState(DEMO_AGENTS[0].id);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "assistant",
      agentName: DEMO_AGENTS[0].name,
      text: "Demo mode active — pick a starter prompt or type anything below to preview how your agent workspace responds locally.",
    },
  ]);

  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false });

  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const lastScrollTopRef = useRef(0);
  const chatEndRef = useRef(null);
  const hasSentMessageRef = useRef(false);

  const activeAgent =
    DEMO_AGENTS.find((a) => a.id === selectedAgentId) || DEMO_AGENTS[0];

  const menuContent =
    "rounded-2xl border border-white/10 bg-[#1d2026]/95 p-1.5 text-zinc-100 shadow-2xl shadow-black/50 backdrop-blur-xl";

  const menuItem =
    "flex items-center gap-2.5 rounded-xl py-2.5 text-zinc-300 focus:bg-white/10 focus:text-white";

  const menuSeparator = "bg-white/10";
  const iconBtn =
    "size-9 rounded-xl border border-white/10 bg-white/[0.05] p-0 text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95";

  // Keep view at top on initial mount / reload
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    lastScrollTopRef.current = 0;
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const currentY = el.scrollTop;
        const prevY = lastScrollTopRef.current;
        const maxScroll = el.scrollHeight - el.clientHeight;

        setScrollY(currentY);
        setScrollProgress(
          maxScroll > 0 ? Math.min(currentY / maxScroll, 1) : 0,
        );

        if (currentY <= 24) {
          setHeaderHidden(false);
        } else if (currentY > prevY + 4 && currentY > 64) {
          setHeaderHidden(true);
        } else if (currentY < prevY - 4) {
          setHeaderHidden(false);
        }

        lastScrollTopRef.current = currentY;
        rafId = null;
      });
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Only scroll to latest message after the user sends a message
  useEffect(() => {
    if (!hasSentMessageRef.current) return;
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages.length]);

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  async function handleLogout() {
    try {
      const result = await logout();
      dispatch(setUser(result.user || null));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setUser(null));
    }
  }

  function sendDemoMessage(rawText) {
    const clean = rawText.trim();
    if (!clean) return;

    hasSentMessageRef.current = true;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: clean,
    };

    const demoReply = {
      id: `a-${Date.now() + 1}`,
      sender: "assistant",
      agentName: activeAgent.name,
      text: `[Demo preview via ${activeAgent.name}] Simulated response for "${clean}" using tools: ${activeAgent.tools.join(", ")}.`,
    };

    setMessages((prev) => [...prev, userMsg, demoReply]);
    setPrompt("");
  }

  function handleDemoSubmit(e) {
    e.preventDefault();
    sendDemoMessage(prompt);
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#2b2f3a_0%,#191b21_55%,#121317_100%)] text-white">
      <style>{`
        @keyframes msgPop {
          0% {
            opacity: 0;
            transform: translate3d(0, 12px, 0) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .animate-msg-pop {
          animation: msgPop 360ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {/* Top Scroll Progress Line */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/[0.06]">
        <div
          className="h-full origin-left bg-gradient-to-r from-zinc-400 via-white to-zinc-300 shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-transform duration-75 ease-out"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* Floating Ambient Orb */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-[-120px] h-[340px] w-[620px] -translate-x-1/2 animate-pulse rounded-full bg-white/[0.04] blur-3xl"
      />

      {/* Vignette Overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]"
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {/* Scroll-Aware Auto-Hide / Return Header with Staggered Item Arrival */}
        <header
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={`z-30 flex shrink-0 items-center justify-between transition-all duration-300 will-change-transform ${
            headerHidden
              ? "pointer-events-none -translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          } ${
            scrollY > 20
              ? "h-14 border-b border-white/[0.09] bg-[#16181d]/80 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6"
              : "h-16 border-b border-white/[0.06] bg-transparent px-4 sm:px-6"
          }`}
        >
          <div
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: headerHidden ? "0ms" : "40ms",
            }}
            className={`transition-all duration-500 will-change-transform ${
              headerHidden
                ? "-translate-y-2.5 opacity-0 blur-[2px]"
                : "translate-y-0 opacity-100 blur-0"
            }`}
          >
            <Link
              to={"/"}
              className="group flex items-center gap-2.5 rounded-xl py-1 pr-2 transition-colors"
            >
              <span className="relative grid size-8 place-items-center rounded-lg bg-white text-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.14)] transition-all duration-300 ease-out group-hover:-rotate-6 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(255,255,255,0.28)] active:scale-95">
                <Workflow
                  size={17}
                  className="transition-transform duration-300 group-hover:rotate-12"
                />
              </span>
              <span className="text-sm font-medium tracking-tight text-zinc-100 transition-colors duration-200 group-hover:text-white">
                Automation AI
              </span>
            </Link>
          </div>

          <div
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: headerHidden ? "0ms" : "110ms",
            }}
            className={`flex items-center gap-2 transition-all duration-500 will-change-transform ${
              headerHidden
                ? "-translate-y-2.5 opacity-0 blur-[2px]"
                : "translate-y-0 opacity-100 blur-0"
            }`}
          >
            <Link
              to={"/agent/new"}
              className="group hidden items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-zinc-200 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95 sm:inline-flex"
            >
              <Plus
                size={14}
                className="transition-transform duration-200 group-hover:rotate-90"
              />
              <span>New Agent</span>
            </Link>

            {/* Workflows & Agents Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Open workflows menu"
                    className={iconBtn}
                  />
                }
              >
                <Workflow size={17} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={`w-56 ${menuContent}`}
              >
                <DropdownMenuItem
                  className={menuItem}
                  render={<Link to={"/agents"} />}
                >
                  <Bot strokeWidth={3} className="size-4" />
                  <span>My Agent</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={menuSeparator} />

                <DropdownMenuItem
                  className={menuItem}
                  render={<Link to={"/agent/new"} />}
                >
                  <Plus strokeWidth={3} className="size-4" />
                  <span>Create New Agent</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={menuItem}
                  render={<Link to={"/integration"} />}
                >
                  <Settings2 className="size-4" strokeWidth={2.5} />
                  <span>Integration</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Open profile menu"
                    className="flex size-9 w-fit items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-0 text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95"
                  />
                }
              >
                {user && user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user?.name || "Profile"}
                    referrerPolicy="no-referrer"
                    className="size-full rounded-xl object-cover"
                  />
                ) : (
                  <UserRound
                    size={17}
                    strokeWidth={2.8}
                    className="size-4.5 text-zinc-300"
                  />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={`w-64 ${menuContent}`}
              >
                <div className="flex items-center gap-3 px-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {user?.name || "Demo User"}
                    </p>
                    <p className="truncate text-sm text-zinc-400">
                      {user?.email || "demo@automation.ai"}
                    </p>
                  </div>
                </div>

                <DropdownMenuSeparator className={menuSeparator} />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2.5 rounded-xl py-2.5 text-base font-medium text-red-400 transition focus:bg-red-500/10 focus:text-red-400"
                >
                  <LogOut strokeWidth={3} className="size-5" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Demo Home Content */}
        <main
          ref={mainRef}
          className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col justify-between gap-5 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8"
        >
          <div className="space-y-6">
            {/* Hero & Active Demo Agent Banner with Cursor Spotlight */}
            <ModernReveal delay={40} y={18} blur={6}>
              <section
                ref={heroRef}
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={() =>
                  setSpotlight((prev) => ({ ...prev, active: false }))
                }
                className={`relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl p-5 sm:flex-row sm:items-center sm:p-6 ${darkPanel}`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-500"
                  style={{
                    opacity: spotlight.active ? 1 : 0,
                    background: `radial-gradient(420px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,255,255,0.08), transparent 65%)`,
                  }}
                />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                    <Sparkles size={12} className="text-white" />
                    <span>Local Demo Workspace</span>
                  </div>
                  <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                    What can we automate today?
                  </h1>
                  <p className="mt-1.5 text-sm text-zinc-400">
                    Select a sample agent below and test prompts locally without
                    any API calls.
                  </p>
                </div>

                <div className="relative z-10 shrink-0 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 transition-all duration-300">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                    Active Agent
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white">
                    {activeAgent.name}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {activeAgent.role}
                  </p>
                </div>
              </section>
            </ModernReveal>

            {/* Sample Agent Switcher Cards */}
            <ModernReveal delay={110} y={20} blur={6}>
              <section className="grid gap-3 sm:grid-cols-3">
                {DEMO_AGENTS.map((agent) => {
                  const isSelected = agent.id === selectedAgentId;
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => setSelectedAgentId(agent.id)}
                      className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.985] ${
                        isSelected
                          ? "border-white/25 bg-white/[0.1] shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-x-4 top-0 h-[2px] rounded-full bg-white transition-all duration-300 ${
                          isSelected
                            ? "scale-x-100 opacity-100"
                            : "scale-x-0 opacity-0"
                        }`}
                      />

                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`grid size-8 place-items-center rounded-xl transition-all duration-200 ${
                            isSelected
                              ? "scale-105 bg-white text-zinc-950"
                              : "bg-white/10 text-white group-hover:scale-105"
                          }`}
                        >
                          <Bot size={16} />
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {agent.tools.length} tools
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium text-white">
                        {agent.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">{agent.role}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {agent.tools.map((tool) => (
                          <span
                            key={tool}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/20 px-2 py-0.5 text-[11px] text-zinc-300"
                          >
                            {tool.includes("Search") && <Globe size={11} />}
                            {tool.includes("Calculator") && (
                              <Calculator size={11} />
                            )}
                            {tool.includes("Gmail") && <Mail size={11} />}
                            <span>{tool}</span>
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </section>
            </ModernReveal>

            {/* Starter Prompts */}
            <ModernReveal delay={170} y={18} blur={4}>
              <section className="space-y-2">
                <p className="text-xs font-medium text-zinc-400">
                  Try a starter prompt
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {DEMO_STARTERS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => sendDemoMessage(item)}
                      className="group flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-left text-xs text-zinc-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white active:scale-[0.985]"
                    >
                      <span className="line-clamp-2">{item}</span>
                      <ArrowUp
                        size={14}
                        className="shrink-0 rotate-45 text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                      />
                    </button>
                  ))}
                </div>
              </section>
            </ModernReveal>

            {/* Local Demo Conversation Feed */}
            <ModernReveal delay={220} y={18} blur={4}>
              <section className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:p-5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`animate-msg-pop flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed sm:text-sm ${
                        msg.sender === "user"
                          ? "bg-white font-medium text-zinc-950 shadow-[0_6px_24px_rgba(255,255,255,0.14)]"
                          : "border border-white/10 bg-white/[0.06] text-zinc-200"
                      }`}
                    >
                      {msg.sender === "assistant" && (
                        <p className="mb-1 text-[11px] font-medium text-zinc-400">
                          {msg.agentName}
                        </p>
                      )}
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </section>
            </ModernReveal>
          </div>

          {/* Local Demo Prompt Bar */}
          <form
            onSubmit={handleDemoSubmit}
            className="group/bar sticky bottom-0 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#181a20]/90 p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 focus-within:border-white/25 focus-within:shadow-[0_0_28px_rgba(255,255,255,0.06)]"
          >
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Message ${activeAgent.name} (demo only)...`}
              className="h-10 flex-1 border-0 bg-transparent text-sm text-white placeholder:text-zinc-500 focus-visible:ring-0"
            />
            <Button
              type="submit"
              className="group/send h-10 rounded-xl bg-white px-4 text-xs font-semibold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 active:scale-[0.97]"
            >
              <Send
                size={14}
                className="mr-1.5 transition-transform duration-200 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5"
              />
              <span>Send</span>
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Home;
