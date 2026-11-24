import {
  ArrowUp,
  Bot,
  Check,
  ChevronDownIcon,
  ChevronUpIcon,
  ImagePlus,
  Loader2,
  LogOut,
  Plus,
  Settings2,
  Sparkles,
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
import { Textarea } from "@/components/ui/textarea";
import { clearAgents, setSelectedAgentId } from "@/features/agent/agentSlice";
import { useState } from "react";
import useChat from "@/features/chat/hooks/useChat";
import { setMessages, setNewMessage } from "@/features/chat/chatSlice";

function NewHome() {
  const { logout } = useAuth();
  const { chat } = useChat();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  const { agents, selectedAgentId } = useSelector((state) => state.agent);
  const [ChevronUp, setChevronUp] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const menuContent =
    "rounded-2xl border border-white/10 bg-[#1d2026]/95 p-1.5 text-zinc-100 shadow-2xl shadow-black/50 backdrop-blur-xl";

  const menuItem =
    "flex items-center gap-2.5 rounded-xl py-2.5 text-zinc-300 focus:bg-white/10 focus:text-white";

  const menuSeparator = "bg-white/10";
  const iconBtn =
    "size-9 rounded-xl border border-white/10 bg-white/[0.05] p-0 text-zinc-300 hover:bg-white/10 hover:text-white";

  const hideScrollbar =
    "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

  const darkPanel =
    "border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl";

  const handleInput = async (e) => {
    e.preventDefault();
    try {
      dispatch(setNewMessage({ role: "user", context: input.trim() }));
      const result = await chat({ message: input.trim() });
      setInput('');
      dispatch(
        setNewMessage({
          role: "assistant",
          context: result.aiMessage || "Something went wrong..!",
        })
      );
    } catch (error) {
      //
    }
  };

  async function handleLogout() {
    try {
      const result = await logout();
      dispatch(setUser(result.user || null));
      dispatch(clearAgents());
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setUser(null));
    } finally {
      dispatch(setUser(null));
      dispatch(clearAgents());
    }
  }
  const selectAgent = agents.find((agent) => agent._id === selectedAgentId);

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

          <div className="flex items-center gap-2 ">
            {/* Workflows & Agents Dropdown */}
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
                  render={<Link to={"/agents"} />}
                >
                  <Bot strokeWidth={3} className="size-4" />
                  <span>My Agent</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={`${menuSeparator}`} />

                <DropdownMenuItem
                  className={`cursor-pointer ${menuItem}`}
                  render={<Link to={"/agent/new"} />}
                >
                  <Plus strokeWidth={3} className="size-4" />
                  <span>Create New Agent</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={`cursor-pointer ${menuItem}`}
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
                    className="flex size-9 w-fit items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-0 text-zinc-300 hover:bg-white/10 hover:text-white "
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
                {messages.length === 0 && (
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

                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="mr-1 mt-2 ml-2 grid size-8 shrink-0 place-items-center rounded-lg bg-white text-zinc-900">
                        <Workflow size={15} />
                      </div>
                    )}

                    <div
                      className={`max-w-[90%] wrap-break-word px-4 py-3 text-sm leading-7 sm:max-w-[80%] ${
                        message.role === "user"
                          ? `rounded-2xl rounded-br-md text-white ${darkPanel}`
                          : "text-zinc-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.context}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="z-20 w-full shrink-0 px-3 pb-3 pt-2 sm:px-5 sm:pb-4">
              <form
                className={`mx-auto w-full max-w-2xl rounded-2xl px-3 transition-colors focus-within:border-white/25 ${darkPanel} pb-1`}
              >
                <Textarea
                  placeholder={"Ask me anything.."}
                  className={`min-h-20 resize-none border-0 bg-transparent! px-3 py-4 text-sm text-white shadow-none placeholder:text-zinc-500 focus-visible:ring-0 ${hideScrollbar}`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />

                <div className="flex items-center justify-between gap-3 pt-2 pb-1.5 px-1">
                  <div className="fles min-w-0 items-center gap-2">
                    <Button
                      type="button"
                      varient="ghost"
                      aria-label="Attech image"
                      title="Attech image"
                      className={`size-8 cursor-pointer rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white mr-1 h-8`}
                    >
                      <ImagePlus size={17} className="size-5" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 cursor-pointer max-w-48 gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                          />
                        }
                        onClick={() => setChevronUp(!ChevronUp)}
                      >
                        {selectAgent ? (
                          <Bot className="size-4.5 shrink-0" />
                        ) : (
                          <Sparkles className="size-3.5 shrink-0 text-violet-300" />
                        )}
                        <span className="truncate text-[.8rem]">
                          {selectAgent?.name || "Direct LLM"}
                        </span>
                        {ChevronUp ? (
                          <ChevronUpIcon
                            strokeWidth={3}
                            className="transition-all ease-in-out duration-300"
                          />
                        ) : (
                          <ChevronDownIcon
                            strokeWidth={3}
                            className="transition-all ease-in-out duration-300"
                          />
                        )}
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        className={`w-56 ${menuContent}`}
                      >
                        {/* Direct LLM (No Agent) Option */}
                        <DropdownMenuItem
                          onClick={() => dispatch(setSelectedAgentId(null))}
                          className={`${menuItem} justify-between cursor-pointer`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Sparkles className="size-4 text-violet-300" />
                            <span>Direct LLM</span>
                          </div>
                          {!selectedAgentId && (
                            <Check className="size-4 text-white" />
                          )}
                        </DropdownMenuItem>

                        {agents.length > 0 && (
                          <DropdownMenuSeparator className={menuSeparator} />
                        )}

                        {/* User Agents List */}
                        {agents.map((agent) => {
                          const id = agent._id || agent.id;
                          const isSelected =
                            String(id) === String(selectedAgentId);

                          return (
                            <DropdownMenuItem
                              key={id}
                              onClick={() => dispatch(setSelectedAgentId(id))}
                              className={`${menuItem} justify-between cursor-pointer`}
                            >
                              <div className="flex min-w-0 items-center gap-2.5">
                                <Bot className="size-4 shrink-0" />
                                <span className="truncate">{agent.name}</span>
                              </div>
                              {isSelected && (
                                <Check className="size-4 shrink-0 text-white" />
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                        <DropdownMenuSeparator className={menuSeparator} />
                        <DropdownMenuItem
                          className={`${menuItem} cursor-pointer text-zinc-200`}
                          render={<Link to="/agent/new" />}
                        >
                          <Plus
                            strokeWidth={2.5}
                            className="size-4 text-violet-300"
                          />
                          <span>Create New Agent</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Button
                    type="submit"
                    disabled={!input?.trim() || isSending}
                    aria-label="Send message"
                    onClick={(e) => handleInput(e)}
                    className="size-8 shrink-0 rounded-lg border border-violet-400/30 bg-violet-500/20 p-0 text-violet-200 transition hover:border-violet-400/50 hover:bg-violet-500/30 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.04] disabled:text-zinc-500"
                  >
                    {isSending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ArrowUp className="size-4" strokeWidth={2.5} />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default NewHome;
