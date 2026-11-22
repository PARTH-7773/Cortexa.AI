import {
  ArrowUp,
  Bot,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer({ scrollContainerRef }) {
  const location = useLocation();
  const agents = useSelector((state) => state.agent?.agents);
  const totalAgents = Array.isArray(agents) ? agents.length : 0;

  const footerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      {
        root: scrollContainerRef?.current || null,
        threshold: 0.08,
        rootMargin: "0px 0px -12px 0px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollContainerRef]);

  const handleMouseMove = (e) => {
    const el = footerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  function handleScrollTop() {
    const scrollEl = scrollContainerRef?.current;
    if (scrollEl && typeof scrollEl.scrollTo === "function") {
      scrollEl.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const navLinks = [
    { to: "/", label: "Workspace", icon: Sparkles },
    { to: "/agents", label: "My Agents", icon: Bot },
    { to: "/agent/new", label: "New Agent", icon: Plus },
    { to: "/integration", label: "Integrations", icon: Settings2 },
  ];

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpotlight((prev) => ({ ...prev, active: false }))}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translate3d(0, 0, 0) scale(1)"
          : "translate3d(0, 18px, 0) scale(0.985)",
        transition:
          "opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), transform 650ms cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "opacity, transform",
      }}
      className="relative mt-auto w-full border-t border-white/[0.08] bg-[#14161b]/85 text-zinc-400 backdrop-blur-xl"
    >
      {/* Subtle Top Highlight Line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {/* Cursor Spotlight Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: spotlight.active ? 1 : 0,
          background: `radial-gradient(420px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,255,255,0.06), transparent 65%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          {/* Brand & Tagline */}
          <div className="space-y-2">
            <Link
              to={"/"}
              className="group inline-flex items-center gap-2.5 rounded-xl py-0.5 transition-colors"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-white text-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.14)] transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105">
                <Workflow
                  size={16}
                  className="transition-transform duration-300 group-hover:rotate-12"
                />
              </span>
              <span className="text-sm font-semibold tracking-tight text-white">
                Automation AI
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-zinc-400">
              Create, organize, and manage custom AI agent configurations in a
              unified workspace.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-2"
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "border-white/25 bg-white/10 text-white shadow-[0_0_16px_rgba(255,255,255,0.08)]"
                      : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <Icon
                    size={13}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-white/[0.07] pt-5 text-xs sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span>Agent CRUD Ready</span>
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-zinc-300">
              <Bot size={11} className="text-zinc-400" />
              <span>
                {totalAgents} {totalAgents === 1 ? "Agent" : "Agents"} Saved
              </span>
            </span>

            <span className="hidden items-center gap-1 text-[11px] text-zinc-500 md:inline-flex">
              <ShieldCheck size={12} />
              <span>Workspace Session Protected</span>
            </span>
          </div>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <p className="text-[11px] text-zinc-500">
              &copy; {new Date().getFullYear()} Automation AI
            </p>

            <button
              type="button"
              onClick={handleScrollTop}
              aria-label="Scroll back to top"
              className="group inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-medium text-zinc-300 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95"
            >
              <span>Back to top</span>
              <ArrowUp
                size={12}
                className="transition-transform duration-200 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
