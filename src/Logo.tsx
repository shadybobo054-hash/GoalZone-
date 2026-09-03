import "./Logo.css";

export default function Logo() {
  return (
    <div className="gz-logo">
      <svg
        className="gz-logo-svg"
        viewBox="0 0 360 90"
        aria-label="GOALZONE"
      >
        <defs>
          <linearGradient id="gzPurple" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#6d28d9" />
            <stop offset="55%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
        </defs>

        {/* SPORT ICON */}
        <path
          d="M10 67 L10 28 L22 15 L61 15 L76 29 L76 53
             L63 67 Z"
          fill="url(#gzPurple)"
        />

        {/* GOAL */}
        <path
          d="M22 28 H63 V55 H22 Z"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          opacity=".9"
        />

        {/* NET */}
        <path
          d="M30 28 V55 M39 28 V55 M48 28 V55 M57 28 V55
             M22 37 H63 M22 46 H63"
          stroke="#fff"
          strokeWidth="1.2"
          opacity=".3"
        />

        {/* BALL */}
        <path
          d="M43 31
             L51 35
             L52 44
             L45 50
             L36 47
             L34 38
             Z"
          fill="#fff"
        />

        <path
          d="M43 35 L48 38 L46 43 L41 43 L39 38 Z"
          fill="#7c3aed"
        />

        <path
          d="M39 38 L34 36
             M48 38 L53 36
             M41 43 L37 48
             M46 43 L50 48"
          stroke="#7c3aed"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* SPEED CUTS */}
        <path
          d="M7 74 H31"
          stroke="#8b5cf6"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <path
          d="M38 74 H57"
          stroke="#a78bfa"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* WORDMARK */}
        <text
          x="94"
          y="51"
          fill="#fff"
          fontSize="35"
          fontWeight="900"
          fontFamily="Arial Black, Arial, sans-serif"
          letterSpacing="-2.5"
        >
          GOAL
        </text>

        <text
          x="195"
          y="51"
          fill="url(#gzPurple)"
          fontSize="35"
          fontWeight="900"
          fontFamily="Arial Black, Arial, sans-serif"
          letterSpacing="-2.5"
        >
          ZONE
        </text>

        {/* UNDERLINE */}
        <path
          d="M96 61 H337"
          stroke="url(#gzPurple)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <text
          x="98"
          y="75"
          fill="#777184"
          fontSize="8"
          fontWeight="800"
          fontFamily="Arial, sans-serif"
          letterSpacing="3"
        >
          FOOTBALL MEDIA
        </text>
      </svg>
    </div>
  );
}