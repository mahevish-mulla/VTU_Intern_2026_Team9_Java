import { useState, useRef, useEffect } from "react";
import API from "../services/api";

const QUICK_QUESTIONS = [
    "How do I invest in a fund?",
    "What is SIP?",
    "How to set a financial goal?",
    "What is NAV?",
];

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "👋 Hi! I'm your WealthWise Assistant.\n\nI can help you with investments, mutual funds, SIP, NAV, financial goals and more.\n\nHow can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            inputRef.current?.focus();
            setUnreadCount(0);
        }
    }, [messages, isOpen, isMinimized]);

    // Toggle class on .portal so page content shifts like VS Code sidebar
    useEffect(() => {
        const portal = document.querySelector(".portal");
        if (!portal) return;
        if (isOpen) {
            portal.classList.add("portal--chatbot-open");
        } else {
            portal.classList.remove("portal--chatbot-open");
        }
        return () => portal.classList.remove("portal--chatbot-open");
    }, [isOpen]);

    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || loading) return;

        const userMessage = { role: "user", content: trimmed };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const chatHistory = updatedMessages
                .filter((m) => !(m.role === "assistant" && m.content.startsWith("👋")))
                .map((m) => ({ role: m.role, message: m.content }));

            const res = await API.post("/api/chat", { messages: chatHistory });

            const botMessage = {
                role: "assistant",
                content: res.data.message || "Sorry, something went wrong.",
            };
            setMessages((prev) => [...prev, botMessage]);

            if (!isOpen || isMinimized) {
                setUnreadCount((c) => c + 1);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "⚠️ Unable to connect to WealthWise Assistant. Please make sure the server is running.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                role: "assistant",
                content:
                    "👋 Hi! I'm your WealthWise Assistant.\n\nI can help you with investments, mutual funds, SIP, NAV, financial goals and more.\n\nHow can I help you today?",
            },
        ]);
    };

    const toggleOpen = () => {
        setIsOpen((o) => !o);
        setIsMinimized(false);
        setUnreadCount(0);
    };

    return (
        <>
            {/* ── Floating Trigger Button (hidden when chat is open) ── */}
            {!isOpen && (
                <button
                    onClick={toggleOpen}
                    className="ww-chat-fab"
                    title="WealthWise Assistant"
                >
                    <span className="ww-chat-fab__icon">💬</span>
                    {unreadCount > 0 && (
                        <span className="ww-chat-fab__badge">{unreadCount}</span>
                    )}
                </button>
            )}

            {/* ── Chat Window ── */}
            {isOpen && (
                <div className={`ww-chat${isMinimized ? " ww-chat--minimized" : ""}`}>

                    {/* Header */}
                    <div className="ww-chat__header">
                        <div className="ww-chat__header-left">
                            <div className="ww-chat__avatar">💰</div>
                            <div>
                                <div className="ww-chat__title">WealthWise Assistant</div>
                                <div className="ww-chat__status">
                                    <span className="ww-chat__dot" />
                                    {loading ? "Thinking..." : "Online"}
                                </div>
                            </div>
                        </div>
                        <div className="ww-chat__header-actions">
                            <button
                                className="ww-chat__icon-btn"
                                onClick={() => setIsMinimized((m) => !m)}
                                title={isMinimized ? "Expand" : "Minimize"}
                            >
                                {isMinimized ? "▲" : "▼"}
                            </button>
                            <button
                                className="ww-chat__icon-btn"
                                onClick={clearChat}
                                title="Clear chat"
                            >
                                🗑
                            </button>
                            <button
                                className="ww-chat__icon-btn"
                                onClick={toggleOpen}
                                title="Close"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages */}
                            <div className="ww-chat__messages">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`ww-chat__msg ww-chat__msg--${msg.role}`}
                                    >
                                        {msg.role === "assistant" && (
                                            <div className="ww-chat__msg-avatar">🤖</div>
                                        )}
                                        <div className="ww-chat__bubble">{msg.content}</div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="ww-chat__msg ww-chat__msg--assistant">
                                        <div className="ww-chat__msg-avatar">🤖</div>
                                        <div className="ww-chat__bubble ww-chat__bubble--typing">
                                            <span /><span /><span />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Questions — show only at start */}
                            {messages.length <= 1 && (
                                <div className="ww-chat__quick">
                                    {QUICK_QUESTIONS.map((q) => (
                                        <button
                                            key={q}
                                            className="ww-chat__quick-btn"
                                            onClick={() => sendMessage(q)}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input */}
                            <div className="ww-chat__input-row">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about funds, goals, SIP..."
                                    rows={1}
                                    className="ww-chat__input"
                                    disabled={loading}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={loading || !input.trim()}
                                    className="ww-chat__send"
                                >
                                    ➤
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            <style>{`
        .ww-chat-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5a623, #e09418);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(245, 166, 35, 0.4);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s;
        }
        .ww-chat-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 28px rgba(245, 166, 35, 0.55);
        }
        .ww-chat-fab__icon { font-size: 24px; color: #080c14; }
        .ww-chat-fab__badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background: #f25f5c;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          width: 21px;
          height: 21px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #080c14;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .ww-chat {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          height: 100vh;
          max-height: 100vh;
          background: #ffffff;
          border-radius: 20px 0 0 20px;
          box-shadow: -10px 0 40px rgba(8, 12, 20, 0.25);
          display: flex;
          flex-direction: column;
          z-index: 9998;
          overflow: hidden;
          animation: wwSlideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          border-left: 1px solid #1a2236;
        }
        .ww-chat--minimized { 
          height: 72px; 
          border-radius: 20px 0 0 0;
          cursor: pointer;
        }
        .ww-chat__header {
          background: linear-gradient(135deg, #f5a623 0%, #e09418 100%);
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .ww-chat__header-left { display: flex; align-items: center; gap: 14px; }
        .ww-chat__avatar {
          width: 42px; height: 42px;
          background: rgba(8, 12, 20, 0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .ww-chat__title { color: #080c14; font-weight: 700; font-size: 16px; letter-spacing: -0.2px; }
        .ww-chat__status {
          color: rgba(8, 12, 20, 0.65); font-size: 12px; font-weight: 500;
          display: flex; align-items: center; gap: 6px; margin-top: 3px;
        }
        .ww-chat__dot {
          width: 7px; height: 7px; background: #080c14;
          border-radius: 50%; display: inline-block;
          opacity: 0.6;
          animation: wwPulse 2s infinite;
        }
        .ww-chat__header-actions { display: flex; gap: 6px; }
        .ww-chat__icon-btn {
          background: rgba(8, 12, 20, 0.1); border: none; color: #080c14;
          width: 32px; height: 32px; border-radius: 8px; cursor: pointer;
          font-size: 13px; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s ease;
        }
        .ww-chat__icon-btn:hover { background: rgba(8, 12, 20, 0.2); }
        .ww-chat__messages {
          flex: 1; overflow-y: auto; padding: 20px 18px;
          display: flex; flex-direction: column; gap: 14px;
          background: #ffffff;
        }
        .ww-chat__messages::-webkit-scrollbar { width: 5px; }
        .ww-chat__messages::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 5px; }
        .ww-chat__messages::-webkit-scrollbar-track { background: transparent; }
        .ww-chat__msg { display: flex; align-items: flex-end; gap: 10px; }
        .ww-chat__msg--user { flex-direction: row-reverse; }
        .ww-chat__msg-avatar { font-size: 20px; flex-shrink: 0; margin-bottom: 3px; }
        .ww-chat__bubble {
          max-width: 80%; padding: 12px 16px; font-size: 14px;
          line-height: 1.55; white-space: pre-wrap; word-break: break-word;
          border-radius: 16px;
        }
        .ww-chat__msg--assistant .ww-chat__bubble {
          background: #f5f5f5; color: #1a1a1a;
          border-bottom-left-radius: 4px;
        }
        .ww-chat__msg--user .ww-chat__bubble {
          background: linear-gradient(135deg, #f5a623, #e09418);
          color: #080c14; border-bottom-right-radius: 4px;
          font-weight: 500;
        }
        .ww-chat__bubble--typing {
          display: flex; align-items: center; gap: 5px; padding: 16px 20px;
        }
        .ww-chat__bubble--typing span {
          width: 7px; height: 7px; background: #f5a623;
          border-radius: 50%; display: inline-block;
          animation: wwBounce 1.3s infinite ease-in-out both;
        }
        .ww-chat__bubble--typing span:nth-child(1) { animation-delay: -0.32s; }
        .ww-chat__bubble--typing span:nth-child(2) { animation-delay: -0.16s; }
        .ww-chat__quick {
          padding: 4px 18px 16px; display: flex; flex-wrap: wrap; gap: 8px;
          background: #ffffff; flex-shrink: 0;
        }
        .ww-chat__quick-btn {
          background: #fff; border: 1.5px solid #f5a623; color: #e09418;
          border-radius: 20px; padding: 7px 14px; font-size: 12.5px; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease; font-family: inherit;
        }
        .ww-chat__quick-btn:hover { 
          background: #f5a623; color: #080c14; border-color: #f5a623;
        }
        .ww-chat__input-row {
          padding: 16px 18px; background: #fff;
          border-top: 1px solid #eee;
          display: flex; gap: 10px; align-items: flex-end; flex-shrink: 0;
        }
        .ww-chat__input {
          flex: 1; border: 1.5px solid #e0e0e0; border-radius: 14px;
          padding: 12px 16px; font-size: 14px; resize: none; outline: none;
          font-family: inherit; color: #1a1a1a; line-height: 1.45;
          max-height: 100px; overflow-y: auto; transition: all 0.2s ease;
          background: #fafafa;
        }
        .ww-chat__input:focus { 
          border-color: #f5a623; background: #fff; 
          box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.12);
        }
        .ww-chat__input:disabled { opacity: 0.5; }
        .ww-chat__send {
          width: 46px; height: 46px; border-radius: 12px;
          background: linear-gradient(135deg, #f5a623, #e09418);
          border: none; color: #080c14; cursor: pointer; font-size: 17px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; flex-shrink: 0;
          box-shadow: 0 3px 12px rgba(245, 166, 35, 0.3);
          font-weight: 700;
        }
        .ww-chat__send:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .ww-chat__send:not(:disabled):hover { 
          transform: scale(1.06);
          box-shadow: 0 4px 18px rgba(245, 166, 35, 0.45);
        }
        @keyframes wwSlideLeft {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes wwBounce {
          0%, 80%, 100% { transform: scale(0); }
          40%           { transform: scale(1); }
        }
        @keyframes wwPulse {
          0%, 100% { opacity: 0.6; } 50% { opacity: 1; }
        }
      `}</style>
        </>
    );
}
