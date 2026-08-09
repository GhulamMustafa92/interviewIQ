import React from 'react';

export default function Timer({ timeLeft  ,TotalTime  }) {
  const percentage = Math.max(0, Math.min(100, (timeLeft / TotalTime) * 100));
  
  // SVG Circle configuration
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on time left
  const isLowTime = percentage < 25;
  const colorClass = isLowTime ? "text-red-500" : "text-emerald-500";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="text-gray-200 stroke-current"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className={`${colorClass} stroke-current transition-all duration-1000 ease-linear`}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Timer Text inside the circle */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${isLowTime ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
          {timeLeft}
        </span>
        <span className="text-[10px] text-gray-400 font-bold uppercase">Sec</span>
      </div>
    </div>
  );
}
