import { useEffect, useState } from "react";
import {
  Bot,
  Calculator,
  Check,
  Copy,
  FileText,
  Globe,
  Mail,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

function AgentDetailsModal({ agent, onClose, onSelectAgent, isSelected }) {
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (!agent) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [agent, onClose]);

  if (!agent) return null;

  const tools = Array.isArray(agent?.tools) ? agent.tools : [];
  const name = agent?.name || "Untitled Agent";
  const instructions = agent?.instructions || "No instructions configured.";
  const knowledgeBase = agent?.knowledgeBase || "No knowledge base provided.";
  const agentId = agent?._id || agent?.id || "";

  async function handleCopy(label, text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => {
        setCopiedField((prev) => (prev === label ? null : prev));
      }, 1800);
    } catch {
      // Clipboard API may be unavailable in restricted contexts
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-details-title"
      onClick={onClose}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70  p-4 backdrop-blur-md"
    >
      <style>{`
        @keyframes modalPopIn {
          0% {
            opacity: 0;
            transform: translate3d(0, 14px, 0) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .animate-modal-pop {
          animation: modalPopIn 280ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-pop flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#171920]/95 text-white shadow-[0_28px_80px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-zinc-950 shadow-[0_6px_24px_rgba(255,255,255,0.16)]">
              <Bot size={20} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="agent-details-title"
                  className="truncate text-lg font-semibold tracking-tight text-white"
                >
                  {name}
                </h2>
                {isSelected && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                    <Sparkles size={11} />
                    <span>Selected</span>
                  </span>
                )}
              </div>
              {agentId && (
                <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
                  ID: {agentId}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close agent details"
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          {/* Tools */}
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Wrench size={13} />
              <span>Configured Tools ({tools.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.length > 0 ? (
                tools.map((tool, idx) => {
                  const key = getToolKey(tool);
                  const label = formatToolLabel(tool);
                  return (
                    <span
                      key={`${key}-${idx}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-zinc-200"
                    >
                      {key.includes("search") && <Globe size={12} />}
                      {key.includes("calc") && <Calculator size={12} />}
                      {key.includes("gmail") && <Mail size={12} />}
                      <span>{label}</span>
                    </span>
                  );
                })
              ) : (
                <span className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-500">
                  No tools configured
                </span>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <FileText size={13} />
                <span>Instructions</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy("instructions", instructions)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                {copiedField === "instructions" ? (
                  <>
                    <Check size={12} className="text-emerald-300" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="max-h-44 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-3.5">
              <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-zinc-200 sm:text-sm">
                {instructions}
              </p>
            </div>
          </div>

          {/* Knowledge Base */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <FileText size={13} />
                <span>Knowledge Base</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy("knowledge", knowledgeBase)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                {copiedField === "knowledge" ? (
                  <>
                    <Check size={12} className="text-emerald-300" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-3.5">
              <pre className="whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-zinc-300 sm:text-sm">
                {knowledgeBase}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-white/10 bg-white/[0.02] px-5 py-3.5 sm:px-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-9 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            Close
          </Button>
          {onSelectAgent && (
            <Button
              type="button"
              onClick={() => {
                onSelectAgent(agent);
                onClose?.();
              }}
              className="h-9 rounded-xl bg-white px-4 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              {isSelected ? "Selected" : "Select Agent"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentDetailsModal;
