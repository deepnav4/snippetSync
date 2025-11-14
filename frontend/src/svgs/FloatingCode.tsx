export const FloatingCode = ({ className = "", color = "currentColor" }) => (
  <svg
    className={className}
    width="150"
    height="150"
    viewBox="0 0 150 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text x="10" y="30" fill={color} opacity="0.15" fontSize="20" fontFamily="monospace">
      &lt;/&gt;
    </text>
    <text x="80" y="70" fill={color} opacity="0.12" fontSize="16" fontFamily="monospace">
      {'{}'}
    </text>
    <text x="30" y="110" fill={color} opacity="0.18" fontSize="18" fontFamily="monospace">
      []
    </text>
    <text x="100" y="130" fill={color} opacity="0.1" fontSize="14" fontFamily="monospace">
      fn
    </text>
  </svg>
);
