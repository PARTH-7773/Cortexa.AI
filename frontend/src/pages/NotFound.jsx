import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/Orbiting Circuit C Emblem.png";

function NotFoundRadarIcon() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-rose-300/20 bg-black/90 shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
      {/* Pulsing radar ring */}
      <span className="animate-not-found-pulse absolute inset-2 rounded-xl border border-rose-300/20" />

      {/* Glass sweep highlight */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <span className="animate-scan-sweep block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-rose-200/15 to-transparent" />
      </span>

      <svg
        viewBox="0 0 96 96"
        className="relative z-10 h-16 w-16 text-rose-200"
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
          <circle cx="48" cy="12" r="3" fill="#fda4af" />
        </g>

        {/* Disconnected signal arcs */}
        <path
          d="M32 36C36.4 31.6 42 29 48 29C54 29 59.6 31.6 64 36"
          stroke="#fecdd3"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M37.5 42C40.3 39.2 44 37.5 48 37.5C52 37.5 55.7 39.2 58.5 42"
          stroke="#fda4af"
          strokeOpacity="0.85"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Center "404" broken node / slash */}
        <circle cx="48" cy="52" r="9" stroke="#fed7aa" strokeWidth="2.5" />
        <path
          d="M36 64L60 40"
          stroke="#fb7185"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Subtle 404 corner tag inside icon */}
        <text
          x="48"
          y="78"
          textAnchor="middle"
          fill="#fecdd3"
          fillOpacity="0.9"
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
      {/* Soft rose/amber ambient error glow */}
      <div className="animate-not-found-pulse pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400/[0.06] blur-3xl" />

      {/* Open centered layout (no card box) */}
      <div className="animate-float-slow relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        {/* Cortexa Brand Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-300/15 bg-black/50 px-3.5 py-1.5 backdrop-blur-md">
          <img src={Logo} alt="Cortexa" className="h-4 w-4 object-contain" />
          <span className="text-[11px] font-medium tracking-wider text-rose-200/85 uppercase">
            Cortexa Studio
          </span>
        </div>

        {/* Custom Animated 404 Icon */}
        <NotFoundRadarIcon />

        {/* Light Error Gradient 404 Display Number */}
        <h1 className="font-brand mt-6 bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 bg-clip-text text-7xl font-normal tracking-wider text-transparent select-none sm:text-8xl">
          404
        </h1>

        {/* Light Error Gradient Subtitle */}
        <h2 className="mt-2 bg-gradient-to-r from-rose-100 via-rose-200 to-orange-200 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          Agent Route Not Found
        </h2>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
          The requested path or agent session doesn&apos;t exist or may have
          moved. Return to your workspace to keep building.
        </p>

        {/* Actions */}
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:max-w-sm sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 cursor-pointer rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-zinc-200 transition duration-200 hover:-translate-y-0.5 hover:border-rose-300/35 hover:bg-white/[0.08] active:translate-y-0"
          >
            Go Back
          </button>

          <Link
            to="/"
            className="flex-1 rounded-xl bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 px-5 py-2.5 text-sm font-semibold text-rose-950 transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
          >
            Back to Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
