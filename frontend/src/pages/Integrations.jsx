import {
  ArrowLeft,
  Bot,
  Calculator,
  Check,
  Globe,
  LogOut,
  Mail,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/features/auth/hooks/useAuth";
import { setError, setUser } from "@/features/auth/authSlice";
import Logo from "@/assets/Orbiting Circuit C Emblem.png";

const INITIAL_INTEGRATIONS = [
  {
    id: "gmail",
    name: "Gmail MCP",
    category: "Email & Inbox",
    description: "Read threads, summarize updates, and draft or send emails.",
    connected: true,
    hitlRequired: true,
    endpoint: "mcp://gmail.local/v1",
    scopes: ["gmail.read", "gmail.send"],
    sampleTarget: "team@automation.ai",
    samplePayload: "Draft summary: Sprint tasks are on track for Friday demo.",
  },
  {
    id: "instagram",
    name: "Instagram MCP",
    category: "Social Publishing",
    description:
      "Manage scheduled captions, media drafts, and comment replies.",
    connected: false,
    hitlRequired: true,
    endpoint: "mcp://instagram.local/v1",
    scopes: ["ig.media.draft", "ig.comments.reply"],
    sampleTarget: "@automation.ai.studio",
    samplePayload:
      "New multi-agent workflow live — automated triage with HITL.",
  },
  {
    id: "x",
    name: "X (Twitter) MCP",
    category: "Social & Updates",
    description:
      "Compose posts, threads, and mentions across multi-agent runs.",
    connected: true,
    hitlRequired: true,
    endpoint: "mcp://x.local/v1",
    scopes: ["x.post.create", "x.mentions.read"],
    sampleTarget: "@automation_ai",
    samplePayload: "Shipping MCP tool routing + human-in-the-loop approvals.",
  },
  {
    id: "web-search",
    name: "Web Search MCP",
    category: "Research Tool",
    description:
      "Fetch real-time documentation, articles, and reference facts.",
    connected: true,
    hitlRequired: false,
    endpoint: "mcp://search.local/v1",
    scopes: ["web.query"],
    sampleTarget: "https://modelcontextprotocol.io",
    samplePayload: "Query: Multi-agent MCP orchestration patterns",
  },
  {
    id: "calculator",
    name: "Calculator Tool",
    category: "Utilities",
    description: "Evaluate metrics, budgets, and deterministic expressions.",
    connected: true,
    hitlRequired: false,
    endpoint: "tool://math.local/v1",
    scopes: ["math.evaluate"],
    sampleTarget: "Budget & Token Estimator",
    samplePayload: "1200 * 0.002 + 450 * 0.004",
  },
];

const darkPanel =
  "border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl";

const fieldCls =
  "rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white backdrop-blur-xl transition-all duration-300 placeholder:text-zinc-500 hover:border-white/20 hover:bg-white/[0.05] focus-visible:border-white/35 focus-visible:bg-white/[0.06] focus-visible:ring-0";

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
        threshold: 0.12,
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

function IntegrationCard({ item, onToggleConnect, onToggleHitl, onQueueTest }) {
  const cardRef = useRef(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const renderIcon = () => {
    if (item.id === "gmail") return <Mail size={17} />;
    if (item.id === "instagram") return <Sparkles size={17} />;
    if (item.id === "x") return <Workflow size={17} />;
    if (item.id === "web-search") return <Globe size={17} />;
    return <Calculator size={17} />;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpot((prev) => ({ ...prev, active: false }))}
      className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-200 ${darkPanel}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(280px circle at ${spot.x}px ${spot.y}px, rgba(255,255,255,0.09), transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-white">
              {renderIcon()}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold text-white">
                  {item.name}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                    item.connected
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 bg-white/[0.03] text-zinc-400"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      item.connected ? "bg-emerald-400" : "bg-zinc-500"
                    }`}
                  />
                  {item.connected ? "Connected (Demo)" : "Disconnected"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-400">
                  {item.category}
                </span>
              </div>
              <p className="mt-0.5 font-mono text-[11px] text-zinc-500">
                {item.endpoint}
              </p>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-zinc-400">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {item.scopes.map((scope) => (
              <span
                key={scope}
                className="rounded-lg border border-white/10 bg-black/25 px-2 py-0.5 font-mono text-[11px] text-zinc-300"
              >
                {scope}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          <Button
            type="button"
            onClick={() => onToggleConnect(item.id)}
            className={`h-9 rounded-xl px-3.5 text-xs font-medium transition-all active:scale-95 ${
              item.connected
                ? "border border-white/15 bg-white/[0.06] text-zinc-200 hover:bg-white/10 hover:text-white"
                : "bg-white text-zinc-950 hover:bg-zinc-200"
            }`}
          >
            {item.connected ? "Disconnect" : "Connect MCP"}
          </Button>

          <button
            type="button"
            onClick={() => onToggleHitl(item.id)}
            className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-all active:scale-95 ${
              item.hitlRequired
                ? "border-amber-400/30 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200"
            }`}
          >
            <ShieldCheck size={14} />
            <span>{item.hitlRequired ? "HITL: Required" : "HITL: Auto"}</span>
          </button>

          <Button
            type="button"
            variant="ghost"
            disabled={!item.connected}
            onClick={() => onQueueTest(item)}
            className="h-8 rounded-xl border border-white/10 bg-white/[0.02] px-3 text-[11px] text-zinc-300 hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
          >
            Simulate Action
          </Button>
        </div>
      </div>
    </div>
  );
}

