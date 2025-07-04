"use client"

import { useState } from "react"

interface PerformanceInputModuleProps {
  onClose: () => void
  playerMode?: boolean
  playerName?: string
  playerTeam?: string
}

export function PerformanceInputModule({
  onClose,
  playerMode = false,
  playerName = "",
  playerTeam = "",
}: PerformanceInputModuleProps) {
  const [selectedMode, setSelectedMode] = useState<"manual" | "screenshot">("manual")

  const handleModeChange = (mode: "manual" | "screenshot") => {
    setSelectedMode(mode)
  }

  return (
    <div>
      <div>
        <button onClick={() => handleModeChange("manual")}>Manual Entry</button>
        <button onClick={() => handleModeChange("screenshot")}>Screenshot Upload</button>
      </div>

      {selectedMode === "manual" && (
        <div>
          <h2>Manual Entry</h2>
          {playerMode && (
            <>
              <p>Player Name: {playerName}</p>
              <p>Player Team: {playerTeam}</p>
              {/* In player mode, pre-select the player's team and only show their name in player selection */}
            </>
          )}
          {/* Manual entry form fields here */}
        </div>
      )}

      {selectedMode === "screenshot" && (
        <div>
          <h2>Screenshot Upload</h2>
          {/* Screenshot upload and data extraction logic here */}
          {/* When extracting data, if playerMode is true, automatically match the playerName to the extracted IGN */}
        </div>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  )
}
