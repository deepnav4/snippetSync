export const CodeBrackets = ({ className = "", color = "currentColor" }) => (
  <svg
    className={className}
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 20L15 50L30 80"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.3"
    />
    <path
      d="M70 20L85 50L70 80"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.3"
    />
  </svg>
);
