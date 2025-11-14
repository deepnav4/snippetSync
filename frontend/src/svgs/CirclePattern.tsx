export const CirclePattern = ({ className = "", color = "currentColor" }) => (
  <svg
    className={className}
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="2" fill={color} opacity="0.2" />
    <circle cx="60" cy="20" r="2" fill={color} opacity="0.2" />
    <circle cx="100" cy="20" r="2" fill={color} opacity="0.2" />
    <circle cx="20" cy="60" r="2" fill={color} opacity="0.2" />
    <circle cx="60" cy="60" r="2" fill={color} opacity="0.2" />
    <circle cx="100" cy="60" r="2" fill={color} opacity="0.2" />
    <circle cx="20" cy="100" r="2" fill={color} opacity="0.2" />
    <circle cx="60" cy="100" r="2" fill={color} opacity="0.2" />
    <circle cx="100" cy="100" r="2" fill={color} opacity="0.2" />
  </svg>
);
