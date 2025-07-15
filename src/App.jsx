import React, { useState, useEffect, useRef } from 'react';
import * as Tone from "tone";

const App = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const lastRungHourRef = useRef(-1);

  const playHourlyRing = () => {
    try {
      if (Tone.context.state !== 'running') {
        Tone.start();
      }
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease("C5", "8n");
    } catch (error) {
      console.error("Error playing sound with Tone.js:", error);
    }
  };

useEffect(() => {
  if (isRunning) {
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newTime = prevTime + 1;
        const currentHour = Math.floor(newTime / 3600);

        if (newTime > 0 && newTime % 3600 === 0 && currentHour !== lastRungHourRef.current) {
          playHourlyRing();
          lastRungHourRef.current = currentHour;
        }

        return newTime;
      });
    }, 1000);
  } else {
    clearInterval(timerRef.current);
  }

  return () => clearInterval(timerRef.current);
}, [isRunning]);

 
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setElapsedTime(0);
    lastRungHourRef.current = -1;
  };

  
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };
  return (
    <>
      <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4 font-inter">
        <div className="p-8 w-full text-center transform transition-all duration-300 ">
          <h1 className="text-4xl font-extrabold text-green-500 mb-6">Amit's Study Time</h1>

          <div className="text-7xl font-mono text-yellow-500 mb-8 p-4 rounded-lg">
            {formatTime(elapsedTime)}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={startTimer}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isRunning}
            >
              Start
            </button>
            <button
              onClick={pauseTimer}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isRunning}
            >
              Pause
            </button>
            <button
              onClick={resetTimer}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
