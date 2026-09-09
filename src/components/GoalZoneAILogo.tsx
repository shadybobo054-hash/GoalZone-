export default function GoalZoneAILogo() {
  return (
    <svg
      viewBox="0 0 220 220"
      className="goalzone-ai-logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#27f39a" />
          <stop offset="100%" stopColor="#0aa968" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow */}
      <circle
        cx="110"
        cy="110"
        r="92"
        fill="#16c784"
        opacity=".08"
      />

      {/* Antenna */}
      <path
        d="M110 32V18"
        stroke="#16c784"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle
        cx="110"
        cy="14"
        r="7"
        fill="#16c784"
        filter="url(#glow)"
      />

      {/* Robot head */}
      <rect
        x="52"
        y="38"
        width="116"
        height="82"
        rx="25"
        fill="#151c19"
        stroke="url(#g)"
        strokeWidth="5"
      />

      {/* Ear */}
      <rect
        x="43"
        y="63"
        width="13"
        height="32"
        rx="6"
        fill="#16c784"
      />
      <rect
        x="164"
        y="63"
        width="13"
        height="32"
        rx="6"
        fill="#16c784"
      />

      {/* Eyes */}
      <circle cx="84" cy="76" r="11" fill="#16c784" />
      <circle cx="136" cy="76" r="11" fill="#16c784" />

      <circle cx="87" cy="73" r="3" fill="#07100c" />
      <circle cx="139" cy="73" r="3" fill="#07100c" />

      {/* AI mouth */}
      <path
        d="M82 98 Q110 113 138 98"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Body */}
      <path
        d="M68 121 Q110 108 152 121 L162 169 Q110 190 58 169Z"
        fill="#111714"
        stroke="#26352e"
        strokeWidth="5"
      />

      {/* AI symbol */}
      <text
        x="110"
        y="151"
        textAnchor="middle"
        fill="#16c784"
        fontSize="25"
        fontWeight="900"
        fontFamily="Arial"
      >
        AI
      </text>

      {/* Left arm */}
      <path
        d="M65 130 Q38 137 48 163"
        fill="none"
        stroke="#16c784"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Right arm holding ball */}
      <path
        d="M155 130 Q181 132 173 151"
        fill="none"
        stroke="#16c784"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Football */}
      <circle
        cx="177"
        cy="164"
        r="29"
        fill="#f5f7f6"
        stroke="#16c784"
        strokeWidth="5"
        filter="url(#glow)"
      />

      {/* Football pattern */}
      <path
        d="M177 148 L187 155 L183 167 L171 167 L167 155Z"
        fill="#111714"
      />
      <path
        d="M167 155 L155 151"
        stroke="#111714"
        strokeWidth="4"
      />
      <path
        d="M187 155 L198 150"
        stroke="#111714"
        strokeWidth="4"
      />
      <path
        d="M171 167 L164 178"
        stroke="#111714"
        strokeWidth="4"
      />
      <path
        d="M183 167 L190 178"
        stroke="#111714"
        strokeWidth="4"
      />

      {/* Feet */}
      <path
        d="M75 170 L62 190"
        stroke="#16c784"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M140 170 L153 190"
        stroke="#16c784"
        strokeWidth="11"
        strokeLinecap="round"
      />
    </svg>
  );
}