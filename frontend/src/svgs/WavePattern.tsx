export const WavePattern = ({ className = "", color = "currentColor" }) => (
  <svg
    className={className}
    width="200"
    height="100"
    viewBox="0 0 200 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 50 Q 25 30, 50 50 T 100 50 T 150 50 T 200 50"
      stroke={color}
      strokeWidth="2"
      fill="none"
      opacity="0.15"
    />
    <path
      d="M0 60 Q 25 40, 50 60 T 100 60 T 150 60 T 200 60"
      stroke={color}
      strokeWidth="2"
      fill="none"
      opacity="0.1"
    />
  </svg>
);
