import {
  Bot,
  LogOut,
  Plus,
  Settings2,
  UserRound,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "@/features/auth/hooks/useAuth";
import { setError, setUser } from "@/features/auth/authSlice";
import Logo from "@/assets/Orbiting Circuit C Emblem.png";

function NewHome() {
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);

  const menuContent =
    "rounded-2xl border border-white/10 bg-[#1d2026]/95 p-1.5 text-zinc-100 shadow-2xl shadow-black/50 backdrop-blur-xl";

  const menuItem =
    "flex items-center gap-2.5 rounded-xl py-2.5 text-zinc-300 focus:bg-white/10 focus:text-white";

  const menuSeparator = "bg-white/10";
  const iconBtn =
    "size-9 rounded-xl border border-white/10 bg-white/[0.05] p-0 text-zinc-300 hover:bg-white/10 hover:text-white";

  const hideScrollbar =
    "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

  async function handleLogout() {
    try {
      const result = await logout();
      dispatch(setUser(result.user || null));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setUser(null));
    }
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#2b2f3a_0%,#191b21_55%,#121317_100%)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]"
      />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="z-30 flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
          <Link
            to={"/"}
            className="group flex items-center gap-1 rounded-xl py-1 px-2 xl:px-5 transition-colors"
          >
            <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl ">
              <img
                src={Logo}
                alt="CORTEXA"
                className="size-5 h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-95"
              />
            </span>

            <span className="font-brand text-xl tracking-widest text-zinc-100 transition-colors duration-200 group-hover:text-white">
              Cortexa
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Workflows & Agents Dropdown */}
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

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Open profile menu"
                    className="flex size-9 w-fit items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-0 text-zinc-300 hover:bg-white/10 hover:text-white"
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
                      {user?.name || "user"}
                    </p>
                    <p className="truncate text-sm text-zinc-400">
                      {user?.email}
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

        <main className="flex min-h-0 flex-1 flex-col">
          <section className="flex min-h-0 flex-1 flex-col">
            <div className={`min-h-0 flex-1 overflow-y-auto ${hideScrollbar}`}>
              <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-5 py-8 sm:px-6">
                {messages.length < 1 && (
                  <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
                    <div className="mb-2 grid size-20 place-items-center">
                      <img
                        src={Logo}
                        alt="CORTEXA"
                        className="size-5 h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-95"
                      />
                    </div>
                    <p className="text-base text-violet-300/80">
                      Hi, {user.name || "User"}
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                      Can i help you with anything?
                    </h1>
                    <p className="mt-4 max-w-sm text-xs leading-5 text-zinc-500">
                      Ask questions, automate tasks, or upload an image to
                      prepare an Instagram post.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default NewHome;
