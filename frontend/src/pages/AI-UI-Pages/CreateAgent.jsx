import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Bot,
  Check,
  Plus,
  Sparkles,
  Workflow,
  Loader2,
} from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import useAgent from "@/features/agent/hooks/useAgent";

const availableTools = [
  {
    id: "calculator",
    name: "Calculator",
    description: "Perform mathematical calculations",
  },
  {
    id: "web.search",
    name: "Web Search",
    description: "Search for the information on the web",
  },
  {
    id: "gmail.read",
    name: "Read Gmail",
    description: "Read and summarize emails",
  },
  {
    id: "gmail.send",
    name: "Send Emails",
    description: "Draft and send emails",
  },
];

const darkPanel =
  "border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl";

const fieldCls =
  "rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white backdrop-blur-xl transition-all duration-300 placeholder:text-zinc-500 hover:border-white/20 hover:bg-white/[0.05] focus-visible:border-white/35 focus-visible:bg-white/[0.06] focus-visible:shadow-[0_0_20px_rgba(255,255,255,0.06)] focus-visible:ring-0";

function ModernReveal({
  children,
  delay = 0,
  y = 24,
  scale = 0.97,
  blur = 8,
  className = "",
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -20px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        filter: inView ? "blur(0px)" : `blur(${blur}px)`,
        transform: inView
          ? "translate3d(0, 0, 0) scale(1)"
          : `translate3d(0, ${y}px, 0) scale(${scale})`,
        transition: `opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}

function CreateAgent() {
  const [name, setName] = useState("");
  const [instructions, setInstruction] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [tools, setTools] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [shakeError, setShakeError] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const submitBtnRef = useRef(null);
  const shakeTimerRef = useRef(null);
  const redirectTimerRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  const authError = useSelector((state) => state.auth?.error);
  const navigate = useNavigate();
  const { createAgent } = useAgent();

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
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

  const triggerShake = () => {
    setShakeError(false);
    requestAnimationFrame(() => {
      setShakeError(true);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => {
        setShakeError(false);
      }, 450);
    });
  };

  const handleFormMouseMove = (e) => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMagnetMove = (e) => {
    if (!submitBtnRef.current || submitting || createdSuccess) return;
    const rect = submitBtnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const pullX = Math.max(-8, Math.min(8, (e.clientX - centerX) * 0.25));
    const pullY = Math.max(-6, Math.min(6, (e.clientY - centerY) * 0.25));
    setMagnetOffset({ x: pullX, y: pullY });
  };

  const handleMagnetLeave = () => {
    setMagnetOffset({ x: 0, y: 0 });
  };

  const toggleTool = (tool) => {
    setTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || createdSuccess) return;

    setSubmitError("");
    setShakeError(false);
    setSubmitting(true);
    setMagnetOffset({ x: 0, y: 0 });

    try {
      const payload = {
        name: name.trim(),
        instructions: instructions.trim(),
        knowledgeBase: knowledgeBase.trim(),
        tools,
      };

      const result = await createAgent(payload);

      const createdAgentName =
        result?.agent?.name || result?.name || payload.name || "New Agent";

      setSubmitting(false);
      setCreatedSuccess(true);

      redirectTimerRef.current = setTimeout(() => {
        navigate("/", {
          replace: true,
          state: {
            toast: {
              id: Date.now(),
              type: "success",
              title: "Agent created",
              description: `"${createdAgentName}" has been added to your workspace.`,
            },
          },
        });
      }, 650);
    } catch (err) {
      setSubmitting(false);
      setSubmitError(
        err?.response?.data?.message || err?.message || "Something went wrong",
      );
      triggerShake();
    }
  };

  const displayError = submitError || authError;
  const heroTranslateY = Math.min(scrollY * 0.25, 60);
  const heroOpacity = Math.max(1 - scrollY / 320, 0.15);

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-auto bg-[#121317] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#2b2f3a_0%,#191b21_55%,#121317_100%)] text-white"
    >
      <style>{`
        @keyframes agentShake {
          0%, 100% { transform: translate3d(0, 0, 0); }
          20% { transform: translate3d(-8px, 0, 0); }
          40% { transform: translate3d(8px, 0, 0); }
          60% { transform: translate3d(-5px, 0, 0); }
          80% { transform: translate3d(5px, 0, 0); }
        }
        .animate-agent-shake {
          animation: agentShake 420ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
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

      {/* Fixed Vignette Overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]"
      />

      <div className="relative z-10">
        {/* Scroll-Aware Auto-Hide / Return Glass Header */}
        <header
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={`sticky top-0 z-30 flex shrink-0 items-center justify-between transition-all duration-300 will-change-transform ${
            headerHidden
              ? "pointer-events-none -translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          } ${
            scrollY > 20
              ? "h-14 border-b border-white/[0.09] bg-[#16181d]/80 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6"
              : "h-16 bg-transparent px-4 sm:px-6"
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
            className={`transition-all duration-500 will-change-transform ${
              headerHidden
                ? "-translate-y-2.5 opacity-0 blur-[2px]"
                : "translate-y-0 opacity-100 blur-0"
            }`}
          >
            <Link
              to={"/"}
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/[0.1] hover:text-white active:scale-95"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-200 ease-out group-hover:-translate-x-1"
              />
              <span>Back to chat</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          {/* Scroll-Scrubbed Parallax Hero */}
          <div
            style={{
              transform: `translate3d(0, ${heroTranslateY}px, 0)`,
              opacity: heroOpacity,
              willChange: "transform, opacity",
            }}
          >
            <ModernReveal delay={40} y={18} blur={6} className="mb-9">
              {/* Breathing Bot Badge */}
              <div className="relative mb-5 inline-flex">
                <span
                  aria-hidden
                  className="absolute -inset-1.5 animate-ping rounded-2xl bg-white/10 [animation-duration:3.5s]"
                />
                <div className="relative grid size-12 place-items-center rounded-2xl bg-white text-zinc-900 shadow-[0_10px_40px_rgba(255,255,255,0.18)]">
                  <Bot size={24} />
                </div>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Create an agent
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Configure your AI agent and define what it can do.
              </p>
            </ModernReveal>
          </div>

          {/* Main Glass Form Card */}
          <ModernReveal delay={120} y={28} scale={0.98} blur={10}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              onMouseMove={handleFormMouseMove}
              onMouseLeave={() =>
                setMousePos((prev) => ({ ...prev, active: false }))
              }
              className={`relative z-20 space-y-7 overflow-hidden rounded-3xl p-5 sm:p-7 ${darkPanel}`}
            >
              {/* Interactive Cursor Spotlight */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-500"
                style={{
                  opacity: mousePos.active ? 1 : 0,
                  background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.07), transparent 65%)`,
                }}
              />

              {/* Form Fields with Focus Glow & Live Character Counter */}
              <section className="relative space-y-5">
                <ModernReveal delay={160} y={16} blur={4}>
                  <div className="group/field">
                    <label
                      htmlFor="agent-name"
                      className="mb-2 block text-xs font-medium text-zinc-400 transition-colors duration-200 group-focus-within/field:text-white"
                    >
                      Agent name
                    </label>
                    <Input
                      id="agent-name"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      placeholder="e.g. Research Assistant"
                      maxLength={100}
                      required
                      className={`h-11 ${fieldCls}`}
                    />
                  </div>
                </ModernReveal>

                <ModernReveal delay={220} y={16} blur={4}>
                  <div className="group/field">
                    <label
                      htmlFor="agent-instructions"
                      className="mb-2 block text-xs font-medium text-zinc-400 transition-colors duration-200 group-focus-within/field:text-white"
                    >
                      Instructions
                    </label>
                    <Input
                      id="agent-instructions"
                      onChange={(e) => setInstruction(e.target.value)}
                      value={instructions}
                      placeholder="Instructions"
                      maxLength={100}
                      required
                      className={`h-11 ${fieldCls}`}
                    />
                  </div>
                </ModernReveal>

                <ModernReveal delay={280} y={16} blur={4}>
                  <div className="group/field">
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="knowledgeBase"
                        className="block text-xs font-medium text-zinc-400 transition-colors duration-200 group-focus-within/field:text-white"
                      >
                        Knowledge Base
                      </label>
                      <span className="text-[11px] tabular-nums text-zinc-500 transition-colors group-focus-within/field:text-zinc-300">
                        {knowledgeBase.length} chars
                      </span>
                    </div>
                    <Textarea
                      id="knowledgeBase"
                      onChange={(e) => setKnowledgeBase(e.target.value)}
                      value={knowledgeBase}
                      placeholder="You are helpful AI assistant. Your job is to...."
                      required
                      className={`min-h-40 resize-y leading-6 ${fieldCls}`}
                    />
                  </div>
                </ModernReveal>
              </section>

              {/* Animated Tool Selection & Single-Line Live Counter Pill */}
              <ModernReveal delay={100} y={20} blur={6}>
                <section className="relative">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xs font-medium text-zinc-300">
                        Tools
                      </h2>
                      <p className="mt-1 text-xs text-zinc-500">
                        Select the capabilities available to your agent
                      </p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-300 ${
                        tools.length > 0
                          ? "scale-100 border-white/20 bg-white/10 text-white opacity-100"
                          : "scale-95 border-white/5 bg-white/[0.02] text-zinc-500 opacity-70"
                      }`}
                    >
                      <Sparkles
                        size={11}
                        className={`shrink-0 ${
                          tools.length > 0 ? "text-white" : "text-zinc-600"
                        }`}
                      />
                      <span>{tools.length} selected</span>
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    {availableTools.map((tool, index) => {
                      const selected = tools?.includes(tool.id);
                      return (
                        <ModernReveal
                          key={tool.id}
                          delay={index * 65}
                          y={14}
                          blur={4}
                        >
                          <button
                            type="button"
                            onClick={() => toggleTool(tool.id)}
                            className={`group/tool relative flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-all duration-200 active:scale-[0.995] ${
                              index !== 0 ? "border-t border-white/[0.08]" : ""
                            } ${
                              selected
                                ? "bg-white/[0.09]"
                                : "bg-white/[0.02] hover:bg-white/[0.05]"
                            }`}
                          >
                            <span
                              aria-hidden
                              className={`absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-white transition-all duration-300 ${
                                selected
                                  ? "scale-y-100 opacity-100"
                                  : "scale-y-0 opacity-0"
                              }`}
                            />

                            <div className="transition-transform duration-200 group-hover/tool:translate-x-0.5">
                              <p
                                className={`text-xs font-medium transition-colors ${
                                  selected ? "text-white" : "text-zinc-200"
                                }`}
                              >
                                {tool.name}
                              </p>
                              <p className="mt-1 text-[11px] text-zinc-500">
                                {tool.description}
                              </p>
                            </div>

                            <span
                              className={`flex size-[18px] shrink-0 items-center justify-center rounded-md border transition-all duration-300 ${
                                selected
                                  ? "scale-110 border-white bg-white text-zinc-900 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                                  : "border-white/20 text-transparent group-hover/tool:border-white/40"
                              }`}
                            >
                              <Check
                                size={13}
                                strokeWidth={3}
                                className={`transition-transform duration-200 ${
                                  selected ? "scale-100" : "scale-0"
                                }`}
                              />
                            </span>
                          </button>
                        </ModernReveal>
                      );
                    })}
                  </div>
                </section>
              </ModernReveal>

              {displayError && (
                <p
                  role="alert"
                  className={`rounded-lg border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-xs text-red-300 ${
                    shakeError ? "animate-agent-shake" : ""
                  }`}
                >
                  {displayError}
                </p>
              )}

              {/* Tactile justify-between Action Bar */}
              <ModernReveal delay={120} y={16} blur={4}>
                <div className="relative flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={submitting || createdSuccess}
                    onClick={() => navigate("/")}
                    className="group h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 text-xs font-medium text-zinc-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 active:scale-[0.98] sm:w-auto"
                  >
                    <RxCross2 className="mr-1.5 size-3.5 text-zinc-500 transition-transform duration-200 group-hover:rotate-90 group-hover:text-red-300" />
                    Cancel
                  </Button>

                  <Button
                    ref={submitBtnRef}
                    type="submit"
                    disabled={submitting || createdSuccess}
                    onMouseMove={handleMagnetMove}
                    onMouseLeave={handleMagnetLeave}
                    style={{
                      transform: `translate3d(${magnetOffset.x}px, ${magnetOffset.y}px, 0)`,
                      transition:
                        magnetOffset.x === 0 && magnetOffset.y === 0
                          ? "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), background-color 250ms, box-shadow 250ms"
                          : "transform 90ms ease-out, background-color 250ms, box-shadow 250ms",
                    }}
                    className={`group relative h-11 w-full overflow-hidden rounded-xl px-6 text-xs font-semibold sm:w-auto ${
                      createdSuccess
                        ? "scale-105 bg-emerald-400 text-zinc-950 shadow-[0_0_32px_rgba(52,211,153,0.45)]"
                        : "bg-white text-zinc-950 shadow-[0_0_25px_rgba(255,255,255,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-200 hover:bg-zinc-100 hover:shadow-[0_0_32px_rgba(255,255,255,0.28)] active:scale-[0.98]"
                    }`}
                  >
                    {!createdSuccess && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent transition-transform duration-500 group-hover:translate-x-full"
                      />
                    )}

                    {createdSuccess ? (
                      <>
                        <Check
                          className="mr-1.5 size-4 scale-110 transition-transform duration-300"
                          strokeWidth={3}
                        />
                        <span>Agent Created</span>
                      </>
                    ) : submitting ? (
                      <>
                        <Loader2
                          className="mr-1.5 size-4 animate-spin"
                          strokeWidth={2.5}
                        />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus
                          className="mr-1.5 size-4 transition-transform duration-200 group-hover:rotate-90"
                          strokeWidth={2.5}
                        />
                        <span>Create Agent</span>
                      </>
                    )}
                  </Button>
                </div>
              </ModernReveal>
            </form>
          </ModernReveal>
        </main>
      </div>
    </div>
  );
}

export default CreateAgent;
