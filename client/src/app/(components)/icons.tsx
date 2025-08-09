export const Single = ({ size = 24, color = "currentColor" }) => (
  <svg
    //   xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Door frame */}
    <rect x="6" y="3" width="12" height="18" rx="1" ry="1" />
  </svg>
);

export const Double = ({ size = 24, color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Outer square */}
    <rect x="3" y="3" width="18" height="18" rx="1" ry="1" />
    {/* Vertical line down the middle */}
    <line x1="12" y1="3" x2="12" y2="21" />
  </svg>
);

export const RoundTop = ({ size = 24, color = "currentColor" }) => (
  <svg
    //   xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Door shape with rounded top */}
    <path d="M6 21 V8 A6 6 0 0 1 18 8 V21 H6 Z" />
  </svg>
);

export const RoundTopDouble = ({ size = 24, color = "currentColor" }) => (
  <svg
    //   xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Outer rounded-top frame */}
    <path d="M3 21 V9 A9 9 0 0 1 21 9 V21 H3 Z" />
    {/* Vertical split line */}
    <line x1="12" y1="9" x2="12" y2="21" />
  </svg>
);

export const Window = ({ size = 24, color = "currentColor" }) => (
  <svg
    //   xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Rounded top rectangle */}
    <path d="M3 21 V9 A9 9 0 0 1 21 9 V21 H3 Z" />
  </svg>
);

export const Railing = ({ size = 24, color = "currentColor" }) => (
    <svg
    //   xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top horizontal rail */}
      <line x1="3" y1="5" x2="21" y2="5" />
      {/* Bottom horizontal rail */}
      <line x1="3" y1="19" x2="21" y2="19" />
      
      {/* Vertical bars */}
      <line x1="6" y1="5" x2="6" y2="19" />
      <line x1="10" y1="5" x2="10" y2="19" />
      <line x1="14" y1="5" x2="14" y2="19" />
      <line x1="18" y1="5" x2="18" y2="19" />
    </svg>
  );
  
