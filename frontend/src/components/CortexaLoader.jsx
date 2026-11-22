import Logo from "@/assets/Orbiting Circuit C Emblem.png";

export default function CortexaLoader({
  label = "Verifying session...",
  sublabel = "Securing your Cortexa workspace",
  fullScreen = true,
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#0e1015] px-4 text-white select-none ${
        fullScreen ? "min-h-screen w-full" : "min-h-[260px] w-full rounded-2xl"
      }`}
      role="status"
      aria-live="polite"
    >
      {/* Subtle ambient background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Orbital Emblem Spinner */}
        <div className="relative flex size-24 items-center justify-center">
          {/* Outer rotating dashed orbit ring */}
          <span className="animate-orbit-spin absolute inset-0 rounded-full border border-dashed border-white/25" />

          {/* Counter-rotating sleek arc */}
          <span
            className="animate-spin absolute inset-1.5 rounded-full border-2 border-transparent border-t-white/80 border-r-zinc-400/40"
            style={{ animationDuration: "1.6s" }}
          />

          {/* Core dark glass emblem badge */}
          <div className="relative grid size-14 place-items-center rounded-2xl border border-white/15 bg-black/90 p-2.5 shadow-[0_10px_28px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.14)]">
            <img
              src={Logo}
              alt="Cortexa"
              className="animate-pulse h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Brand + Status Copy */}
        <div className="mt-5 flex flex-col items-center text-center">
          <span className="font-brand bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-xl tracking-wide text-transparent">
            Cortexa
          </span>

          <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-zinc-200">
            <span>{label}</span>
            <span className="inline-flex gap-1">
              <span className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-zinc-300 [animation-delay:-0.15s]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-zinc-400" />
            </span>
          </div>

          {sublabel && (
            <p className="mt-1 text-xs tracking-wide text-zinc-500">
              {sublabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
