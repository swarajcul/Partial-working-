"use client"

import { useTheme } from "next-themes"

interface IllustrationProps {
  className?: string
}

export function NoTeamsIllustration({ className = "" }: IllustrationProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill={isDark ? "rgba(147, 51, 234, 0.1)" : "rgba(234, 88, 12, 0.1)"}
        stroke={isDark ? "rgba(147, 51, 234, 0.2)" : "rgba(234, 88, 12, 0.2)"}
        strokeWidth="2"
        strokeDasharray="5,5"
      />

      {/* Team Formation */}
      <g transform="translate(100, 100)">
        {/* Center Player */}
        <circle cx="0" cy="0" r="12" fill={isDark ? "#ea580c" : "#9333ea"} />
        <circle cx="0" cy="0" r="8" fill={isDark ? "#fff" : "#fff"} />

        {/* Surrounding Players */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const x = Math.cos((angle * Math.PI) / 180) * 35
          const y = Math.sin((angle * Math.PI) / 180) * 35
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="10" fill={isDark ? "#6b7280" : "#d1d5db"} opacity="0.6" />
              <circle cx={x} cy={y} r="6" fill={isDark ? "#374151" : "#9ca3af"} opacity="0.8" />
            </g>
          )
        })}

        {/* Connection Lines */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const x = Math.cos((angle * Math.PI) / 180) * 35
          const y = Math.sin((angle * Math.PI) / 180) * 35
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={x}
              y2={y}
              stroke={isDark ? "#4b5563" : "#9ca3af"}
              strokeWidth="2"
              strokeDasharray="3,3"
              opacity="0.5"
            />
          )
        })}
      </g>

      {/* Plus Icon */}
      <g transform="translate(160, 40)">
        <circle cx="0" cy="0" r="15" fill={isDark ? "#10b981" : "#059669"} />
        <path d="M-8 0 L8 0 M0 -8 L0 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function NoMatchesIllustration({ className = "" }: IllustrationProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Calendar Base */}
      <rect
        x="40"
        y="60"
        width="120"
        height="100"
        rx="8"
        fill={isDark ? "#1f2937" : "#f9fafb"}
        stroke={isDark ? "#374151" : "#d1d5db"}
        strokeWidth="2"
      />

      {/* Calendar Header */}
      <rect x="40" y="60" width="120" height="25" rx="8" fill={isDark ? "#ea580c" : "#9333ea"} />

      {/* Calendar Rings */}
      <circle cx="65" cy="50" r="3" fill={isDark ? "#6b7280" : "#9ca3af"} />
      <circle cx="135" cy="50" r="3" fill={isDark ? "#6b7280" : "#9ca3af"} />
      <rect x="63" y="40" width="4" height="20" rx="2" fill={isDark ? "#6b7280" : "#9ca3af"} />
      <rect x="133" y="40" width="4" height="20" rx="2" fill={isDark ? "#6b7280" : "#9ca3af"} />

      {/* Calendar Grid */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4, 5].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={50 + col * 15}
            y={95 + row * 15}
            width="12"
            height="12"
            rx="2"
            fill={isDark ? "#374151" : "#e5e7eb"}
            opacity="0.6"
          />
        )),
      )}

      {/* Empty Calendar Icon */}
      <g transform="translate(100, 120)">
        <circle cx="0" cy="0" r="20" fill={isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.1)"} />
        <path
          d="M-8 -8 L8 8 M8 -8 L-8 8"
          stroke={isDark ? "#ef4444" : "#dc2626"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Floating Schedule Icon */}
      <g transform="translate(160, 100)">
        <circle cx="0" cy="0" r="12" fill={isDark ? "#10b981" : "#059669"} />
        <path d="M-6 0 L6 0 M0 -6 L0 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function NoSearchResultsIllustration({ className = "" }: IllustrationProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Magnifying Glass */}
      <g transform="translate(100, 100)">
        <circle
          cx="-10"
          cy="-10"
          r="30"
          fill="none"
          stroke={isDark ? "#6b7280" : "#9ca3af"}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="12"
          x2="35"
          y2="35"
          stroke={isDark ? "#6b7280" : "#9ca3af"}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Question Mark */}
        <g transform="translate(-10, -10)">
          <path
            d="M-8 -12 Q-8 -18 -2 -18 Q4 -18 4 -12 Q4 -6 -2 -3 L-2 3"
            stroke={isDark ? "#ef4444" : "#dc2626"}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="-2" cy="8" r="1.5" fill={isDark ? "#ef4444" : "#dc2626"} />
        </g>
      </g>

      {/* Floating Dots */}
      {[
        { x: 60, y: 60, delay: 0 },
        { x: 140, y: 80, delay: 0.5 },
        { x: 70, y: 140, delay: 1 },
        { x: 150, y: 130, delay: 1.5 },
      ].map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r="3" fill={isDark ? "#4b5563" : "#9ca3af"} opacity="0.4" />
      ))}
    </svg>
  )
}

