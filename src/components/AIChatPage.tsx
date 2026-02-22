"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, Send, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Simulated wedding AI responses in markdown format
const MOCK_RESPONSES: Record<string, string> = {
  default: `**Welcome!** I'm Nagendra's AI assistant for the wedding. 🎉

I can help you with:
- **Venue & Directions** — How to reach the wedding venue
- **Schedule** — Pellikoduku, March 7th lunch, Pelli timing, and more
- **Travel** — Best routes from Hyderabad, Bangalore, Chennai, Vizag, Vijayawada
- **Accommodation** — Nearby stays and contact details
- **Dress code** — What to wear for each event

*Just ask me anything!* ✨`,

  venue: `## Venue Information 📍

**Main Venue:** Hyderabad (exact address shared on invitation)

### Directions
1. **By flight** — Rajiv Gandhi Airport (HYD) → ~45 min by car
2. **By train** — Secunderabad Junction → ~25 min
3. **By bus** — MGBS Bus Stand → ~20 min

Need *turn-by-turn directions*? Ask me for travel from your city!`,

  schedule: `## Wedding Schedule 📅

| Event | Date | Time |
|-------|------|------|
| Pellikoduku Cheytam | March 7 | Morning |
| March 7th Lunch | March 7 | Afternoon |
| **Pelli (Wedding)** | **March 8** | **02:35 AM** |
| Sathanamuthi Ratham | March 8 | Post-wedding |
| Yarnalu Lunch | March 8 | Afternoon |

_All timings are in IST._`,

  travel: `## Travel Assistance 🚗✈️

I can help you plan travel from:
- Hyderabad
- Bangalore  
- Chennai
- Vizag
- Vijayawada

**Tell me your city and preferred mode** (flight/train/bus/car) and I'll share the best route!

The Travel section on the main page also has an interactive map. 🗺️`,

  dress: `## Dress Code 👗👔

**Pellikoduku Cheytam** — Traditional / Semi-formal  
**March 7th Lunch** — Smart casual  
**Wedding (Pelli)** — **Traditional attire** (sarees, kurta, dhoti)  
**Yarnalu Lunch** — Comfortable traditional

*When in doubt, traditional Indian wear is always welcome!* 🌸`,
};

function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("venue") || lower.includes("where") || lower.includes("location") || lower.includes("address"))
    return MOCK_RESPONSES.venue;
  if (lower.includes("schedule") || lower.includes("timing") || lower.includes("when") || lower.includes("date"))
    return MOCK_RESPONSES.schedule;
  if (lower.includes("travel") || lower.includes("how to reach") || lower.includes("route") || lower.includes("from "))
    return MOCK_RESPONSES.travel;
  if (lower.includes("dress") || lower.includes("wear") || lower.includes("attire"))
    return MOCK_RESPONSES.dress;
  return MOCK_RESPONSES.default;
}

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
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChatPage({ isOpen, onClose }: AIChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: MOCK_RESPONSES.default,
        timestamp: new Date(),
      };
      setMessages([welcome]);
    }
  }, [isOpen]);

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

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const aiContent = getAIResponse(text);
    const aiMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: aiContent,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  if (!isOpen) return null;

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
          <div className="flex items-center gap-1">
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
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.header>

        {/* Messages - ChatGPT layout: full-width, centered content, avatar for AI */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain bg-neutral-50/50"
        >
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
                {msg.role === "user" && <div className="w-8 sm:w-9 shrink-0" />}
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
                  <div className="shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-emerald-500">
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
            <div className="flex items-end gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 shadow-sm focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200 transition-all">
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
                autoFocus
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
