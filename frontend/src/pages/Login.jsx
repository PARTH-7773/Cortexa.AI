import { LoginForm } from "@/components/login-form";
import { Workflow } from "lucide-react";
import Logo from "@/assets/Orbiting Circuit C Emblem.png";

function Login() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#2B2F3a_0%,#191b21_55%,#121317_100%)] px-4 pt-12 text-white">
      <aria-hidden className="pointer-events-none absolute inset-0 bg[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[-420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[140px]" />

      <div className="relative z-10 w-full max-w-lg">
        {/* <div className="mb-5 flex flex-col items-center text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-white text-zinc-900 shadow-[0_10px_40px_rgba(255,255,255,0.12)]">
            <Workflow size={26} />
          </div>
          <p className="mt-2 text-[1rem] font-medium tracking-tight text-zinc-200">
            Automate AI
          </p>
        </div> */}
        <div className="mb-5 flex flex-col justify-center items-center place-items-center text-center">
          <div className="grid size-14 place-items-center">
            <span className="group relative grid size-15 shrink-0 place-items-center overflow-hidden rounded-xl">
              <img
                src={Logo}
                alt="Automation AI"
                className="size-5 h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-95 group-hover:animate-spin group-hover:shadow-[0_10px_40px_rgba(255,255,255,0.09)] rounded-full group-active:scale-110"
              />
            </span>
          </div>
          <p className="mt-1 ml-2 text-[1rem] font-medium text-zinc-200 group">
            <span className="font-brand text-xl tracking-widest text-zinc-100 transition-colors duration-300 ease-in-out group-hover:scale-110">
              Cortexa
            </span>
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-9">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
