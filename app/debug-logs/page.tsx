"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { getLogs, clearLogs, logs as logStore } from '@/lib/log-service'; // Assuming logs can be imported for live updates
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

export default function DebugLogsPage() {
  const [currentLogs, setCurrentLogs] = useState(getLogs());
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);

  const refreshLogs = useCallback(() => {
    setCurrentLogs(getLogs());
  }, []);

  useEffect(() => {
    if (isLiveUpdating) {
      const intervalId = setInterval(() => {
        // Check if the actual log store has more logs than currently displayed
        if (logStore.length !== currentLogs.length) {
          refreshLogs();
        }
      }, 2000); // Refresh every 2 seconds if live updating

      return () => clearInterval(intervalId);
    }
  }, [isLiveUpdating, refreshLogs, currentLogs.length]);

  const handleClearLogs = () => {
    clearLogs();
    refreshLogs(); // Refresh to show the "Log cache cleared." message
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#f5f5f5', color: '#333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px' }}>Debug Logs</h1>
        <div>
          <Button onClick={() => setIsLiveUpdating(!isLiveUpdating)} variant="outline" style={{ marginRight: '10px' }}>
            {isLiveUpdating ? 'Pause Live Update' : 'Resume Live Update'}
          </Button>
          <Button onClick={refreshLogs} variant="outline" style={{ marginRight: '10px' }}>
            Refresh Logs
          </Button>
          <Button onClick={handleClearLogs} variant="destructive">
            Clear Logs
          </Button>
        </div>
      </div>
      <div style={{ maxHeight: '80vh', overflowY: 'auto', backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
        {currentLogs.length === 0 ? (
          <p>No logs yet. Navigate through the app to generate logs.</p>
        ) : (
          currentLogs.map((log, index) => (
            <div key={index} style={{ borderBottom: '1px solid #eee', padding: '5px 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              <span style={{ color: '#007acc', marginRight: '10px' }}>{log.timestamp}</span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{log.message}</span>
              {log.args && <span style={{ color: '#555', marginLeft: '5px' }}>{log.args}</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
