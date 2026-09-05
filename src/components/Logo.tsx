import "./Logo.css";

export default function Logo() {
  return (
    <div className="gz-logo">
      <svg
        className="gz-svg"
        viewBox="0 0 900 430"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>

          {/* PURPLE */}
          <linearGradient id="gz-purple" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0abfc" />
            <stop offset="45%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          {/* SCREEN */}
          <linearGradient id="gz-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#32105a" />
            <stop offset="50%" stopColor="#10091c" />
            <stop offset="100%" stopColor="#061c28" />
          </linearGradient>

          {/* BALL BODY */}
          <radialGradient id="gz-ball" cx="28%" cy="20%" r="82%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#f8f8fa" />
            <stop offset="55%" stopColor="#d8d8dd" />
            <stop offset="73%" stopColor="#a5a5ad" />
            <stop offset="88%" stopColor="#595861" />
            <stop offset="100%" stopColor="#17161c" />
          </radialGradient>

          {/* BALL SHINE */}
          <radialGradient id="gz-shine">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* BALL DARK */}
          <linearGradient id="gz-ball-dark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#35333b" />
            <stop offset="50%" stopColor="#111015" />
            <stop offset="100%" stopColor="#050507" />
          </linearGradient>

          {/* GLOW */}
          <filter id="gz-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* BALL SHADOW */}
          <filter id="gz-shadow">
            <feDropShadow
              dx="0"
              dy="15"
              stdDeviation="12"
              floodColor="#000"
              floodOpacity=".85"
            />
          </filter>

          {/* BALL CLIP */}
          <clipPath id="gz-ball-clip">
            <circle cx="450" cy="170" r="100" />
          </clipPath>

        </defs>

        {/* BACK GLOW */}

        <ellipse
          cx="450"
          cy="175"
          rx="300"
          ry="150"
          fill="#8b5cf6"
          opacity=".09"
          filter="url(#gz-glow)"
        />

        {/* SPEED */}

        <g
          className="gz-speed"
          fill="none"
          strokeLinecap="round"
        >
          <path
            d="M55 185 C160 105 260 100 350 135"
            stroke="#a855f7"
            strokeWidth="8"
          />

          <path
            d="M45 220 C155 140 255 125 355 150"
            stroke="#22d3ee"
            strokeWidth="4"
          />

          <path
            d="M555 105 C680 60 775 95 850 145"
            stroke="#a855f7"
            strokeWidth="6"
          />

          <path
            d="M570 130 C690 90 790 125 860 175"
            stroke="#22d3ee"
            strokeWidth="3"
          />
        </g>

        {/* STADIUM LIGHTS */}

        <g className="gz-lights" filter="url(#gz-glow)">

          <rect
            x="640"
            y="30"
            width="150"
            height="7"
            rx="4"
            fill="url(#gz-purple)"
          />

          <circle cx="655" cy="58" r="5" fill="#fff" />
          <circle cx="680" cy="58" r="5" fill="#fff" />
          <circle cx="705" cy="58" r="5" fill="#fff" />
          <circle cx="730" cy="58" r="5" fill="#fff" />
          <circle cx="755" cy="58" r="5" fill="#fff" />
          <circle cx="780" cy="58" r="5" fill="#fff" />

          <circle cx="667" cy="82" r="5" fill="#fff" />
          <circle cx="693" cy="82" r="5" fill="#fff" />
          <circle cx="719" cy="82" r="5" fill="#fff" />

        </g>

        {/* SCREEN */}

        <g className="gz-screen" filter="url(#gz-shadow)">

          <rect
            x="275"
            y="55"
            width="350"
            height="235"
            rx="40"
            fill="#07060b"
            stroke="url(#gz-purple)"
            strokeWidth="7"
          />

          <rect
            x="291"
            y="71"
            width="318"
            height="203"
            rx="29"
            fill="url(#gz-screen)"
          />

          <path
            d="M320 105 H580"
            stroke="#a855f7"
            strokeWidth="2"
            opacity=".25"
          />

          <path
            d="M320 245 H575"
            stroke="#22d3ee"
            strokeWidth="2"
            opacity=".2"
          />

          {/* PLAY BUTTON */}

          <circle
            cx="545"
            cy="170"
            r="55"
            fill="#fff"
            opacity=".07"
          />

          <circle
            cx="545"
            cy="170"
            r="38"
            fill="#fff"
            opacity=".95"
          />

          <path
            d="M535 149 L535 191 L570 170 Z"
            fill="#7c3aed"
          />

        </g>

        {/* BALL SHADOW */}

        <ellipse
          cx="450"
          cy="285"
          rx="125"
          ry="23"
          fill="#000"
          opacity=".65"
          filter="url(#gz-glow)"
        />

        {/* =========================
            REALISTIC BALL
        ========================= */}

        <g
          className="gz-ball"
          filter="url(#gz-shadow)"
        >

          {/* BALL */}

          <circle
            cx="450"
            cy="170"
            r="100"
            fill="url(#gz-ball)"
            stroke="#111016"
            strokeWidth="3"
          />

          {/* OUTER SHADOW */}

          <circle
            cx="450"
            cy="170"
            r="97"
            fill="none"
            stroke="#050507"
            strokeWidth="10"
            opacity=".28"
          />

          <g clipPath="url(#gz-ball-clip)">

            {/* CENTRAL PENTAGON */}

            <path
              d="
                M450 112
                L493 143
                L477 196
                L423 196
                L407 143
                Z
              "
              fill="url(#gz-ball-dark)"
            />

            {/* CENTRAL INNER PANEL */}

            <path
              d="
                M450 123
                L479 146
                L468 181
                L432 181
                L421 146
                Z
              "
              fill="#08070b"
            />

            {/* PANEL CONNECTIONS */}

            <g
              fill="none"
              stroke="#15131a"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            >

              <path d="M450 112 L450 55" />

              <path d="M493 143 L555 120" />

              <path d="M477 196 L520 260" />

              <path d="M423 196 L380 260" />

              <path d="M407 143 L345 120" />

              <path d="M407 143 L365 195" />

              <path d="M493 143 L535 195" />

            </g>

            {/* PANEL HIGHLIGHTS */}

            <g
              fill="none"
              stroke="#6b6872"
              strokeWidth="2"
              opacity=".55"
            >

              <path d="M450 55 L493 143" />

              <path d="M493 143 L477 196" />

              <path d="M477 196 L423 196" />

              <path d="M423 196 L407 143" />

              <path d="M407 143 L450 55" />

            </g>

            {/* DARK PANEL DETAILS */}

            <path
              d="M345 120 Q380 100 410 115"
              fill="none"
              stroke="#09080d"
              strokeWidth="9"
              opacity=".8"
            />

            <path
              d="M555 120 Q520 100 493 115"
              fill="none"
              stroke="#09080d"
              strokeWidth="9"
              opacity=".8"
            />

            {/* PURPLE REFLECTION */}

            <ellipse
              cx="515"
              cy="215"
              rx="48"
              ry="22"
              fill="#a855f7"
              opacity=".2"
            />

            <ellipse
              cx="530"
              cy="220"
              rx="25"
              ry="10"
              fill="#22d3ee"
              opacity=".1"
            />

          </g>

          {/* REALISTIC HIGHLIGHT */}

          <ellipse
            cx="410"
            cy="105"
            rx="45"
            ry="25"
            fill="url(#gz-shine)"
            transform="rotate(-28 410 105)"
          />

          <ellipse
            cx="397"
            cy="96"
            rx="18"
            ry="8"
            fill="#fff"
            opacity=".55"
            transform="rotate(-28 397 96)"
          />

          {/* EDGE LIGHT */}

          <path
            d="
              M375 92
              C345 125 340 180 365 220
            "
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            opacity=".18"
          />

          {/* PURPLE EDGE REFLECTION */}

          <path
            d="
              M515 90
              C555 120 565 175 540 215
            "
            fill="none"
            stroke="#a855f7"
            strokeWidth="5"
            opacity=".25"
          />

          {/* FINAL GLASS SHINE */}

          <circle
            cx="450"
            cy="170"
            r="94"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            opacity=".08"
          />

        </g>

        {/* FRONT LIGHT TRAILS */}

        <g
          fill="none"
          stroke="url(#gz-purple)"
          strokeLinecap="round"
          filter="url(#gz-glow)"
        >

          <path
            d="M350 235 C395 285 505 292 555 225"
            strokeWidth="4"
            opacity=".7"
          />

          <path
            d="M325 255 C395 315 515 320 580 240"
            strokeWidth="2"
            opacity=".45"
          />

        </g>

        {/* BRAND */}

        <text
          x="450"
          y="350"
          textAnchor="middle"
          className="gz-brand"
        >
          <tspan className="gz-goal">
            GOAL
          </tspan>

          <tspan className="gz-zone">
            {" "}ZONE
          </tspan>
        </text>

        {/* LINE */}

        <line
          x1="270"
          y1="370"
          x2="630"
          y2="370"
          stroke="url(#gz-purple)"
          strokeWidth="2"
        />

        {/* SUBTITLE */}

        <text
          x="450"
          y="395"
          textAnchor="middle"
          className="gz-media"
        >
          FOOTBALL MEDIA
        </text>

      </svg>
    </div>
  );
}