function Integrations() {
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
  const [customMcpName, setCustomMcpName] = useState("");
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [customHitl, setCustomHitl] = useState(true);

  const [pendingApproval, setPendingApproval] = useState(null);
  const [editTarget, setEditTarget] = useState("");
  const [editPayload, setEditPayload] = useState("");
  const [auditLog, setAuditLog] = useState([
    {
      id: "init-1",
      tool: "Gmail MCP",
      status: "Ready",
      detail: "Local demo MCP registry initialized with HITL guardrails.",
    },
  ]);

  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);

  const mainRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  const menuContent =
    "rounded-2xl border border-white/10 bg-[#1d2026]/95 p-1.5 text-zinc-100 shadow-2xl shadow-black/50 backdrop-blur-xl";

  const menuItem =
    "flex items-center gap-2.5 rounded-xl py-2.5 text-zinc-300 focus:bg-white/10 focus:text-white";

  const menuSeparator = "bg-white/10";
  const iconBtn =
    "size-9 rounded-xl border border-white/10 bg-white/[0.05] p-0 text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95";

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

  async function handleLogout() {
    try {
      const result = await logout();
      dispatch(setUser(result.user || null));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setUser(null));
    }
  }

  function handleToggleConnect(id) {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextConnected = !item.connected;
        setAuditLog((logs) => [
          {
            id: `log-${Date.now()}`,
            tool: item.name,
            status: nextConnected ? "Connected" : "Disconnected",
            detail: `${item.name} ${nextConnected ? "enabled" : "disabled"} locally in demo state.`,
          },
          ...logs,
        ]);
        return { ...item, connected: nextConnected };
      }),
    );
  }

  function handleToggleHitl(id) {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextHitl = !item.hitlRequired;
        setAuditLog((logs) => [
          {
            id: `log-${Date.now()}`,
            tool: item.name,
            status: nextHitl ? "HITL Enabled" : "Auto Mode",
            detail: `Human-in-the-loop set to ${nextHitl ? "Required" : "Auto"} for ${item.name}.`,
          },
          ...logs,
        ]);
        return { ...item, hitlRequired: nextHitl };
      }),
    );
  }

  function handleQueueTest(item) {
    if (item.hitlRequired) {
      setPendingApproval({
        id: `hitl-${Date.now()}`,
        toolName: item.name,
        target: item.sampleTarget,
        payload: item.samplePayload,
      });
      setEditTarget(item.sampleTarget);
      setEditPayload(item.samplePayload);
      return;
    }

    setAuditLog((logs) => [
      {
        id: `log-${Date.now()}`,
        tool: item.name,
        status: "Executed (Auto)",
        detail: `[${item.sampleTarget}] ${item.samplePayload}`,
      },
      ...logs,
    ]);
  }

  function handleApproveHitl() {
    if (!pendingApproval) return;
    setAuditLog((logs) => [
      {
        id: `log-${Date.now()}`,
        tool: pendingApproval.toolName,
        status: "Approved & Ran",
        detail: `[${editTarget}] ${editPayload}`,
      },
      ...logs,
    ]);
    setPendingApproval(null);
  }

  function handleRejectHitl() {
    if (!pendingApproval) return;
    setAuditLog((logs) => [
      {
        id: `log-${Date.now()}`,
        tool: pendingApproval.toolName,
        status: "Rejected",
        detail: `Blocked action targeting [${editTarget}] via HITL review.`,
      },
      ...logs,
    ]);
    setPendingApproval(null);
  }

  function handleAddCustomMcp(e) {
    e.preventDefault();
    const cleanName = customMcpName.trim();
    const cleanUrl = customEndpoint.trim();
    if (!cleanName || !cleanUrl) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      name: cleanName,
      category: "Custom MCP",
      description: "Custom Model Context Protocol server added in local demo.",
      connected: true,
      hitlRequired: customHitl,
      endpoint: cleanUrl,
      scopes: ["mcp.invoke"],
      sampleTarget: cleanUrl,
      samplePayload: `Invoke ${cleanName} tool call`,
    };

    setIntegrations((prev) => [newItem, ...prev]);
    setAuditLog((logs) => [
      {
        id: `log-${Date.now()}`,
        tool: cleanName,
        status: "Added",
        detail: `Registered ${cleanUrl} (HITL: ${customHitl ? "Required" : "Auto"}).`,
      },
      ...logs,
    ]);
    setCustomMcpName("");
    setCustomEndpoint("");
  }

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#2b2f3a_0%,#191b21_55%,#121317_100%)] text-white">
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

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <header
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={`z-30 flex shrink-0 items-center justify-between transition-all duration-300 will-change-transform ${
            headerHidden
              ? "pointer-events-none -translate-y-full opacity-0 "
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
                ? "-translate-y-2.5 opacity-0 blur-[2px] "
                : "translate-y-0 opacity-100 blur-0 "
            }`}
          >
            <Link
              to={"/"}
              className="group flex items-center gap-1 rounded-xl py-1 pr-2 transition-colors"
            >
              {/* <span className="relative grid size-10 place-items-center rounded-lg bg-white text-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.14)] transition-all duration-300 ease-out group-hover:-rotate-6 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(255,255,255,0.28)] active:scale-95">
                          <Workflow
                            size={17}
                            className="transition-transform duration-300 group-hover:rotate-12"
                          />
                        </span> */}
              <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl ">
                <img
                  src={Logo}
                  alt="Automation AI"
                  className="size-5 h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-95"
                />
              </span>

              <span className="font-brand text-xl tracking-widest text-zinc-100 transition-colors duration-200 group-hover:text-white">
                Cortexa
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
              to={"/"}
              className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              <span>Back to workspace</span>
            </Link>

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

        {/* Integration Page Content */}
        <main
          ref={mainRef}
          className="mx-auto w-full max-w-4xl flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8"
        >
          <ModernReveal immediate delay={40} y={18} blur={6}>
            <section
              className={`flex flex-col justify-between gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:p-6 ${darkPanel}`}
            >
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                  <Settings2 size={12} className="text-white" />
                  <span>MCP & External Integrations (Demo)</span>
                </div>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Connected Tools & HITL Guardrails
                </h1>
                <p className="mt-1.5 text-sm text-zinc-400">
                  Connect Gmail, Instagram, X, and MCP tools for multi-agent
                  workflows with human-in-the-loop approval.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                  Active Connectors
                </p>
                <p className="mt-0.5 text-lg font-semibold text-white">
                  {connectedCount} / {integrations.length}
                </p>
              </div>
            </section>
          </ModernReveal>

          {/* Pending Human-in-the-Loop Approval Card */}
          {pendingApproval && (
            <ModernReveal immediate delay={20} y={14} blur={4}>
              <section className="space-y-4 rounded-3xl border border-amber-400/30 bg-amber-500/[0.06] p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-amber-200">
                    <ShieldCheck size={18} />
                    <h2 className="text-sm font-semibold">
                      Human-in-the-Loop Approval Required —{" "}
                      {pendingApproval.toolName}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleRejectHitl}
                    className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
                    aria-label="Dismiss approval"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs text-zinc-400">
                      Target / Destination
                    </label>
                    <Input
                      value={editTarget}
                      onChange={(e) => setEditTarget(e.target.value)}
                      className={`h-10 ${fieldCls}`}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-zinc-400">
                      Action Payload
                    </label>
                    <Textarea
                      value={editPayload}
                      onChange={(e) => setEditPayload(e.target.value)}
                      rows={2}
                      className={`min-h-10 ${fieldCls}`}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRejectHitl}
                    className="h-9 rounded-xl border border-red-400/30 bg-red-500/10 px-4 text-xs font-medium text-red-300 hover:bg-red-500/20"
                  >
                    Reject
                  </Button>
                  <Button
                    type="button"
                    onClick={handleApproveHitl}
                    className="h-9 rounded-xl bg-white px-4 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
                  >
                    <Check size={14} className="mr-1.5" />
                    Approve & Execute
                  </Button>
                </div>
              </section>
            </ModernReveal>
          )}

          {/* External & MCP Tool Cards */}
          <ModernReveal rootRef={mainRef} delay={60} y={20} blur={5}>
            <section className="space-y-3">
              {integrations.map((item) => (
                <IntegrationCard
                  key={item.id}
                  item={item}
                  onToggleConnect={handleToggleConnect}
                  onToggleHitl={handleToggleHitl}
                  onQueueTest={handleQueueTest}
                />
              ))}
            </section>
          </ModernReveal>

          {/* Add Custom MCP Server (Local Demo) */}
          <ModernReveal rootRef={mainRef} delay={60} y={20} blur={5}>
            <form
              onSubmit={handleAddCustomMcp}
              className={`space-y-4 rounded-3xl p-5 sm:p-6 ${darkPanel}`}
            >
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Add Custom MCP Server
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Register a local MCP endpoint for your multi-agent pipeline.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  value={customMcpName}
                  onChange={(e) => setCustomMcpName(e.target.value)}
                  placeholder="e.g. Notion / Slack MCP"
                  className={`h-10 ${fieldCls}`}
                />
                <Input
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  placeholder="e.g. mcp://notion.local/v1"
                  className={`h-10 ${fieldCls}`}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCustomHitl((v) => !v)}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition ${
                    customHitl
                      ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                      : "border-white/10 bg-white/[0.03] text-zinc-400"
                  }`}
                >
                  <ShieldCheck size={14} />
                  <span>
                    {customHitl
                      ? "Require HITL approval"
                      : "Allow auto execution"}
                  </span>
                </button>

                <Button
                  type="submit"
                  className="h-9 rounded-xl bg-white px-4 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
                >
                  <Plus size={14} className="mr-1.5" />
                  <span>Add MCP</span>
                </Button>
              </div>
            </form>
          </ModernReveal>

          {/* Local HITL & Tool Activity Log */}
          <ModernReveal rootRef={mainRef} delay={60} y={20} blur={5}>
            <section className={`space-y-2.5 rounded-3xl p-5 ${darkPanel}`}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                HITL & Tool Audit Log (Local)
              </h2>
              <div className="space-y-2">
                {auditLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col justify-between gap-1 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-xs sm:flex-row sm:items-center"
                  >
                    <div>
                      <span className="font-medium text-white">
                        {entry.tool}
                      </span>
                      <span className="mx-2 text-zinc-600">•</span>
                      <span className="text-zinc-300">{entry.detail}</span>
                    </div>
                    <span className="w-fit rounded-md border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[11px] text-zinc-300">
                      {entry.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </ModernReveal>
        </main>
      </div>
    </div>
  );
}

export default Integrations;
