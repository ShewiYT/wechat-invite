export default function WeChatLogo() {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Green background rounded rect */}
      <rect width="512" height="512" rx="100" fill="#07C160" />
      
      {/* Two chat bubbles representing WeChat */}
      {/* Larger bubble (back) */}
      <ellipse cx="230" cy="220" rx="110" ry="95" fill="white" />
      {/* Eyes on larger bubble */}
      <circle cx="195" cy="205" r="12" fill="#07C160" />
      <circle cx="265" cy="205" r="12" fill="#07C160" />
      
      {/* Smaller bubble (front) */}
      <ellipse cx="310" cy="310" rx="90" ry="78" fill="white" />
      {/* Eyes on smaller bubble */}
      <circle cx="280" cy="300" r="10" fill="#07C160" />
      <circle cx="340" cy="300" r="10" fill="#07C160" />
    </svg>
  );
}
