import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, Sparkles, User, Loader2, LogIn, ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiClient } from '@/api/client';
import { useAppSelector } from '@/store/hooks';

// ─── Constants ────────────────────────────────────────────────────────────────
const GUEST_CHAT_KEY = 'ai_guest_chat_count';
const GUEST_CHAT_LIMIT = 10;

function getGuestCount(): number {
  return parseInt(localStorage.getItem(GUEST_CHAT_KEY) || '0', 10);
}
function incrementGuestCount(): number {
  const next = getGuestCount() + 1;
  localStorage.setItem(GUEST_CHAT_KEY, String(next));
  return next;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  toolsUsed?: string[];
  timestamp?: string;
}

interface AIChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const AIChatWidget: React.FC<AIChatWidgetProps> = ({ isOpen, onClose }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: '👋 **Hello!** I am your **Aura AI Shopping Copilot**.\n\nI can help you find products, check stock, verify shipping times, or track your orders. How can I assist you today?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  // Dismiss login gate if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginGate(false);
    }
  }, [isAuthenticated]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    // Guest chat limit check
    if (!isAuthenticated) {
      const count = getGuestCount();
      if (count >= GUEST_CHAT_LIMIT) {
        setShowLoginGate(true);
        return;
      }
    }

    const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const userMsg: Message = {
      id: newId,
      sender: 'user',
      text: messageText
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', {
        message: messageText,
        session_id: sessionId,
      });

      if (response.data.session_id && !sessionId) {
        setSessionId(response.data.session_id);
      }

      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response.data.reply,
        toolsUsed: response.data.tools_used
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (!isAuthenticated) {
        const newCount = incrementGuestCount();
        if (newCount >= GUEST_CHAT_LIMIT) {
          setTimeout(() => setShowLoginGate(true), 800);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "I'm having a little trouble connecting to my knowledge base right now. Please make sure the backend server is running!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const quickPrompts = [
    '✨ What are your top electronics?',
    '🎧 Tell me about Aura Pro Headphones',
    '📦 How does Stripe checkout work?'
  ];

  return (
    <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-3xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-2xl flex flex-col h-[560px] max-h-[calc(100vh-8rem)] animate-fadeIn overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5 bg-gradient-to-r from-violet-950/40 via-zinc-900 to-indigo-950/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30">
            <Bot className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
              Aura Copilot
              <Sparkles className="h-3 w-3 text-amber-400" />
            </h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              {isAuthenticated ? 'Active · Unlimited AI queries' : `Guest · ${Math.max(0, GUEST_CHAT_LIMIT - getGuestCount())} queries remaining`}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          aria-label="Close Assistant"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── Messages Container ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-3.5 px-4 py-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 mt-1">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}

            <div
              className={`rounded-2xl px-4 py-3 max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-violet-600/20'
                  : 'bg-zinc-800/80 text-zinc-200 border border-white/[0.08] rounded-tl-none'
              }`}
            >
              <div className="prose prose-invert prose-xs">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              </div>

              {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="mt-2 pt-1.5 border-t border-white/10 text-[10px] text-violet-300 font-mono flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500">Live query:</span>
                  <span className="bg-violet-950/80 px-2 py-0.5 rounded-full border border-violet-700/50">
                    {msg.toolsUsed.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 mt-1 border border-white/[0.08]">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs italic pl-9">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-400" />
            <span>Copilot is searching products...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Login Gate ─────────────────────────────────────────────────────── */}
      {showLoginGate && !isAuthenticated && (
        <div className="mx-4 mb-3 rounded-2xl bg-violet-950/90 border border-violet-600/60 p-4 flex items-start gap-3 shrink-0 shadow-xl">
          <ShieldAlert className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs space-y-1.5">
            <p className="font-bold text-white">
              Guest message limit reached
            </p>
            <p className="text-[11px] text-violet-200/80 leading-relaxed">
              Sign in with your Google account to unlock unlimited free chats with your AI assistant.
            </p>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold transition shadow-md"
            >
              <LogIn className="h-3 w-3" />
              <span>Sign In with Google</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Quick Prompts ──────────────────────────────────────────────────── */}
      {!showLoginGate && (
        <div className="px-4 pb-2.5 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-2.5 shrink-0 bg-zinc-950/40">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="text-[10px] bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1 rounded-full border border-white/[0.06] transition truncate max-w-full"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* ── Input Bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 p-3.5 bg-zinc-950/80 border-t border-white/[0.08] shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !showLoginGate && handleSend()}
          placeholder={showLoginGate ? 'Sign in to continue...' : 'Ask about gear, orders, recommendations...'}
          disabled={showLoginGate && !isAuthenticated}
          className="flex-1 rounded-2xl bg-zinc-900 border border-white/[0.08] px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-40"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim() || (showLoginGate && !isAuthenticated)}
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-40 hover:from-violet-500 hover:to-indigo-500 transition shadow-md shadow-violet-600/30 shrink-0"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};
