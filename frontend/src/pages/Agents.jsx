import {
  removeAgent,
  setAgentError,
  setAgentLoading,
  setAgents,
  setSelectedAgentId,
} from "@/features/agent/agentSlice";
import useAgent from "@/features/agent/hooks/useAgent";
import { Button, Input } from "@base-ui/react";
import {
  ArrowLeft,
  Bot,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Trash,
  Workflow,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "@/assets/Orbiting Circuit C Emblem.png";

const darkPanel =
  "border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl";
const whiteBtn =
  "rounded-xl border-0 bg-white text-zinc-900 hover:bg-zinc-200 hover:text-zinc-900";

function Agents() {
  const { deleteAgent } = useAgent();
  const dispatch = useDispatch();
  const [headerHidden, setHeaderHidden] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [search, setSearch] = useState("");
  const { agents } = useSelector((state) => state.agent);
  const { loading } = useSelector((state) => state.agent);

  const mainRef = useRef(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      console.log("hello");
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

  const filteredAgents = agents.filter((agent) => {
    const query = search.trim().toLowerCase();
    return (
      agent?.name?.toLowerCase().includes(query) ||
      agent?.instructions?.toLowerCase().includes(query) ||
      agent?.knowledgeBase?.toLowerCase().includes(query)
    );
  });

  const handleDeleteAgent = async (id) => {
    try {
      await deleteAgent(id);
      dispatch(removeAgent(id));
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.statusText ||
        error?.message ||
        "Failed to delete agent";
      dispatch(setAgentError(message));
    }
  };

  return (
    <div className="h-screen min-w-screen overflow-auto bg-[#121317] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#2b2f3a_0%,#191b21_55%,#121317_100%)] text-white">
      <header
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`sticky top-0 z-50  flex shrink-0 items-center justify-between gap-2 transition-all duration-300 will-change-transform ${
          headerHidden
            ? "pointer-events-none -translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        } ${
          scrollY > 20
            ? "h-14 border-b border-white/[0.09] bg-[#16181d]/80 px-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6"
            : "h-16 border-b border-white/[0.06] bg-transparent px-3 sm:px-6"
        }`}
      >
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 ">
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

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 z-0">
          <Link
            to={"/"}
            className="group flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2 text-[11px] text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/[0.1] hover:text-white active:scale-95 sm:gap-1.5 sm:px-3 sm:text-xs"
          >
            <ArrowLeft
              size={13}
              className="shrink-0 transition-transform duration-200 ease-out group-hover:-translate-x-1 sm:size-3.5"
            />
            <span>Back to chat</span>
          </Link>

          <Link
            to={"/agent/new"}
            className="group flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl bg-white px-2.5 py-2 text-[11px] font-semibold text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-200 hover:bg-zinc-100 active:scale-95 sm:gap-1.5 sm:px-3.5 sm:text-xs"
          >
            <Plus
              size={13}
              className="shrink-0 transition-transform duration-200 group-hover:rotate-90 sm:size-3.5"
            />
            <span>New Agent</span>
          </Link>
        </div>
      </header>

      <main
        ref={mainRef}
        className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-violet-300/80">
              <Sparkles size={15} /> Agent Workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              My Agents
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Manage your AI agent and one to get started.
            </p>
          </div>

          <Button
            className={`group flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl px-2.5 py-2 font-medium sm:text-[15px] text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-200 active:scale-95 hover:border-white/25 sm:gap-1.5 sm:px-3.5 sm:text-xs ${whiteBtn} `}
          >
            <Link
              to={"/agent/new"}
              className="inline-flex items-center justify-center gap-1 w-full"
            >
              <Plus
                className="shrink-0 transition-transform duration-200 group-hover:rotate-90 sm:size-5"
                size={19}
              />
              <span>Create Agent</span>
            </Link>
          </Button>
        </div>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="absolute z-20 left-3 top-1/2 -translate-y-1/2 text-violet-300/80"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents..."
              className={
                "h-10 rounded-xl border-white/10 bg-white/[0.04] pl-9 text-white backdrop-blur-xl placeholder:text-zinc-500 focus-visible:border-white/25 focus-visible:ring-white/10"
              }
            />
          </div>

          <p className="text-xs text-zinc-500">{agents.length} Agents</p>
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-zinc-500">
            <RefreshCcw size={22} className="animate-spin text-zinc-300" />
            <p className="text-xs">Loading Your Agents</p>
          </div>
        ) : filteredAgents.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => {
              const agnetId = agent?._id;
              return (
                <div
                  key={agent._id}
                  className={`group flex min-h-56 flex-col rounded-2xl p-5 transition hover:border-white/25 hover:bg-white4/0.06] ${darkPanel}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid size-11 place-items-center rounded-xl bg-white text-zinc-900 shadow-[0_8px_24px_rgba(255,255,255,0.1)]">
                      <Bot />
                    </div>
                    <Button
                      onClick={() => handleDeleteAgent(agent?._id)}
                      on
                      className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    >
                      <Trash />
                    </Button>
                  </div>
                  <h2 className="mt-5 truncate text-base font-medium text-white">
                    {agent?.name || "untitle Agent"}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-zinc-500">
                    {agent?.instructions || "No instructions provided"}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
                    <span className="text-xs text-zinc-600">My Agents</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={
                        "h-8 gap-1.5 rounded-lg p-3 inline-flex justify-center text-zinc-300 hover:bg-white/10 hover:text-white"
                      }
                    >
                      <Link
                        to={"/"}
                        className="inline-flex items-center gap-1.5"
                        onClick={() => dispatch(setSelectedAgentId(agent?._id))}
                      >
                        <span>Use Agent</span>
                        <ArrowLeft size={16} className="rotate-180 shrink-0" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-5 text-center">
            <div className="grid size-12 place-items-center rounded-xl bg-white text-zinc-900 ">
              <Bot size={23} />
            </div>

            <h2 className="mt-4 text-base font-medium text-white">
              {search ? "No agents found" : "No agents yet"}
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              {search
                ? "Try searching with another name and keyword."
                : "Create your first AI agent to get started"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Agents;
