export const GridDots = ({ className = "", color = "currentColor" }) => (
  <svg
    className={className}
    width="400"
    height="400"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {Array.from({ length: 10 }).map((_, i) =>
      Array.from({ length: 10 }).map((_, j) => (
        <circle
          key={`${i}-${j}`}
          cx={20 + j * 40}
          cy={20 + i * 40}
          r="1.5"
          fill={color}
          opacity="0.25"
        />
      ))
    )}
  </svg>
);
