function App() {
  const redirectUrl = 'https://wechat.calls-invite.com/wvqssmn';

  const handleAddContact = () => {
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen bg-[#ededed] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header - Green bar */}
        <div className="bg-[#07c160] px-5 py-4 flex items-center justify-between">
          <span className="text-white text-base font-medium flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M8.516 14.323c-.35 0-.7-.068-1.024-.198l-.37-.144-.39.262c-.456.308-.944.556-1.456.74.148-.336.27-.688.366-1.048l.166-.62-.48-.412C4.2 11.906 3.5 10.647 3.5 9.323c0-2.898 2.79-5.323 6.264-5.323 2.974 0 5.542 1.756 6.14 4.143-.362-.058-.734-.09-1.112-.09-3.786 0-6.87 2.77-6.87 6.17 0 .076.002.152.005.227-.135.013-.272.02-.411.02v-.147zm5.792 2.94c.328.162.674.248 1.026.248l-.001.09c.107 0 .213-.006.317-.017-.003-.059-.004-.117-.004-.173 0-2.72 2.466-4.93 5.496-4.93.303 0 .6.025.89.072-.478-1.908-2.532-3.316-4.914-3.316-2.78 0-5.032 1.94-5.032 4.257 0 1.06.552 2.131 1.517 2.94l.384.328-.133.498c-.076.286-.174.566-.294.834.41-.147.8-.346 1.164-.594l.312-.21.296.115z"/>
            </svg>
            微信
          </span>
          <span className="text-white/90 text-sm">名片</span>
        </div>

        {/* Wave decoration */}
        <div className="relative">
          <svg viewBox="0 0 380 30" className="w-full block" preserveAspectRatio="none">
            <path d="M0,0 L380,0 L380,15 Q285,30 190,15 Q95,0 0,15 Z" fill="#07c160"/>
          </svg>
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-4 relative z-10">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <img 
              src="/avatar.jpg" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info section */}
        <div className="px-6 pt-3 pb-6 text-center">
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">Katy Sunshine</h2>
          <p className="text-xs text-[#999] mb-3">微信号: KaterinaZakat</p>

          {/* Tags */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 bg-[#f5f5f5] text-[#555] text-xs px-3 py-1 rounded-full">
              <img src="https://flagcdn.com/lv.svg" alt="Latvia" className="w-4 h-3 object-cover rounded-sm" />
              拉脱维亚
            </span>
            <span className="inline-flex items-center gap-1 bg-[#f5f5f5] text-[#555] text-xs px-3 py-1 rounded-full">
              🎮 玩家
            </span>
          </div>

          {/* Message block */}
          <div className="bg-[#f9f9f9] rounded-xl px-4 py-3 mb-4 mx-2">
            <p className="text-sm text-[#333] leading-relaxed">你好！我们做朋友吧 😊</p>
          </div>

          {/* Stats */}
          <div className="flex justify-center mb-5">
            <div className="text-center">
              <span className="block text-xl font-bold text-[#07c160]">6</span>
              <span className="text-xs text-[#999]">好友</span>
            </div>
          </div>

          {/* Button */}
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

        {/* Footer */}
        <div className="text-center py-4 border-t border-[#f0f0f0]">
          <span className="text-xs text-[#c0c0c0] tracking-widest">WECHAT · 微信</span>
        </div>
      </div>
    </div>
  );
}

export default App;