export function NoExportsIllustration({ className = "" }: IllustrationProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document Stack */}
      <g transform="translate(100, 100)">
        {/* Back Documents */}
        <rect x="-25" y="-35" width="50" height="60" rx="4" fill={isDark ? "#374151" : "#e5e7eb"} opacity="0.6" />
        <rect x="-30" y="-30" width="50" height="60" rx="4" fill={isDark ? "#4b5563" : "#d1d5db"} opacity="0.8" />

        {/* Front Document */}
        <rect
          x="-35"
          y="-25"
          width="50"
          height="60"
          rx="4"
          fill={isDark ? "#1f2937" : "#f9fafb"}
          stroke={isDark ? "#6b7280" : "#9ca3af"}
          strokeWidth="2"
        />

        {/* Document Lines */}
        {[-10, -5, 0, 5, 10].map((y, i) => (
          <rect
            key={i}
            x="-25"
            y={y}
            width={i === 2 ? "20" : "30"}
            height="2"
            rx="1"
            fill={isDark ? "#6b7280" : "#9ca3af"}
            opacity="0.5"
          />
        ))}

        {/* PDF Icon */}
        <g transform="translate(-35, -25)">
          <rect x="35" y="0" width="15" height="20" rx="2" fill={isDark ? "#ef4444" : "#dc2626"} />
          <text x="42.5" y="12" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">
            PDF
          </text>
        </g>
      </g>

      {/* Empty Indicator */}
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke={isDark ? "#374151" : "#d1d5db"}
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.5"
      />

      {/* Download Arrow */}
      <g transform="translate(140, 60)">
        <circle cx="0" cy="0" r="12" fill={isDark ? "#10b981" : "#059669"} />
        <path
          d="M0 -6 L0 6 M-4 2 L0 6 L4 2"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export function ErrorStateIllustration({ className = "" }: IllustrationProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Broken Controller */}
      <g transform="translate(100, 100)">
        {/* Controller Body */}
        <ellipse cx="0" cy="0" rx="40" ry="25" fill={isDark ? "#374151" : "#d1d5db"} />
        <ellipse cx="0" cy="0" rx="35" ry="20" fill={isDark ? "#1f2937" : "#f3f4f6"} />

        {/* Crack */}
        <path
          d="M-20 -10 Q-10 -15 0 -5 Q10 5 20 -10"
          stroke={isDark ? "#ef4444" : "#dc2626"}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Left Side */}
        <g transform="translate(-15, 0)">
          <circle cx="0" cy="-8" r="3" fill={isDark ? "#6b7280" : "#9ca3af"} />
          <circle cx="-8" cy="0" r="3" fill={isDark ? "#6b7280" : "#9ca3af"} />
          <circle cx="8" cy="0" r="3" fill={isDark ? "#6b7280" : "#9ca3af"} />
          <circle cx="0" cy="8" r="3" fill={isDark ? "#6b7280" : "#9ca3af"} />
        </g>

        {/* Right Side (Broken) */}
        <g transform="translate(15, 0)" opacity="0.5">
          <circle cx="0" cy="-8" r="3" fill={isDark ? "#ef4444" : "#dc2626"} />
          <circle cx="8" cy="0" r="3" fill={isDark ? "#ef4444" : "#dc2626"} />
        </g>

        {/* Sparks */}
        {[
          { x: 25, y: -15, rotation: 45 },
          { x: 30, y: -5, rotation: -30 },
          { x: 35, y: 10, rotation: 60 },
        ].map((spark, i) => (
          <g key={i} transform={`translate(${spark.x}, ${spark.y}) rotate(${spark.rotation})`}>
            <path d="M0 -3 L2 0 L0 3 L-2 0 Z" fill={isDark ? "#fbbf24" : "#f59e0b"} />
          </g>
        ))}
      </g>

      {/* Error Circle */}
      <circle
        cx="100"
        cy="100"
        r="70"
        fill="none"
        stroke={isDark ? "#ef4444" : "#dc2626"}
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.3"
      />
    </svg>
  )
}

