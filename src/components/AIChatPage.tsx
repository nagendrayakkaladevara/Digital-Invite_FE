"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, Send, Sparkles, Plus, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { sendChatMessage, type ChatModel } from "@/lib/marriageApi";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const DEFAULT_MODEL: ChatModel = "sarvam-m";

const MODEL_OPTIONS: { value: ChatModel; label: string }[] = [
  { value: "gemini-3-flash-preview", label: "Gemini" },
  { value: "sarvam-m", label: "Sarvam" },
];

const WELCOME_ITEMS = [
  { icon: "📍", title: "Venue & Directions", desc: "Easy navigation and the best ways to reach the wedding venue." },
  { icon: "🗓️", title: "Events", desc: "Pellikoduku, March 7th lunch, Pelli muhurtham timings & every special moment." },
  { icon: "🚗", title: "Travel Help", desc: "Smart routes from Hyderabad, Bangalore, Chennai, Vizag & Vijayawada." },
  { icon: "💬", title: "Just ask anything", desc: "I'm here to help you celebrate with ease and excitement." },
];

const markdownStyles = `
  .ai-chat-markdown h1 { @apply text-base font-semibold mt-4 mb-2 first:mt-0 text-neutral-900; }
  .ai-chat-markdown h2 { @apply text-[15px] font-semibold mt-3 mb-2 first:mt-0 text-neutral-900; }
  .ai-chat-markdown h3 { @apply text-sm font-medium mt-2 mb-1 text-neutral-800; }
  .ai-chat-markdown p { @apply text-[15px] leading-[1.6] mb-3 last:mb-0 text-neutral-700; }
  .ai-chat-markdown ul { @apply list-disc pl-5 mb-3 space-y-1; }
  .ai-chat-markdown ol { @apply list-decimal pl-5 mb-3 space-y-1; }
  .ai-chat-markdown li { @apply text-[15px] text-neutral-700 leading-relaxed; }
  .ai-chat-markdown strong { @apply font-semibold text-neutral-900; }
  .ai-chat-markdown em { @apply italic; }
  .ai-chat-markdown code { @apply bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded text-[13px] font-mono border border-neutral-200; }
  .ai-chat-markdown pre { @apply bg-neutral-50 border border-neutral-200 p-4 rounded-lg overflow-x-auto text-[13px] mb-3; }
  .ai-chat-markdown pre code { @apply bg-transparent p-0 border-0; }
  .ai-chat-markdown blockquote { @apply border-l-4 border-neutral-300 pl-4 my-3 text-neutral-600 italic; }
  .ai-chat-markdown a { @apply text-neutral-600 underline underline-offset-2 hover:text-neutral-700; }
  .ai-chat-markdown table { @apply w-full text-sm border-collapse mb-3; }
  .ai-chat-markdown th, .ai-chat-markdown td { @apply border border-neutral-200 px-3 py-2 text-left; }
  .ai-chat-markdown th { @apply bg-neutral-50 font-medium text-neutral-800; }
`;

interface AIChatPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  isStandalone?: boolean;
  onCloseNavigate?: string;
}

