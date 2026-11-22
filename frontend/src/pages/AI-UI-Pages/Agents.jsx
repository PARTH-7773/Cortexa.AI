import {
  ArrowLeft,
  Bot,
  Calculator,
  Eye,
  Globe,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash,
  Workflow,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AgentDetailsModal from "@/components/AgentDetailsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { removeAgent, setAgents } from "@/features/agent/agentSlice";
import useAgent from "@/features/agent/hooks/useAgent";

const darkPanel =
  "border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl";

const TOOL_META = [
  { id: "all", label: "All Tools" },
  { id: "calculator", label: "Calculator" },
  { id: "web.search", label: "Web Search" },
  { id: "gmail.read", label: "Read Gmail" },
  { id: "gmail.send", label: "Send Emails" },
];

function getAgentId(agent) {
  return agent?._id || agent?.id || "";
}

function formatToolLabel(tool) {
  const name = typeof tool === "string" ? tool : tool?.id || tool?.name || "";
  const map = {
    calculator: "Calculator",
    "web.search": "Web Search",
    "gmail.read": "Read Gmail",
    "gmail.send": "Send Emails",
  };
  return map[name] || name || "Tool";
}

function getToolKey(tool) {
  return (
    typeof tool === "string" ? tool : tool?.id || tool?.name || ""
  ).toLowerCase();
}

function ModernReveal({
  children,
  rootRef,
  delay = 0,
  y = 22,
  scale = 0.98,
  blur = 8,
  immediate = false,
  className = "",
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      {
        root: rootRef?.current || null,
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate, rootRef]);

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
        transition: `opacity 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}

function AgentCard({
  agent,
  isDeleting,
  onUseInChat,
  onOpenDetails,
  onDeleteAgent,
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, x: 0, y: 0, active: false });

  const agentId = getAgentId(agent);
  const agentName = agent?.name || "Untitled Agent";
  const instructions = agent?.instructions || "No instructions configured.";
  const knowledgeBase = agent?.knowledgeBase || "";
  const tools = Array.isArray(agent?.tools) ? agent.tools : [];

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setTilt({
      rx: (0.5 - py) * 8,
      ry: (px - 0.5) * 8,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, x: 0, y: 0, active: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(950px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translate3d(0, ${
          tilt.active ? -3 : 0
        }px, 0)`,
        transition: tilt.active
          ? "transform 90ms ease-out, border-color 200ms, background-color 200ms, box-shadow 200ms"
          : "transform 380ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms, background-color 200ms, box-shadow 200ms",
        willChange: "transform",
      }}
      className={`group relative flex h-full min-h-[250px] flex-col justify-between overflow-hidden rounded-3xl p-5 ${darkPanel} hover:border-white/20 hover:bg-white/[0.06]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: tilt.active ? 1 : 0,
          background: `radial-gradient(280px circle at ${tilt.x}px ${tilt.y}px, rgba(255,255,255,0.11), transparent 70%)`,
        }}
      />

      <div className="relative z-10 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-zinc-950 shadow-[0_6px_20px_rgba(255,255,255,0.15)] transition-transform duration-200 group-hover:scale-105">
            <Bot size={19} />
          </span>

          <div className="flex items-center gap-2">
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
              <Wrench size={11} className="text-zinc-400" />
              <span>{tools.length} tools</span>
            </span>
            <Button
              type="button"
              variant="ghost"
              disabled={isDeleting}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteAgent(agent);
              }}
              aria-label={`Delete ${agentName}`}
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash size={15} />
              )}
            </Button>
          </div>
        </div>

        <h2 className="mt-4 truncate text-base font-semibold tracking-tight text-white">
          {agentName}
        </h2>

        <p className="mt-1.5 line-clamp-2 break-words text-xs leading-relaxed text-zinc-300">
          {instructions}
        </p>

        {knowledgeBase && (
          <p className="mt-2.5 line-clamp-2 break-words rounded-xl border border-white/[0.07] bg-black/25 px-3 py-2 text-[11px] leading-relaxed text-zinc-400">
            {knowledgeBase.length > 90
              ? knowledgeBase.slice(0, 90) + "..."
              : knowledgeBase}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {tools.length > 0 ? (
            tools.slice(0, 3).map((tool, idx) => {
              const key = getToolKey(tool);
              const label = formatToolLabel(tool);
              return (
                <span
                  key={`${agentId || agentName}-${key}-${idx}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-300"
                >
                  {key.includes("search") && <Globe size={11} />}
                  {key.includes("calc") && <Calculator size={11} />}
                  {key.includes("gmail") && <Mail size={11} />}
                  <span>{label}</span>
                </span>
              );
            })
          ) : (
            <span className="text-[11px] text-zinc-500">No tools assigned</span>
          )}
          {tools.length > 3 && (
            <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-400">
              +{tools.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-5 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3.5">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onOpenDetails(agent)}
          className="h-8 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <Eye size={13} className="mr-1.5" />
          <span>Details</span>
        </Button>

        <Button
          type="button"
          onClick={() => onUseInChat(agent)}
          className="h-8 rounded-xl bg-white px-3.5 text-xs font-semibold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 active:scale-[0.97]"
        >
          <span>Use Agent</span>
        </Button>
      </div>
    </div>
  );
}

function AgentSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`h-[250px] animate-pulse rounded-3xl p-5 ${darkPanel}`}
        >
          <div className="flex items-center justify-between">
            <div className="size-10 rounded-2xl bg-white/10" />
            <div className="h-6 w-16 rounded-full bg-white/10" />
          </div>
          <div className="mt-4 h-4 w-2/3 rounded-lg bg-white/10" />
          <div className="mt-2.5 h-3 w-full rounded-lg bg-white/[0.07]" />
          <div className="mt-1.5 h-3 w-4/5 rounded-lg bg-white/[0.07]" />
          <div className="mt-6 flex gap-2">
            <div className="h-6 w-20 rounded-lg bg-white/[0.07]" />
            <div className="h-6 w-20 rounded-lg bg-white/[0.07]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Agents() {
  const { getAllAgent, deleteAgent } = useAgent();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxAgents = useSelector((state) => state.agent?.agents);
  const reduxLoading = useSelector(
    (state) => state.agent?.loading ?? state.agent?.isLoading ?? false,
  );
  const reduxError = useSelector((state) => state.agent?.error ?? "");

  const [fetching, setFetching] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [shakeError, setShakeError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState("all");
  const [detailAgent, setDetailAgent] = useState(null);

  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false });

  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const shakeTimerRef = useRef(null);
  const lastScrollTopRef = useRef(0);
  const hasFetchedRef = useRef(false);

  const agentsList = useMemo(
    () => (Array.isArray(reduxAgents) ? reduxAgents : []),
    [reduxAgents],
  );

  const isLoading = fetching || Boolean(reduxLoading);
  const displayError = fetchError || reduxError;

  const triggerShake = useCallback(() => {
    setShakeError(false);
    requestAnimationFrame(() => {
      setShakeError(true);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => {
        setShakeError(false);
      }, 450);
    });
  }, []);

  const fetchAllAgent = useCallback(async () => {
    setFetching(true);
    setFetchError("");

    try {
      const result = await getAllAgent();
      const list = result?.agent ?? result?.agents ?? result ?? [];
      dispatch(setAgents(list));
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.statusText ||
        error?.message ||
        "Failed to load agents";
      setFetchError(message);
      triggerShake();
    } finally {
      setFetching(false);
    }
  }, [dispatch, getAllAgent, triggerShake]);

  const handleDeleteAgent = useCallback(
    async (agent) => {
      const agentId = getAgentId(agent);
      if (!agentId) return;

      setDeletingId(agentId);
      setFetchError("");

      try {
        await deleteAgent(agentId);
        dispatch(removeAgent(agentId));
        setDetailAgent((prev) =>
          prev && getAgentId(prev) === agentId ? null : prev,
        );
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "Failed to delete agent";
        setFetchError(message);
        triggerShake();
      } finally {
        setDeletingId(null);
      }
    },
    [deleteAgent, dispatch, triggerShake],
  );

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchAllAgent();
  }, [fetchAllAgent]);

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
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

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const filteredAgents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return agentsList.filter((agent) => {
      const name = (agent?.name || "").toLowerCase();
      const instructions = (agent?.instructions || "").toLowerCase();
      const knowledgeBase = (agent?.knowledgeBase || "").toLowerCase();
      const tools = Array.isArray(agent?.tools) ? agent.tools : [];

      const matchesSearch =
        !q ||
        name.includes(q) ||
        instructions.includes(q) ||
        knowledgeBase.includes(q);

      const matchesTool =
        selectedTool === "all" ||
        tools.some((t) => getToolKey(t) === selectedTool);

      return matchesSearch && matchesTool;
    });
  }, [agentsList, searchQuery, selectedTool]);

  function handleUseInChat(agent) {
    navigate("/", {
      state: {
        selectedAgentId: getAgentId(agent) || null,
        selectedAgent: agent,
      },
    });
  }

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

      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/[0.06]">
        <div
          className="h-full origin-left bg-gradient-to-r from-zinc-400 via-white to-zinc-300 shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-transform duration-75 ease-out"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-[-120px] h-[340px] w-[620px] -translate-x-1/2 animate-pulse rounded-full bg-white/[0.04] blur-3xl"
      />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]"
      />

      <div className="relative z-10">
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
              : "h-16 border-b border-white/[0.06] bg-transparent px-4 sm:px-6"
          }`}
        >
          <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-2">
            <Link
              to={"/"}
              className="group flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/[0.1] hover:text-white active:scale-95"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-200 ease-out group-hover:-translate-x-1"
              />
              <span>Back to chat</span>
            </Link>

            <Link
              to={"/agent/new"}
              className="group flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-200 hover:bg-zinc-100 active:scale-95"
            >
              <Plus
                size={14}
                className="transition-transform duration-200 group-hover:rotate-90"
              />
              <span>New Agent</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
          <ModernReveal immediate delay={40} y={18} blur={6}>
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
                  <span>Workspace Agents</span>
                </div>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  My Agents
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Manage agents created for your account and inspect full
                  details.
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-3 self-start sm:self-center">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-right">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                    Total Agents
                  </p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums text-white">
                    {agentsList.length}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={fetchAllAgent}
                  aria-label="Refresh agents"
                  className="size-11 rounded-2xl border-white/10 bg-white/[0.05] p-0 text-zinc-300 hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                </Button>
              </div>
            </section>
          </ModernReveal>

          <ModernReveal
            rootRef={containerRef}
            delay={70}
            y={16}
            blur={5}
            className="mt-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agents by name, instructions, or knowledge base..."
                  className="h-10 rounded-xl border-white/10 bg-white/[0.03] pl-9 text-xs text-white placeholder:text-zinc-500 focus-visible:border-white/30 focus-visible:ring-0 sm:text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {TOOL_META.map((item) => {
                  const active = selectedTool === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTool(item.id)}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200 active:scale-95 ${
                        active
                          ? "border-white bg-white text-zinc-950 shadow-[0_0_18px_rgba(255,255,255,0.16)]"
                          : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </ModernReveal>

          {displayError && (
            <div
              role="alert"
              className={`mt-5 rounded-2xl border border-red-500/25 bg-red-500/[0.08] px-4 py-3 text-xs text-red-300 ${
                shakeError ? "animate-agent-shake" : ""
              }`}
            >
              {displayError}
            </div>
          )}

          <div className="mt-6">
            {isLoading && agentsList.length === 0 ? (
              <AgentSkeletonGrid />
            ) : filteredAgents.length > 0 ? (
              <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAgents.map((agent, index) => {
                  const agentId = getAgentId(agent);
                  return (
                    <ModernReveal
                      key={agentId || `${agent?.name}-${index}`}
                      rootRef={containerRef}
                      delay={Math.min(index * 60, 240)}
                      y={20}
                      blur={5}
                      className="h-full"
                    >
                      <AgentCard
                        agent={agent}
                        isDeleting={deletingId === agentId}
                        onUseInChat={handleUseInChat}
                        onOpenDetails={(a) => setDetailAgent(a)}
                        onDeleteAgent={handleDeleteAgent}
                      />
                    </ModernReveal>
                  );
                })}
              </div>
            ) : (
              <ModernReveal rootRef={containerRef} delay={80} y={18} blur={6}>
                <div
                  className={`flex flex-col items-center justify-center rounded-3xl px-6 py-14 text-center ${darkPanel}`}
                >
                  <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-zinc-200">
                    <Bot size={22} />
                  </span>
                  <h2 className="mt-4 text-base font-semibold text-white">
                    {agentsList.length === 0
                      ? "No agents created yet"
                      : "No matching agents found"}
                  </h2>
                  <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-400">
                    {agentsList.length === 0
                      ? "Create your first AI agent with custom instructions, knowledge base, and tools."
                      : "Try clearing your search or switching tool filters."}
                  </p>
                  <div className="mt-5 flex items-center gap-2.5">
                    {(searchQuery || selectedTool !== "all") && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedTool("all");
                        }}
                        className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs text-zinc-200 hover:bg-white/10 hover:text-white"
                      >
                        Reset filters
                      </Button>
                    )}
                    <Link
                      to={"/agent/new"}
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-100"
                    >
                      <Plus size={14} />
                      <span>Create Agent</span>
                    </Link>
                  </div>
                </div>
              </ModernReveal>
            )}
          </div>
        </main>
      </div>

      <AgentDetailsModal
        agent={detailAgent}
        onClose={() => setDetailAgent(null)}
        onSelectAgent={(agent) => handleUseInChat(agent)}
      />
    </div>
  );
}

export default Agents;

// import {
//   ArrowLeft,
//   Bot,
//   Calculator,
//   Globe,
//   Loader2,
//   Mail,
//   Plus,
//   RefreshCw,
//   Search,
//   Sparkles,
//   Wrench,
//   Workflow,
// } from "lucide-react";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { setAgents } from "@/features/agent/agentSlice";
// import useAgent from "@/features/agent/hooks/useAgent";

// const darkPanel =
//   "border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl";

// const TOOL_META = [
//   { id: "all", label: "All Tools" },
//   { id: "calculator", label: "Calculator" },
//   { id: "web.search", label: "Web Search" },
//   { id: "gmail.read", label: "Read Gmail" },
//   { id: "gmail.send", label: "Send Emails" },
// ];

// function formatToolLabel(tool) {
//   const name = typeof tool === "string" ? tool : tool?.id || tool?.name || "";
//   const map = {
//     calculator: "Calculator",
//     "web.search": "Web Search",
//     "gmail.read": "Read Gmail",
//     "gmail.send": "Send Emails",
//   };
//   return map[name] || name || "Tool";
// }

// function getToolKey(tool) {
//   return (
//     typeof tool === "string" ? tool : tool?.id || tool?.name || ""
//   ).toLowerCase();
// }

// function ModernReveal({
//   children,
//   rootRef,
//   delay = 0,
//   y = 22,
//   scale = 0.98,
//   blur = 8,
//   immediate = false,
//   className = "",
// }) {
//   const ref = useRef(null);
//   const [inView, setInView] = useState(immediate);

//   useEffect(() => {
//     if (immediate) {
//       const id = requestAnimationFrame(() => setInView(true));
//       return () => cancelAnimationFrame(id);
//     }

//     const el = ref.current;
//     if (!el) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setInView(true);
//           observer.unobserve(el);
//         }
//       },
//       {
//         root: rootRef?.current || null,
//         threshold: 0.1,
//         rootMargin: "0px 0px -20px 0px",
//       },
//     );

//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [immediate, rootRef]);

//   return (
//     <div
//       ref={ref}
//       className={className}
//       style={{
//         opacity: inView ? 1 : 0,
//         filter: inView ? "blur(0px)" : `blur(${blur}px)`,
//         transform: inView
//           ? "translate3d(0, 0, 0) scale(1)"
//           : `translate3d(0, ${y}px, 0) scale(${scale})`,
//         transition: `opacity 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
//         willChange: "opacity, transform, filter",
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function AgentCard({ agent, onUseInChat }) {
//   const cardRef = useRef(null);
//   const [tilt, setTilt] = useState({ rx: 0, ry: 0, x: 0, y: 0, active: false });

//   const agentId = agent?._id || agent?.id;
//   const agentName = agent?.name || "Untitled Agent";
//   const instructions = agent?.instructions || "No instructions configured.";
//   const knowledgeBase = agent?.knowledgeBase || "";
//   const tools = Array.isArray(agent?.tools) ? agent.tools : [];

//   const handleMouseMove = (e) => {
//     const el = cardRef.current;
//     if (!el) return;
//     const rect = el.getBoundingClientRect();
//     const px = (e.clientX - rect.left) / rect.width;
//     const py = (e.clientY - rect.top) / rect.height;

//     setTilt({
//       rx: (0.5 - py) * 8,
//       ry: (px - 0.5) * 8,
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//       active: true,
//     });
//   };

//   const handleMouseLeave = () => {
//     setTilt({ rx: 0, ry: 0, x: 0, y: 0, active: false });
//   };

//   return (
//     <div
//       ref={cardRef}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       style={{
//         transform: `perspective(950px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translate3d(0, ${
//           tilt.active ? -3 : 0
//         }px, 0)`,
//         transition: tilt.active
//           ? "transform 90ms ease-out, border-color 200ms, background-color 200ms, box-shadow 200ms"
//           : "transform 380ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms, background-color 200ms, box-shadow 200ms",
//         willChange: "transform",
//       }}
//       className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 ${darkPanel} hover:border-white/20 hover:bg-white/[0.06]`}
//     >
//       <div
//         aria-hidden
//         className="pointer-events-none absolute -inset-px transition-opacity duration-300"
//         style={{
//           opacity: tilt.active ? 1 : 0,
//           background: `radial-gradient(280px circle at ${tilt.x}px ${tilt.y}px, rgba(255,255,255,0.11), transparent 70%)`,
//         }}
//       />

//       <div className="relative z-10">
//         <div className="flex items-start justify-between gap-3">
//           <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-zinc-950 shadow-[0_6px_20px_rgba(255,255,255,0.15)] transition-transform duration-200 group-hover:scale-105">
//             <Bot size={19} />
//           </span>

//           <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
//             <Wrench size={11} className="text-zinc-400" />
//             <span>{tools.length} tools</span>
//           </span>
//         </div>

//         <h2 className="mt-4 truncate text-base font-semibold tracking-tight text-white">
//           {agentName}
//         </h2>

//         <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-300">
//           {instructions}
//         </p>

//         {knowledgeBase && (
//           <p className="mt-2.5 line-clamp-2 rounded-xl border border-white/[0.07] bg-black/25 px-3 py-2 text-[11px] leading-relaxed text-zinc-400">
//             {knowledgeBase}
//           </p>
//         )}

//         <div className="mt-4 flex flex-wrap gap-1.5">
//           {tools.length > 0 ? (
//             tools.map((tool, idx) => {
//               const key = getToolKey(tool);
//               const label = formatToolLabel(tool);
//               return (
//                 <span
//                   key={`${agentId || agentName}-${key}-${idx}`}
//                   className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-300"
//                 >
//                   {key.includes("search") && <Globe size={11} />}
//                   {key.includes("calc") && <Calculator size={11} />}
//                   {key.includes("gmail") && <Mail size={11} />}
//                   <span>{label}</span>
//                 </span>
//               );
//             })
//           ) : (
//             <span className="text-[11px] text-zinc-500">No tools assigned</span>
//           )}
//         </div>
//       </div>

//       <div className="relative z-10 mt-5 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3.5">
//         <span className="text-[11px] text-zinc-500">Ready</span>
//         <Button
//           type="button"
//           onClick={() => onUseInChat(agent)}
//           className="h-8 rounded-xl bg-white px-3.5 text-xs font-semibold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 active:scale-[0.97]"
//         >
//           <span>Use Agent</span>
//         </Button>
//       </div>
//     </div>
//   );
// }

// function AgentSkeletonGrid() {
//   return (
//     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//       {[0, 1, 2].map((i) => (
//         <div
//           key={i}
//           className={`h-56 animate-pulse rounded-3xl p-5 ${darkPanel}`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="size-10 rounded-2xl bg-white/10" />
//             <div className="h-6 w-16 rounded-full bg-white/10" />
//           </div>
//           <div className="mt-4 h-4 w-2/3 rounded-lg bg-white/10" />
//           <div className="mt-2.5 h-3 w-full rounded-lg bg-white/[0.07]" />
//           <div className="mt-1.5 h-3 w-4/5 rounded-lg bg-white/[0.07]" />
//           <div className="mt-6 flex gap-2">
//             <div className="h-6 w-20 rounded-lg bg-white/[0.07]" />
//             <div className="h-6 w-20 rounded-lg bg-white/[0.07]" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function Agents() {
//   const { getAllAgent } = useAgent();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const reduxAgents = useSelector((state) => state.agent?.agents);
//   const reduxLoading = useSelector(
//     (state) => state.agent?.loading ?? state.agent?.isLoading ?? false,
//   );
//   const reduxError = useSelector((state) => state.agent?.error ?? "");

//   const [fetching, setFetching] = useState(false);
//   const [fetchError, setFetchError] = useState("");
//   const [shakeError, setShakeError] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedTool, setSelectedTool] = useState("all");
//   const [detailAgent, setDetailAgent] = useState(null);

//   const [scrollY, setScrollY] = useState(0);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const [headerHidden, setHeaderHidden] = useState(false);
//   const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false });

//   const containerRef = useRef(null);
//   const heroRef = useRef(null);
//   const shakeTimerRef = useRef(null);
//   const lastScrollTopRef = useRef(0);

//   const agentsList = useMemo(
//     () => (Array.isArray(reduxAgents) ? reduxAgents : []),
//     [reduxAgents],
//   );

//   const isLoading = fetching || Boolean(reduxLoading);
//   const displayError = fetchError || reduxError;

//   const triggerShake = useCallback(() => {
//     setShakeError(false);
//     requestAnimationFrame(() => {
//       setShakeError(true);
//       if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
//       shakeTimerRef.current = setTimeout(() => {
//         setShakeError(false);
//       }, 450);
//     });
//   }, []);

//   const fetchAllAgent = useCallback(async () => {
//     setFetching(true);
//     setFetchError("");

//     try {
//       const result = await getAllAgent();
//       const list = result?.agent ?? result?.agents ?? result ?? [];
//       dispatch(setAgents(Array.isArray(list) ? list : []));
//     } catch (error) {
//       const message =
//         error?.response?.data?.message ||
//         error?.response?.statusText ||
//         error?.message ||
//         "Failed to load agents";
//       setFetchError(message);
//       triggerShake();
//     } finally {
//       setFetching(false);
//     }
//   }, [dispatch, getAllAgent, triggerShake]);

//   useEffect(() => {
//     fetchAllAgent();
//   }, [fetchAllAgent]);

//   useEffect(() => {
//     return () => {
//       if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;

//     let rafId = null;

//     const handleScroll = () => {
//       if (rafId) return;
//       rafId = requestAnimationFrame(() => {
//         const currentY = el.scrollTop;
//         const prevY = lastScrollTopRef.current;
//         const maxScroll = el.scrollHeight - el.clientHeight;

//         setScrollY(currentY);
//         setScrollProgress(
//           maxScroll > 0 ? Math.min(currentY / maxScroll, 1) : 0,
//         );

//         if (currentY <= 24) {
//           setHeaderHidden(false);
//         } else if (currentY > prevY + 4 && currentY > 64) {
//           setHeaderHidden(true);
//         } else if (currentY < prevY - 4) {
//           setHeaderHidden(false);
//         }

//         lastScrollTopRef.current = currentY;
//         rafId = null;
//       });
//     };

//     el.addEventListener("scroll", handleScroll, { passive: true });
//     return () => {
//       el.removeEventListener("scroll", handleScroll);
//       if (rafId) cancelAnimationFrame(rafId);
//     };
//   }, []);

//   const handleHeroMouseMove = (e) => {
//     if (!heroRef.current) return;
//     const rect = heroRef.current.getBoundingClientRect();
//     setSpotlight({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//       active: true,
//     });
//   };

//   const filteredAgents = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();
//     return agentsList.filter((agent) => {
//       const name = (agent?.name || "").toLowerCase();
//       const instructions = (agent?.instructions || "").toLowerCase();
//       const tools = Array.isArray(agent?.tools) ? agent.tools : [];

//       const matchesSearch = !q || name.includes(q) || instructions.includes(q);

//       const matchesTool =
//         selectedTool === "all" ||
//         tools.some((t) => getToolKey(t) === selectedTool);

//       return matchesSearch && matchesTool;
//     });
//   }, [agentsList, searchQuery, selectedTool]);

//   function handleUseInChat(agent) {
//     navigate("/", {
//       state: {
//         selectedAgentId: agent?._id || agent?.id || null,
//         selectedAgent: agent,
//       },
//     });
//   }

//   return (
//     <div
//       ref={containerRef}
//       className="relative h-screen overflow-auto bg-[#121317] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#2b2f3a_0%,#191b21_55%,#121317_100%)] text-white"
//     >
//       <style>{`
//         @keyframes agentShake {
//           0%, 100% { transform: translate3d(0, 0, 0); }
//           20% { transform: translate3d(-8px, 0, 0); }
//           40% { transform: translate3d(8px, 0, 0); }
//           60% { transform: translate3d(-5px, 0, 0); }
//           80% { transform: translate3d(5px, 0, 0); }
//         }
//         .animate-agent-shake {
//           animation: agentShake 420ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
//         }
//       `}</style>

//       {/* Top Scroll Progress Line */}
//       <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/[0.06]">
//         <div
//           className="h-full origin-left bg-gradient-to-r from-zinc-400 via-white to-zinc-300 shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-transform duration-75 ease-out"
//           style={{ transform: `scaleX(${scrollProgress})` }}
//         />
//       </div>

//       {/* Floating Ambient Orb */}
//       <div
//         aria-hidden
//         className="pointer-events-none fixed left-1/2 top-[-120px] h-[340px] w-[620px] -translate-x-1/2 animate-pulse rounded-full bg-white/[0.04] blur-3xl"
//       />

//       {/* Vignette Overlay */}
//       <div
//         aria-hidden
//         className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]"
//       />

//       <div className="relative z-10">
//         {/* Scroll-Aware Header */}
//         <header
//           style={{
//             transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
//           }}
//           className={`sticky top-0 z-30 flex shrink-0 items-center justify-between transition-all duration-300 will-change-transform ${
//             headerHidden
//               ? "pointer-events-none -translate-y-full opacity-0"
//               : "translate-y-0 opacity-100"
//           } ${
//             scrollY > 20
//               ? "h-14 border-b border-white/[0.09] bg-[#16181d]/80 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6"
//               : "h-16 border-b border-white/[0.06] bg-transparent px-4 sm:px-6"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <Link
//               to={"/"}
//               className="group flex items-center gap-2.5 rounded-xl py-1 pr-2 transition-colors"
//             >
//               <span className="relative grid size-8 place-items-center rounded-lg bg-white text-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.14)] transition-all duration-300 ease-out group-hover:-rotate-6 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(255,255,255,0.28)] active:scale-95">
//                 <Workflow
//                   size={17}
//                   className="transition-transform duration-300 group-hover:rotate-12"
//                 />
//               </span>
//               <span className="text-sm font-medium tracking-tight text-zinc-100 transition-colors duration-200 group-hover:text-white">
//                 Automation AI
//               </span>
//             </Link>
//           </div>

//           <div className="flex items-center gap-2">
//             <Link
//               to={"/"}
//               className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/[0.1] hover:text-white active:scale-95"
//             >
//               <ArrowLeft
//                 size={14}
//                 className="transition-transform duration-200 ease-out group-hover:-translate-x-1"
//               />
//               <span>Back to chat</span>
//             </Link>

//             <Link
//               to={"/agent/new"}
//               className="group flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-200 hover:bg-zinc-100 active:scale-95"
//             >
//               <Plus
//                 size={14}
//                 className="transition-transform duration-200 group-hover:rotate-90"
//               />
//               <span>New Agent</span>
//             </Link>
//           </div>
//         </header>

//         <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
//           {/* Hero Banner with Spotlight */}
//           <ModernReveal immediate delay={40} y={18} blur={6}>
//             <section
//               ref={heroRef}
//               onMouseMove={handleHeroMouseMove}
//               onMouseLeave={() =>
//                 setSpotlight((prev) => ({ ...prev, active: false }))
//               }
//               className={`relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl p-5 sm:flex-row sm:items-center sm:p-6 ${darkPanel}`}
//             >
//               <div
//                 aria-hidden
//                 className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-500"
//                 style={{
//                   opacity: spotlight.active ? 1 : 0,
//                   background: `radial-gradient(420px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,255,255,0.08), transparent 65%)`,
//                 }}
//               />

//               <div className="relative z-10">
//                 <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
//                   <Sparkles size={12} className="text-white" />
//                   <span>Workspace Agents</span>
//                 </div>
//                 <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
//                   My Agents
//                 </h1>
//                 <p className="mt-1 text-sm text-zinc-400">
//                   Manage agents created for your account and launch them in
//                   chat.
//                 </p>
//               </div>

//               <div className="relative z-10 flex items-center gap-3 self-start sm:self-center">
//                 <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-right">
//                   <p className="text-[11px] uppercase tracking-wider text-zinc-500">
//                     Total Agents
//                   </p>
//                   <p className="mt-0.5 text-lg font-semibold tabular-nums text-white">
//                     {agentsList.length}
//                   </p>
//                 </div>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   disabled={isLoading}
//                   onClick={fetchAllAgent}
//                   aria-label="Refresh agents"
//                   className="size-11 rounded-2xl border-white/10 bg-white/[0.05] p-0 text-zinc-300 hover:border-white/25 hover:bg-white/10 hover:text-white"
//                 >
//                   {isLoading ? (
//                     <Loader2 size={16} className="animate-spin" />
//                   ) : (
//                     <RefreshCw size={16} />
//                   )}
//                 </Button>
//               </div>
//             </section>
//           </ModernReveal>

//           {/* Search & Tool Filter Bar */}
//           <ModernReveal
//             rootRef={containerRef}
//             delay={70}
//             y={16}
//             blur={5}
//             className="mt-6"
//           >
//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//               <div className="relative flex-1">
//                 <Search
//                   size={15}
//                   className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
//                 />
//                 <Input
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search agents by name or instructions..."
//                   className="h-10 rounded-xl border-white/10 bg-white/[0.03] pl-9 text-xs text-white placeholder:text-zinc-500 focus-visible:border-white/30 focus-visible:ring-0 sm:text-sm"
//                 />
//               </div>

//               <div className="flex flex-wrap gap-1.5">
//                 {TOOL_META.map((item) => {
//                   const active = selectedTool === item.id;
//                   return (
//                     <button
//                       key={item.id}
//                       type="button"
//                       onClick={() => setSelectedTool(item.id)}
//                       className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200 active:scale-95 ${
//                         active
//                           ? "border-white bg-white text-zinc-950 shadow-[0_0_18px_rgba(255,255,255,0.16)]"
//                           : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
//                       }`}
//                     >
//                       {item.label}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </ModernReveal>

//           {/* Error Banner */}
//           {displayError && (
//             <div
//               role="alert"
//               className={`mt-5 rounded-2xl border border-red-500/25 bg-red-500/[0.08] px-4 py-3 text-xs text-red-300 ${
//                 shakeError ? "animate-agent-shake" : ""
//               }`}
//             >
//               {displayError}
//             </div>
//           )}

//           {/* Content Grid / Loading / Empty State */}
//           <div className="mt-6">
//             {isLoading && agentsList.length === 0 ? (
//               <AgentSkeletonGrid />
//             ) : filteredAgents.length > 0 ? (
//               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {filteredAgents.map((agent, index) => (
//                   <ModernReveal
//                     key={agent?._id || agent?.id || `${agent?.name}-${index}`}
//                     rootRef={containerRef}
//                     delay={Math.min(index * 60, 240)}
//                     y={20}
//                     blur={5}
//                   >
//                     <AgentCard agent={agent} onUseInChat={handleUseInChat} />
//                   </ModernReveal>
//                 ))}
//               </div>
//             ) : (
//               <ModernReveal rootRef={containerRef} delay={80} y={18} blur={6}>
//                 <div
//                   className={`flex flex-col items-center justify-center rounded-3xl px-6 py-14 text-center ${darkPanel}`}
//                 >
//                   <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-zinc-200">
//                     <Bot size={22} />
//                   </span>
//                   <h2 className="mt-4 text-base font-semibold text-white">
//                     {agentsList.length === 0
//                       ? "No agents created yet"
//                       : "No matching agents found"}
//                   </h2>
//                   <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-400">
//                     {agentsList.length === 0
//                       ? "Create your first AI agent with custom instructions, knowledge base, and tools."
//                       : "Try clearing your search or switching tool filters."}
//                   </p>
//                   <div className="mt-5 flex items-center gap-2.5">
//                     {(searchQuery || selectedTool !== "all") && (
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         onClick={() => {
//                           setSearchQuery("");
//                           setSelectedTool("all");
//                         }}
//                         className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs text-zinc-200 hover:bg-white/10 hover:text-white"
//                       >
//                         Reset filters
//                       </Button>
//                     )}
//                     <Link
//                       to={"/agent/new"}
//                       className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-100"
//                     >
//                       <Plus size={14} />
//                       <span>Create Agent</span>
//                     </Link>
//                   </div>
//                 </div>
//               </ModernReveal>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Agents;

// import { setAgents } from "@/features/agent/agentSlice";
// import useAgent from "@/features/agent/hooks/useAgent";
// import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";

// function Agents() {
//   const { getAllAgent } = useAgent();
//   const dispatch = useDispatch();

//   const fetchAllAgent = async () => {
//     try {
//       const result = await getAllAgent();
//       dispatch(setAgents(result.agent));
//       console.log(result);
//     } catch (error) {
//       console.log(error.response.statusText);
//     }
//   };

//   useEffect(() => {
//     fetchAllAgent();
//   }, []);
//   return <div>Agents</div>;
// }

// export default Agents;
