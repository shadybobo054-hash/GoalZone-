import { useState } from "react";
import GoalZoneAILogo from "./GoalZoneAILogo";
import "./GoalZoneAI.css";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function GoalZoneAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text:
        "أهلاً بيك 👋 أنا GoalZone AI ⚽\nاسألني عن المباريات أو الأخبار أو فريقك المفضل.",
    },
  ]);

  async function sendMessage() {
    const text = input.trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text },
    ]);

    setInput("");
    setLoading(true);

    try {
      const saved = localStorage.getItem("goalzone-favorites");

      let favorites: unknown[] = [];

      try {
        favorites = saved ? JSON.parse(saved) : [];
      } catch {
        favorites = [];
      }

      const response = await fetch(
        "http://127.0.0.1:5000/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            favorites,
          }),
        }
      );

      const raw = await response.text();

      let data: {
        success?: boolean;
        answer?: string;
        message?: string;
      } = {};

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("السيرفر رجّع رد غير صالح.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Server Error ${response.status}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "الـ AI فشل في تنفيذ الطلب."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer || "مش قادر أطلع إجابة دلوقتي.",
        },
      ]);
    } catch (error) {
      console.error("❌ GoalZone AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            error instanceof TypeError
              ? "❌ مش قادر أوصل للـ Backend.\nتأكد إن السيرفر شغال على Port 5000."
              : `❌ ${
                  error instanceof Error
                    ? error.message
                    : "حصل خطأ."
                }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* AI BUTTON */}
      <button
        className="ai-fab"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open GoalZone AI"
      >
        <GoalZoneAILogo />
      </button>

      {/* AI PANEL */}
      {open && (
        <section className="ai-panel">
          <header className="ai-header">
            <div>
              <GoalZoneAILogo />

              <div>
                <strong>GoalZone AI</strong>

                <small>
                  <i />
                  Football Assistant
                </small>
              </div>
            </div>

            <button
              className="ai-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <div className="ai-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ai-message ${message.role}`}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="ai-message ai">
                <span className="typing">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}
          </div>

          <div className="ai-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اسأل GoalZone AI..."
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              ➤
            </button>
          </div>
        </section>
      )}
    </>
  );
}