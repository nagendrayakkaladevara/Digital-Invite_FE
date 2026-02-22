"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowUp,
  Sparkles,
  RotateCcw,
  ChevronDown,
  ArrowLeft,
  MapPin,
  Calendar,
  Car,
  MessageCircle,
} from "lucide-react";
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

const MODEL_OPTIONS: { value: ChatModel; label: string; desc: string }[] = [
  { value: "gemini-3-flash-preview", label: "Gemini", desc: "Fast & capable" },
  { value: "sarvam-m", label: "Sarvam", desc: "Multilingual" },
];

const SUGGESTION_PROMPTS = [
  {
    icon: MapPin,
    title: "Venue & Directions",
    prompt: "How do I reach the wedding venue? What are the best directions?",
  },
  {
    icon: Calendar,
    title: "Events",
    prompt: "What are the wedding event timings and schedule?",
  },
  {
    icon: Car,
    title: "Travel Help",
    prompt: "What are the best travel routes from Hyderabad to the venue?",
  },
  {
    icon: MessageCircle,
    title: "Ask Anything",
    prompt: "Tell me everything I need to know about the wedding celebrations!",
  },
];

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showChat = isStandalone || isOpen;

  const handleClose = () => {
    if (isStandalone && onCloseNavigate) {
      navigate(onCloseNavigate);
    } else {
      onClose?.();
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [input, resizeTextarea]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: msg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const result = await sendChatMessage(model, msg);

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

  const hasMessages = messages.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex flex-col bg-white"
      >
        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center justify-between px-3 sm:px-5 h-[52px] shrink-0 border-b border-neutral-100"
        >
          {/* Left: Back */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleClose}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors rounded-lg px-2 py-1.5 hover:bg-neutral-50"
            aria-label="Back to invitation"
          >
            <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2} />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </motion.button>

          {/* Center: Model selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={isTyping}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
                  "text-neutral-800 hover:bg-neutral-50",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-300"
                )}
              >
                <span className="text-[15px] font-semibold tracking-[-0.01em]">
                  Nagendra&apos;s AI
                </span>
                <ChevronDown
                  className="h-3.5 w-3.5 opacity-40"
                  strokeWidth={2.5}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              sideOffset={8}
              className="w-52 bg-white border-neutral-200 text-neutral-800 rounded-xl shadow-lg shadow-neutral-200/60"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium px-3 pt-2 pb-1">
                  Model
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={model}
                  onValueChange={(v) => setModel(v as ChatModel)}
                >
                  {MODEL_OPTIONS.map((opt) => (
                    <DropdownMenuRadioItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-lg mx-1 px-3 py-2 text-sm cursor-pointer focus:bg-neutral-50 focus:text-neutral-900 data-[state=checked]:text-neutral-900"
                    >
                      <div>
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {opt.desc}
                        </div>
                      </div>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Right: New chat */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setMessages([]);
              setInput("");
            }}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors rounded-lg px-2 py-1.5 hover:bg-neutral-50"
            aria-label="New chat"
          >
            <RotateCcw className="h-[18px] w-[18px]" strokeWidth={2} />
            <span className="text-sm font-medium hidden sm:inline">New</span>
          </motion.button>
        </motion.header>

        {/* ── Chat area ── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain bg-neutral-50/40"
        >
          {/* Welcome screen */}
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center min-h-full px-4 sm:px-6 py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center max-w-lg w-full"
              >
                {/* Glowing icon */}
                <div className="relative mb-6">
                  <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-20"
                    style={{
                      background:
                        "radial-gradient(circle, #c9956b 0%, transparent 70%)",
                      transform: "scale(2.5)",
                    }}
                  />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c9956b] to-[#a67c52] shadow-lg shadow-[#c9956b]/15">
                    <Sparkles
                      className="h-7 w-7 text-white"
                      strokeWidth={1.8}
                    />
                  </div>
                </div>

                <h1 className="text-[22px] sm:text-[26px] font-semibold text-neutral-800 tracking-[-0.02em] text-center mb-2">
                  How can I help you?
                </h1>
                <p className="text-[14px] sm:text-[15px] text-neutral-400 text-center max-w-sm leading-relaxed mb-10">
                  Your personal wedding assistant for Sai Nagendra &amp; Sushma&apos;s
                  celebration
                </p>

                {/* Suggestion cards grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-md">
                  {SUGGESTION_PROMPTS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.15 + i * 0.08,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        onClick={() => handleSend(item.prompt)}
                        className={cn(
                          "group flex flex-col items-start gap-2 p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200",
                          "bg-white hover:bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300",
                          "shadow-sm hover:shadow-md",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                        )}
                      >
                        <Icon
                          className="h-[18px] w-[18px] text-neutral-400 group-hover:text-[#b07d4f] transition-colors"
                          strokeWidth={1.8}
                        />
                        <span className="text-[13px] sm:text-[14px] font-medium text-neutral-600 group-hover:text-neutral-800 transition-colors leading-snug">
                          {item.title}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}

          {/* Messages */}
          {hasMessages && (
            <div className="mx-auto w-full max-w-[720px] px-4 sm:px-6 py-4 sm:py-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    "mb-5 sm:mb-6",
                    msg.role === "user" ? "flex justify-end" : ""
                  )}
                >
                  {msg.role === "user" ? (
                    /* User message — right-aligned bubble */
                    <div className="max-w-[85%] sm:max-w-[75%]">
                      <div className="inline-block rounded-3xl rounded-br-lg bg-neutral-100 px-4 sm:px-5 py-2.5 sm:py-3">
                        <p className="text-[15px] text-neutral-800 leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* AI message — full width, avatar */
                    <div className="flex gap-3 sm:gap-4">
                      <div className="shrink-0 mt-0.5">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#c9956b] to-[#a67c52] shadow-sm">
                          <Sparkles
                            className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5 ai-chat-md">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3 sm:gap-4 mb-6"
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#c9956b] to-[#a67c52] shadow-sm">
                        <Sparkles
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pt-2">
                      {[0, 1, 2].map((j) => (
                        <motion.span
                          key={j}
                          className="h-[7px] w-[7px] rounded-full bg-neutral-300"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.4,
                            delay: j * 0.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── Input area ── */}
        <div className="shrink-0 bg-white px-3 sm:px-4 pb-4 sm:pb-5 pt-2">
          <div className="mx-auto max-w-[720px]">
            <div
              className={cn(
                "relative flex items-end rounded-[26px] transition-all duration-200",
                "bg-neutral-100 border border-neutral-200/60",
                "focus-within:border-neutral-300 focus-within:bg-neutral-50",
                "shadow-sm focus-within:shadow-md"
              )}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message Nagendra's AI..."
                rows={1}
                disabled={isTyping}
                className={cn(
                  "flex-1 resize-none bg-transparent py-3.5 sm:py-4 pl-4 sm:pl-5 pr-14",
                  "text-[15px] text-neutral-800 placeholder:text-neutral-400",
                  "focus:outline-none disabled:opacity-50",
                  "leading-relaxed max-h-[200px]"
                )}
                style={{ fontFamily: "inherit" }}
              />
              <div className="absolute right-2.5 bottom-2.5 sm:right-3 sm:bottom-3">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                    input.trim() && !isTyping
                      ? "bg-neutral-800 text-white hover:bg-neutral-900 shadow-sm"
                      : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                  )}
                  aria-label="Send message"
                >
                  <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2.5} />
                </motion.button>
              </div>
            </div>
            <p className="mt-2.5 text-center text-[11px] text-neutral-400 select-none">
              AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>

        {/* ── Markdown styles for light theme ── */}
        <style>{`
          .ai-chat-md h1 { font-size: 16px; font-weight: 600; margin: 16px 0 8px; color: #1a1a1a; }
          .ai-chat-md h1:first-child { margin-top: 0; }
          .ai-chat-md h2 { font-size: 15px; font-weight: 600; margin: 14px 0 6px; color: #1a1a1a; }
          .ai-chat-md h2:first-child { margin-top: 0; }
          .ai-chat-md h3 { font-size: 14px; font-weight: 600; margin: 12px 0 4px; color: #333; }
          .ai-chat-md p { font-size: 15px; line-height: 1.7; margin-bottom: 12px; color: #374151; }
          .ai-chat-md p:last-child { margin-bottom: 0; }
          .ai-chat-md ul { list-style: disc; padding-left: 20px; margin-bottom: 12px; }
          .ai-chat-md ol { list-style: decimal; padding-left: 20px; margin-bottom: 12px; }
          .ai-chat-md li { font-size: 15px; color: #374151; line-height: 1.65; margin-bottom: 4px; }
          .ai-chat-md li:last-child { margin-bottom: 0; }
          .ai-chat-md strong { font-weight: 600; color: #1a1a1a; }
          .ai-chat-md em { font-style: italic; color: #555; }
          .ai-chat-md code {
            background: #f3f4f6;
            color: #92400e;
            padding: 2px 6px;
            border-radius: 5px;
            font-size: 13px;
            font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
            border: 1px solid #e5e7eb;
          }
          .ai-chat-md pre {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 14px 16px;
            border-radius: 12px;
            overflow-x: auto;
            font-size: 13px;
            margin-bottom: 12px;
          }
          .ai-chat-md pre code {
            background: transparent;
            padding: 0;
            border-radius: 0;
            border: none;
            color: #374151;
          }
          .ai-chat-md blockquote {
            border-left: 3px solid #c9956b;
            padding-left: 14px;
            margin: 12px 0;
            color: #6b7280;
            font-style: italic;
          }
          .ai-chat-md a {
            color: #92400e;
            text-decoration: underline;
            text-underline-offset: 3px;
            transition: color 0.15s;
          }
          .ai-chat-md a:hover { color: #78350f; }
          .ai-chat-md table { width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 12px; }
          .ai-chat-md th, .ai-chat-md td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
            color: #374151;
          }
          .ai-chat-md th {
            background: #f9fafb;
            font-weight: 600;
            color: #1a1a1a;
          }
          .ai-chat-md hr {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 16px 0;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