export function NoPlayersIllustration({ className = "" }: IllustrationProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Empty Roster Board */}
      <g transform="translate(100, 100)">
        <rect
          x="-50"
          y="-40"
          width="100"
          height="80"
          rx="8"
          fill={isDark ? "#1f2937" : "#f9fafb"}
          stroke={isDark ? "#374151" : "#d1d5db"}
          strokeWidth="2"
          strokeDasharray="8,4"
        />

        {/* Empty Player Slots */}
        {[0, 1, 2].map((row) =>
          [0, 1].map((col) => (
            <g key={`${row}-${col}`} transform={`translate(${-25 + col * 50}, ${-20 + row * 20})`}>
              <circle
                cx="0"
                cy="0"
                r="8"
                fill="none"
                stroke={isDark ? "#4b5563" : "#9ca3af"}
                strokeWidth="2"
                strokeDasharray="2,2"
                opacity="0.5"
              />
              <circle cx="0" cy="0" r="3" fill={isDark ? "#6b7280" : "#9ca3af"} opacity="0.3" />
            </g>
          )),
        )}

        {/* Title */}
        <rect x="-30" y="-35" width="60" height="8" rx="2" fill={isDark ? "#4b5563" : "#9ca3af"} opacity="0.3" />
      </g>

      {/* Add Player Icon */}
      <g transform="translate(150, 50)">
        <circle cx="0" cy="0" r="15" fill={isDark ? "#10b981" : "#059669"} />
        <circle cx="0" cy="-3" r="4" fill="white" />
        <path d="M-6 6 Q0 3 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path
          d="M0 -12 L0 -8 M-2 -10 L2 -10"
          stroke={isDark ? "#10b981" : "#059669"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export function NoStatsIllustration({ className = "" }: IllustrationProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chart Background */}
      <g transform="translate(100, 100)">
        <rect
          x="-60"
          y="-40"
          width="120"
          height="80"
          rx="8"
          fill={isDark ? "#1f2937" : "#f9fafb"}
          stroke={isDark ? "#374151" : "#d1d5db"}
          strokeWidth="2"
        />

        {/* Empty Chart Bars */}
        {[-30, -10, 10, 30].map((x, i) => (
          <rect
            key={i}
            x={x}
            y="20"
            width="15"
            height="15"
            rx="2"
            fill={isDark ? "#374151" : "#e5e7eb"}
            opacity="0.5"
          />
        ))}

        {/* Chart Axes */}
        <line x1="-50" y1="35" x2="50" y2="35" stroke={isDark ? "#4b5563" : "#9ca3af"} strokeWidth="2" />
        <line x1="-50" y1="-30" x2="-50" y2="35" stroke={isDark ? "#4b5563" : "#9ca3af"} strokeWidth="2" />

        {/* No Data Indicator */}
        <text x="0" y="0" textAnchor="middle" fontSize="12" fill={isDark ? "#6b7280" : "#9ca3af"} fontWeight="500">
          No Data
        </text>
      </g>

      {/* Analytics Icon */}
      <g transform="translate(150, 60)">
        <circle cx="0" cy="0" r="12" fill={isDark ? "#8b5cf6" : "#7c3aed"} />
        <path
          d="M-6 2 L-2 -2 L2 2 L6 -4"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="-2" cy="-2" r="1" fill="white" />
        <circle cx="2" cy="2" r="1" fill="white" />
      </g>
    </svg>
  )
}
