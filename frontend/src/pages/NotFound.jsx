import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/Orbiting Circuit C Emblem.png";

function NotFoundRadarIcon() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/90 shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
      {/* Pulsing radar ring */}
      <span className="animate-not-found-pulse absolute inset-2 rounded-xl border border-sky-300/20" />

      {/* Glass sweep highlight */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <span className="animate-scan-sweep block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-cyan-200/15 to-transparent" />
      </span>

      <svg
        viewBox="0 0 96 96"
        className="relative z-10 h-16 w-16 text-sky-200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Rotating outer broken orbit */}
        <g className="animate-orbit-spin">
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <circle cx="48" cy="12" r="3" fill="#67e8f9" />
        </g>

        {/* Disconnected signal arcs */}
        <path
          d="M32 36C36.4 31.6 42 29 48 29C54 29 59.6 31.6 64 36"
          stroke="#bae6fd"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M37.5 42C40.3 39.2 44 37.5 48 37.5C52 37.5 55.7 39.2 58.5 42"
          stroke="#a5f3fc"
          strokeOpacity="0.8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Center "404" broken node / slash */}
        <circle cx="48" cy="52" r="9" stroke="#e0e7ff" strokeWidth="2.5" />
        <path
          d="M36 64L60 40"
          stroke="#fda4af"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Subtle 404 corner tag inside icon */}
        <text
          x="48"
          y="78"
          textAnchor="middle"
          fill="#bae6fd"
          fillOpacity="0.85"
          fontSize="9"
          fontWeight="700"
          letterSpacing="2"
        >
          404
        </text>
      </svg>
    </div>
  );
}

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0e1015] px-4 text-white">
      {/* Ambient background glow */}
      <div className="animate-not-found-pulse pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/[0.06] blur-3xl" />

      <div className="animate-float-slow relative z-10 flex w-full max-w-md flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-xl">
        {/* Cortexa Brand Pill */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1">
          <img src={Logo} alt="Cortexa" className="h-4 w-4 object-contain" />
          <span className="text-[11px] font-medium tracking-wider text-sky-200/85 uppercase">
            Cortexa Studio
          </span>
        </div>

        {/* Custom Animated 404 Icon */}
        <NotFoundRadarIcon />

        {/* Light Sky-Cyan-Lavender Gradient 404 Display Number */}
        <h1 className="font-brand mt-5 bg-gradient-to-r from-amber-200 via-rose-200 to-violet-200 bg-clip-text text-6xl font-normal tracking-wider text-transparent select-none">
          404
        </h1>

        {/* Light Gradient Subtitle */}
        <h2 className="mt-1 bg-gradient-to-r from-cyan-100 via-sky-200 to-purple-200 bg-clip-text text-lg font-semibold text-transparent">
          Agent Route Not Found
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          The requested path or agent session doesn&apos;t exist or may have
          moved. Return to your workspace to keep building.
        </p>

        {/* Actions */}
        <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 cursor-pointer rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-200 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.08] active:translate-y-0"
          >
            Go Back
          </button>

          <Link
            to="/"
            className="flex-1 rounded-xl bg-gradient-to-r from-sky-200 via-cyan-200 to-indigo-200 px-4 py-2.5 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
          >
            Back to Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
