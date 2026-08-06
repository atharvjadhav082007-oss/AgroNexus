import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

import { API_URL } from '../../config';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  aiPowered?: boolean;
}

export default function AIChatbot() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem('token');

  const SUGGESTED_QUESTIONS = [
    t('chat.q1'),
    t('chat.q2'),
    t('chat.q3'),
    t('chat.q4'),
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Show greeting on first open or language change
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: t('chat.greeting'),
          timestamp: new Date(),
          aiPowered: false,
        },
      ]);
    } else if (hasGreeted && isOpen) {
       // if language changes and we already greeted, we might want to keep the history or just update the greeting?
       // To avoid erasing history, we won't overwrite all messages.
    }
  }, [isOpen, hasGreeted, language]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.id !== 'greeting')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_URL}/chatbot/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text.trim(),
          conversation_history: history,
          language: language,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        aiPowered: data.ai_powered,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "Sorry, I couldn't process your request right now. Please try again in a moment. 🙏",
          timestamp: new Date(),
          aiPowered: false,
        },
      ]);
    }

    setLoading(false);
  };

  const handleSuggestionClick = (q: string) => {
    // Strip the emoji prefix for cleaner input
    const cleanQ = q.replace(/^[^\w]*/, '').trim();
    sendMessage(cleanQ);
  };

  // Simple markdown-like rendering for bold text and bullet points
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Replace **text** with bold
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={j} style={{ fontWeight: 700 }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={j}>{part}</span>;
      });

      // Check for bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={i} style={{ paddingLeft: 8, marginBottom: 4, display: 'flex', gap: 4 }}>
            <span>{line.trim().charAt(0)}</span>
            <span>{rendered.slice(0)}</span>
          </div>
        );
      }

      return (
        <div key={i} style={{ marginBottom: line.trim() === '' ? 8 : 2 }}>
          {rendered}
        </div>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            id="chatbot-fab"
            style={{
              position: 'fixed',
              bottom: 28,
              right: 28,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #166534, #22c55e)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(22, 101, 52, 0.4), 0 0 0 4px rgba(34, 197, 94, 0.15)',
              zIndex: 9998,
            }}
          >
            <MessageCircle size={26} />
            {/* Pulse ring */}
            <span
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid rgba(34, 197, 94, 0.5)',
                animation: 'chatbot-pulse 2s ease-in-out infinite',
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            id="chatbot-window"
            style={{
              position: 'fixed',
              bottom: 28,
              right: 28,
              width: 400,
              maxWidth: 'calc(100vw - 32px)',
              height: 560,
              maxHeight: 'calc(100vh - 80px)',
              borderRadius: 20,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 64px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
              zIndex: 9999,
              background: '#f8faf8',
            }}
          >
            {/* Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #166534, #15803d)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Bot size={22} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{t('chat.title')}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#4ade80',
                      display: 'inline-block',
                    }}
                  />
                  {t('chat.subtitle')}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: 10,
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 16px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
              className="no-scrollbar"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: 8,
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #166534, #22c55e)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <Bot size={16} color="#fff" />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '78%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #166534, #15803d)'
                        : '#fff',
                      color: msg.role === 'user' ? '#fff' : '#1f2937',
                      fontSize: 13,
                      lineHeight: 1.55,
                      boxShadow: msg.role === 'user'
                        ? '0 2px 8px rgba(22, 101, 52, 0.25)'
                        : '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    {renderContent(msg.content)}
                    {msg.role === 'assistant' && msg.aiPowered && (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 10,
                          color: '#9ca3af',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Sparkles size={10} /> {t('chat.poweredBy')}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        background: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <User size={16} color="#6b7280" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', gap: 8, alignItems: 'center' }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #166534, #22c55e)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={16} color="#fff" />
                  </div>
                  <div
                    style={{
                      background: '#fff',
                      padding: '12px 18px',
                      borderRadius: '16px 16px 16px 4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      display: 'flex',
                      gap: 5,
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ animation: 'chatbot-dot 1.4s ease-in-out 0s infinite', width: 7, height: 7, borderRadius: '50%', background: '#166534', display: 'inline-block' }} />
                    <span style={{ animation: 'chatbot-dot 1.4s ease-in-out 0.2s infinite', width: 7, height: 7, borderRadius: '50%', background: '#166534', display: 'inline-block' }} />
                    <span style={{ animation: 'chatbot-dot 1.4s ease-in-out 0.4s infinite', width: 7, height: 7, borderRadius: '50%', background: '#166534', display: 'inline-block' }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips (shown when few messages) */}
            {messages.length <= 1 && !loading && (
              <div
                style={{
                  padding: '0 16px 8px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                }}
              >
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(q)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      border: '1px solid #d1fae5',
                      background: '#ecfdf5',
                      color: '#166534',
                      fontSize: 11,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#d1fae5';
                      e.currentTarget.style.borderColor = '#a7f3d0';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#ecfdf5';
                      e.currentTarget.style.borderColor = '#d1fae5';
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid #e5e7eb',
                background: '#fff',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder={t('chat.placeholder')}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1.5px solid #e5e7eb',
                  outline: 'none',
                  fontSize: 13,
                  background: '#f9fafb',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#22c55e')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: 'none',
                  background:
                    loading || !input.trim()
                      ? '#e5e7eb'
                      : 'linear-gradient(135deg, #166534, #22c55e)',
                  color: loading || !input.trim() ? '#9ca3af' : '#fff',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot-specific CSS animations */}
      <style>{`
        @keyframes chatbot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes chatbot-dot {
          0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