export default function AIChatPage({
  isOpen = false,
  onClose,
  isStandalone = false,
  onCloseNavigate = "/",
}: AIChatPageProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<ChatModel>(DEFAULT_MODEL);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const showChat = isStandalone || isOpen;
  const handleClose = () => {
    if (isStandalone && onCloseNavigate) {
      navigate(onCloseNavigate);
    } else {
      onClose?.();
    }
  };


  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const result = await sendChatMessage(model, text);

    if (result.ok) {
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } else {
      const errorContent =
        result.status === 0
          ? `**Connection error** — ${result.error}`
          : `**Error** — ${result.error}`;
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }
    setIsTyping(false);
  };

  if (!showChat) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex flex-col bg-white"
      >
        <style>{markdownStyles}</style>

        {/* ChatGPT-style header */}
        <motion.header
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-200/80 bg-white shrink-0"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-700">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-medium text-neutral-800 text-sm sm:text-base">Nagendra&apos;s AI</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isTyping}
                  className="gap-1.5 min-w-28 justify-between"
                  aria-label="Select AI model"
                >
                  {MODEL_OPTIONS.find((o) => o.value === model)?.label ?? model}
                  <ChevronDown className="h-4 w-4 opacity-50" strokeWidth={2} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>AI Model</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={model} onValueChange={(v) => setModel(v as ChatModel)}>
                    {MODEL_OPTIONS.map((opt) => (
                      <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setInput("");
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              aria-label="New chat"
            >
              <Plus className="h-5 w-5" />
            </button>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              aria-label={isStandalone ? "Back to invitation" : "Close chat"}
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.header>

        {/* Messages - ChatGPT layout: full-width, centered content, avatar for AI */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain bg-neutral-50/50 relative"
        >
          {/* Background welcome text when no messages */}
          {messages.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 py-6 pointer-events-none">
              <div className="max-w-md text-center space-y-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-neutral-700 tracking-tight">
                    Welcome to Nagendra&apos;s Wedding Assistant
                  </h2>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">
                    I&apos;m here to make your wedding journey smooth, joyful, and stress-free.
                  </p>
                </div>
                <ul className="space-y-2.5 text-left max-w-sm mx-auto">
                  {WELCOME_ITEMS.map((item, i) => (
                    <li key={i} className="flex gap-2.5 items-start">
                      <span className="shrink-0 text-[15px] leading-none mt-0.5 opacity-80" aria-hidden>{item.icon}</span>
                      <span className="text-[14px] text-neutral-600 leading-snug">
                        <span className="font-medium text-neutral-700">{item.title}</span>
                        {" "}
                        <span className="text-neutral-500">{item.desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-[13px] text-neutral-400 pt-1">
                  Type a message below to get started
                </p>
              </div>
            </div>
          )}
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-6 space-y-1">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={cn(
                  "flex gap-3 sm:gap-4 py-4 sm:py-5",
                  msg.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                {/* AI avatar - left side */}
                {msg.role === "assistant" && (
                  <div className="shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-neutral-700">
                    <Sparkles className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-white" strokeWidth={2.5} />
                  </div>
                )}
                {msg.role === "user" && (
                  <div className="shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-neutral-300">
                    <User className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-neutral-600" strokeWidth={2.5} />
                  </div>
                )}
                <div
                  className={cn(
                    "min-w-0 flex-1",
                    msg.role === "user"
                      ? "flex justify-end"
                      : ""
                  )}
                >
                  <div
                    className={cn(
                      msg.role === "user"
                        ? "inline-block max-w-[90%] rounded-2xl rounded-tr-md bg-neutral-200 px-4 py-2.5 text-[15px] text-neutral-900 leading-relaxed"
                        : "rounded-2xl rounded-tl-md bg-white border border-neutral-200/80 px-4 py-3 shadow-sm"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <div className="ai-chat-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator - ChatGPT style */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3 sm:gap-4 py-4 sm:py-5"
                >
                  <div className="shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-neutral-700">
                    <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="rounded-2xl rounded-tl-md bg-white border border-neutral-200/80 px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((j) => (
                        <motion.span
                          key={j}
                          className="h-2 w-2 rounded-full bg-neutral-400"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.2,
                            delay: j * 0.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ChatGPT-style input bar */}
        <div className="shrink-0 border-t border-neutral-200/80 bg-white px-4 sm:px-6 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-none border border-neutral-200 bg-white px-3 py-2 shadow-sm focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message Nagendra's AI..."
                className="flex-1 min-h-[44px] bg-transparent px-2 py-2 text-[15px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                disabled={isTyping}
              />
              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                  "bg-neutral-800 text-white",
                  "hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-800"
                )}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" strokeWidth={2.5} />
              </motion.button>
            </div>
            <p className="mt-2 text-center text-[11px] text-neutral-400">
              AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
