import {
  ArrowUp,
  Bot,
  Calculator,
  Check,
  Globe,
  Loader2,
  LogOut,
  Mail,
  Plus,
  Send,
  Settings2,
  Sparkles,
  UserRound,
  Workflow,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import useAuth from "@/features/auth/hooks/useAuth";
import { setError, setUser } from "@/features/auth/authSlice";
import useAgent from "@/features/agent/hooks/useAgent";
import {
  clearAgents,
  setAgents,
  setSelectedAgentId,
} from "@/features/agent/agentSlice";
import useChat from "@/features/chat/hooks/useChat";
import { setNewMessage } from "@/features/chat/chatSlice";
import Logo from "@/assets/Orbiting Circuit C Emblem.png";
import MarkdownMessage from "@/components/MarkdownMessage";

const STARTER_PROMPTS = [
  "Send an email to rahul@example.com about the project update",
  "Compare top tech stacks for a real-time dashboard",
  "Break down a weekly sprint plan with clear milestones",
];

const darkPanel =
  "border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl";

function getAgentId(agent) {
  return agent?._id || agent?.id || "";
}

function getToolKey(tool) {
  return (
    typeof tool === "string" ? tool : tool?.id || tool?.name || ""
  ).toLowerCase();
}

function formatToolLabel(tool) {
  const raw = typeof tool === "string" ? tool : tool?.id || tool?.name || "";
  const map = {
    calculator: "Calculator",
    "web.search": "Web Search",
    "gmail.read": "Read Gmail",
    "gmail.send": "Send Emails",
  };
  return map[raw] || raw || "Tool";
}

function ModernReveal({
  children,
  rootRef,
  delay = 0,
  y = 24,
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
        rootMargin: "0px 0px -24px 0px",
      }
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

function AgentTiltCard({ agent, isSelected, onSelect }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({
    rx: 0,
    ry: 0,
    x: 50,
    y: 50,
    active: false,
  });

  const tools = Array.isArray(agent?.tools) ? agent.tools : [];
  const summary =
    agent?.instructions || agent?.knowledgeBase || "Custom AI agent";

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 9;
    const rx = (0.5 - py) * 9;

    setTilt({
      rx,
      ry,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, x: 50, y: 50, active: false });
  };

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${
          tilt.ry
        }deg) translate3d(0, ${tilt.active ? -3 : 0}px, 0)`,
        transition: tilt.active
          ? "transform 90ms ease-out, border-color 200ms, background-color 200ms, box-shadow 200ms"
          : "transform 380ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms, background-color 200ms, box-shadow 200ms",
        willChange: "transform",
      }}
      className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left ${
        isSelected
          ? "border-white/25 bg-white/[0.1] shadow-[0_14px_34px_rgba(0,0,0,0.35)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: tilt.active ? 1 : 0,
          background: `radial-gradient(240px circle at ${tilt.x}px ${tilt.y}px, rgba(255,255,255,0.12), transparent 70%)`,
        }}
      />

      <span
        aria-hidden
        className={`absolute inset-x-4 top-0 h-[2px] rounded-full bg-white transition-all duration-300 ${
          isSelected ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
      />

      <div className="relative z-10 w-full">
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
            {tools.length} tools
          </span>
        </div>

        <p className="mt-3 truncate text-sm font-medium text-white">
          {agent?.name || "Untitled Agent"}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{summary}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tools.length > 0 ? (
            tools.map((tool, idx) => {
              const key = getToolKey(tool);
              const label = formatToolLabel(tool);
              return (
                <span
                  key={`${getAgentId(agent)}-${key}-${idx}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/20 px-2 py-0.5 text-[11px] text-zinc-300"
                >
                  {key.includes("search") && <Globe size={11} />}
                  {key.includes("calc") && <Calculator size={11} />}
                  {key.includes("gmail") && <Mail size={11} />}
                  <span>{label}</span>
                </span>
              );
            })
          ) : (
            <span className="text-[11px] text-zinc-500">No tools</span>
          )}
        </div>
      </div>
    </button>
  );
}

function Home() {
  const { logout } = useAuth();
  const { getAllAgent } = useAgent();
  const { chat , agentChat} = useChat();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth?.user);
  const reduxAgents = useSelector((state) => state.agent?.agents);
  const selectedAgentId = useSelector((state) => state.agent?.selectedAgentId);
  const messages = useSelector((state) => state.chat?.messages || []);

  const agentsList = useMemo(
    () => (Array.isArray(reduxAgents) ? reduxAgents : []),
    [reduxAgents]
  );

  const [loadingAgents, setLoadingAgents] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [toast, setToast] = useState(null);
  const [toastClosing, setToastClosing] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false });

  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const lastScrollTopRef = useRef(0);
  const chatEndRef = useRef(null);
  const hasSentMessageRef = useRef(false);
  const shownToastKeyRef = useRef(null);
  const hasFetchedAgentsRef = useRef(false);
  const closeToastTimerRef = useRef(null);

  const activeAgent = useMemo(() => {
    if (!selectedAgentId || !agentsList.length) return null;
    return (
      agentsList.find(
        (a) => String(getAgentId(a)) === String(selectedAgentId)
      ) || null
    );
  }, [agentsList, selectedAgentId]);

  const activeAgentName = activeAgent?.name || "Direct LLM";
  const activeAgentTools = Array.isArray(activeAgent?.tools)
    ? activeAgent.tools.map(formatToolLabel)
    : [];

  const menuContent =
    "rounded-2xl border border-white/10 bg-[#1d2026]/95 p-1.5 text-zinc-100 shadow-2xl shadow-black/50 backdrop-blur-xl";

  const menuItem =
    "flex items-center gap-2.5 rounded-xl py-2.5 text-zinc-300 focus:bg-white/10 focus:text-white";

  const menuSeparator = "bg-white/10";
  const iconBtn =
    "size-9 rounded-xl border border-white/10 bg-white/[0.05] p-0 text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95";

  const fetchUserAgents = useCallback(async () => {
    setLoadingAgents(true);
    try {
      const result = await getAllAgent();
      const list = result?.agent ?? result?.agents ?? result ?? [];
      dispatch(setAgents(Array.isArray(list) ? list : []));
    } catch {
      // Keep existing state if fetch fails
    } finally {
      setLoadingAgents(false);
    }
  }, [dispatch, getAllAgent]);

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
    if (hasFetchedAgentsRef.current || agentsList.length > 0) return;
    hasFetchedAgentsRef.current = true;
    fetchUserAgents();
  }, [fetchUserAgents, agentsList.length]);

  useEffect(() => {
    const stateAgentId =
      location.state?.selectedAgentId ||
      getAgentId(location.state?.selectedAgent);

    if (stateAgentId) {
      dispatch(setSelectedAgentId(stateAgentId));
    }
  }, [location.state, dispatch]);

  useEffect(() => {
    const incomingToast = location.state?.toast;
    if (!incomingToast?.title) return;

    const toastKey =
      incomingToast.id ??
      `${incomingToast.title}-${incomingToast.description || ""}`;
    if (shownToastKeyRef.current === toastKey) return;
    shownToastKeyRef.current = toastKey;

    if (closeToastTimerRef.current) {
      clearTimeout(closeToastTimerRef.current);
      closeToastTimerRef.current = null;
    }

    setToastClosing(false);
    setToast(incomingToast);

    const { toast: _ignored, ...restState } = location.state || {};
    navigate(location.pathname, {
      replace: true,
      state: Object.keys(restState).length ? restState : null,
    });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!toast) return;

    const closeTimer = setTimeout(() => {
      setToastClosing(true);
    }, 3500);

    const removeTimer = setTimeout(() => {
      setToast(null);
      setToastClosing(false);
    }, 3760);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(removeTimer);
    };
  }, [toast]);

  useEffect(() => {
    return () => {
      if (closeToastTimerRef.current) clearTimeout(closeToastTimerRef.current);
    };
  }, []);

  function handleCloseToast() {
    setToastClosing(true);
    if (closeToastTimerRef.current) clearTimeout(closeToastTimerRef.current);
    closeToastTimerRef.current = setTimeout(() => {
      setToast(null);
      setToastClosing(false);
    }, 260);
  }

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
          maxScroll > 0 ? Math.min(currentY / maxScroll, 1) : 0
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

  useEffect(() => {
    if (!hasSentMessageRef.current) return;
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages.length, isSending]);

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
      dispatch(setUser(result?.user || null));
      dispatch(clearAgents());
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setUser(null));
      dispatch(clearAgents());
    }
  }

  const selectAgent = reduxAgents.find((agent) => agent._id === selectedAgentId);


  const sendMessage = async (rawText) => {
    const clean = rawText.trim();
    if (!clean || isSending) return;

    hasSentMessageRef.current = true;
    setIsSending(true);
    setPrompt("");

    dispatch(setNewMessage({ role: "user", context: clean }));

    try {
      const payload = selectedAgentId
        ? { message: clean, agentId: selectedAgentId }
        : { message: clean };
      if (!selectAgent) {
        const result = await chat(payload);
        dispatch(
          setNewMessage({
            role: "assistant",
            context:
              result?.aiMessage || result?.message || "Something went wrong..!",
          })
        );
      }else{
         const result = await agentChat(clean, selectAgent.name);
        dispatch(
          setNewMessage({
            role: "assistant",
            context: result.aiMessage || "Something went wrong..!",
          }),
        );
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to get a response from the assistant.";
      dispatch(
        setNewMessage({
          role: "assistant",
          context: errMsg,
        })
      );
    } finally {
      setIsSending(false);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(prompt);
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

        @keyframes toastSlideInRight {
          0% {
            opacity: 0;
            transform: translate3d(28px, 0, 0) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes toastSlideOutRight {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate3d(28px, 0, 0) scale(0.98);
          }
        }

        .animate-toast-in-right {
          animation: toastSlideInRight 340ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .animate-toast-out-right {
          animation: toastSlideOutRight 260ms cubic-bezier(0.4, 0, 1, 1) forwards;
        }
      `}</style>

      {/* Top Scroll Progress Bar */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/[0.06]">
        <div
          className="h-full origin-left bg-gradient-to-r from-zinc-400 via-white to-zinc-300 shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-transform duration-75 ease-out"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* Ambient Glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-[-120px] h-[340px] w-[620px] -translate-x-1/2 animate-pulse rounded-full bg-white/[0.04] blur-3xl"
      />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]"
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col pl-2">
        {/* Auto-Hiding Glass Header */}
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
              to="/"
              className="group flex items-center gap-1 rounded-xl py-1 pr-2 transition-colors"
            >
              <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl">
                <img
                  src={Logo}
                  alt="Cortexa"
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
              to="/agent/new"
              className="group hidden items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-zinc-200 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95 sm:inline-flex"
            >
              <Plus
                size={14}
                className="transition-transform duration-200 group-hover:rotate-90"
              />
              <span>New Agent</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Open workflows menu"
                    className={`${iconBtn} cursor-pointer`}
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
                  className={`${menuItem} cursor-pointer`}
                  render={<Link to="/agents" />}
                >
                  <Bot strokeWidth={3} className="size-4" />
                  <span>My Agent</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={menuSeparator} />

                <DropdownMenuItem
                  className={`${menuItem} cursor-pointer`}
                  render={<Link to="/agent/new" />}
                >
                  <Plus strokeWidth={3} className="size-4" />
                  <span>Create New Agent</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={`${menuItem} cursor-pointer`}
                  render={<Link to="/integration" />}
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
                    className="flex size-9 w-fit cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-0 text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95"
                  />
                }
              >
                {user?.profilePicture ? (
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
                      {user?.name || "User"}
                    </p>
                    <p className="truncate text-sm text-zinc-400">
                      {user?.email || ""}
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

        {/* Scrollable Workspace Content */}
        <main
          ref={mainRef}
          className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col justify-between gap-5 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8"
        >
          <div className="space-y-6">
            {/* Hero Spotlight Banner */}
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
                    <Sparkles size={12} className="text-violet-300" />
                    <span>
                      {user?.name
                        ? `Welcome back, ${user.name}`
                        : "Cortexa AI Workspace"}
                    </span>
                  </div>
                  <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                    What can we automate today?
                  </h1>
                  <p className="mt-1.5 text-sm text-zinc-400">
                    Choose an agent below or chat directly with Cortexa AI.
                  </p>
                </div>

                <div className="relative z-10 shrink-0 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 transition-all duration-300">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                    Active Mode
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white">
                    {activeAgentName}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {activeAgent
                      ? activeAgentTools.length
                        ? activeAgentTools.join(" • ")
                        : "No tools selected"
                      : "General AI Assistant"}
                  </p>
                </div>
              </section>
            </ModernReveal>

            {/* Agent Cards Grid + Direct LLM Option */}
            <ModernReveal rootRef={mainRef} delay={60} y={22} blur={6}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-zinc-400">
                    Select an Agent
                  </p>
                  <button
                    type="button"
                    onClick={() => dispatch(setSelectedAgentId(null))}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                      !selectedAgentId
                        ? "border-violet-400/40 bg-violet-500/20 text-white"
                        : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Sparkles size={13} className="text-violet-300" />
                    <span>Direct LLM</span>
                  </button>
                </div>

                {loadingAgents && agentsList.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-xs text-zinc-400">
                    <Loader2 size={15} className="animate-spin" />
                    <span>Loading your agents...</span>
                  </div>
                ) : agentsList.length > 0 ? (
                  <section className="grid gap-3 sm:grid-cols-3">
                    {agentsList.map((agent, idx) => {
                      const id = getAgentId(agent) || `agent-${idx}`;
                      return (
                        <AgentTiltCard
                          key={id}
                          agent={agent}
                          isSelected={
                            String(getAgentId(activeAgent)) === String(id)
                          }
                          onSelect={() => dispatch(setSelectedAgentId(id))}
                        />
                      );
                    })}
                  </section>
                ) : (
                  <div
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 text-xs ${darkPanel}`}
                  >
                    <span className="text-zinc-400">
                      You haven&apos;t created any custom agents yet.
                    </span>
                    <Link
                      to="/agent/new"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-100"
                    >
                      <Plus size={14} />
                      <span>Create Agent</span>
                    </Link>
                  </div>
                )}
              </div>
            </ModernReveal>

            {/* Starter Prompts (Shown when chat is empty) */}
            {messages.length === 0 && (
              <ModernReveal rootRef={mainRef} delay={60} y={20} blur={5}>
                <section className="space-y-2">
                  <p className="text-xs font-medium text-zinc-400">
                    Try a starter prompt
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {STARTER_PROMPTS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => sendMessage(item)}
                        className="group flex cursor-pointer items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-left text-xs text-zinc-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white active:scale-[0.985]"
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
            )}

            {/* Live Chat Messages Feed */}
            {messages.length > 0 && (
              <ModernReveal rootRef={mainRef} delay={40} y={16} blur={4}>
                <section className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:p-5">
                  {messages.map((msg, idx) => (
                    <div
                      key={msg._id || msg.id || idx}
                      className={`animate-msg-pop flex  ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[100%] rounded-2xl px-4 py-3 text-xs leading-relaxed sm:text-sm ${
                          msg.role === "user"
                            ? "bg-white font-medium text-zinc-950 shadow-[0_6px_24px_rgba(255,255,255,0.14)]"
                            : " text-zinc-200"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <>
                            <p className="mb-1.5 text-[11px] font-medium text-zinc-400">
                              {activeAgentName}
                            </p>
                            <MarkdownMessage content={msg.context} />
                          </>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.context}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {isSending && (
                    <div className="animate-msg-pop flex justify-start">
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs text-zinc-300">
                        <Loader2 size={14} className="animate-spin" />
                        <span>{activeAgentName} is thinking...</span>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </section>
              </ModernReveal>
            )}
          </div>

          {/* Sticky Chat Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="group/bar sticky bottom-0 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#181a20]/90 p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 focus-within:border-white/25 focus-within:shadow-[0_0_28px_rgba(255,255,255,0.06)]"
          >
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isSending}
              placeholder={`Message ${activeAgentName}...`}
              className="h-10 flex-1 border-0 bg-transparent text-sm text-white placeholder:text-zinc-500 focus-visible:ring-0"
            />
            <Button
              type="submit"
              disabled={!prompt.trim() || isSending}
              className="group/send h-10 cursor-pointer rounded-xl bg-white px-4 text-xs font-semibold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              ) : (
                <Send
                  size={14}
                  className="mr-1.5 transition-transform duration-200 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5"
                />
              )}
              <span>{isSending ? "Sending" : "Send"}</span>
            </Button>
          </form>
        </main>
      </div>

      {/* Animated Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-4 top-20 z-[9999] flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-400/30 bg-[#181b22]/95 px-4 py-3 text-white shadow-[0_18px_45px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:right-6 sm:top-20 ${
            toastClosing ? "animate-toast-out-right" : "animate-toast-in-right"
          }`}
        >
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border border-emerald-400/25 bg-emerald-400/15 text-emerald-300">
            <Check size={14} strokeWidth={3} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-xs text-zinc-400">
                {toast.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleCloseToast}
            aria-label="Close notification"
            className="rounded-lg p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
