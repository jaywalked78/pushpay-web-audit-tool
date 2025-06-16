import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const ScoreCircle = ({ score, maxScore = 100 }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [currentColor, setCurrentColor] = useState('#ef4444'); // Start with red
  const [scoreLabel, setScoreLabel] = useState('Needs Improvement');
  const [dashOffset, setDashOffset] = useState(0);
  
  const circleRef = useRef(null);

  useEffect(() => {
    // Calculate circle properties
    const size = 200;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI * 2;
    
    // Set initial dasharray
    setDashOffset(circumference);

    // Create a single timeline to sync both animations
    const tl = gsap.timeline();
    
    // Animate BOTH the number AND the circle together
    tl.to({ 
      value: 0,
      progress: 0 
    }, {
      value: score,
      progress: score,
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.3,
      onUpdate: function() {
        const obj = this.targets()[0];
        const currentVal = obj.value;
        const progressPercent = obj.progress / maxScore;
        
        // Update the number display
        setDisplayScore(currentVal);
        
        // Update the circle fill progressively - smooth stroke-dashoffset
        const offset = circumference - (progressPercent * circumference);
        setDashOffset(offset);
        
        // Update colors and text based on percentage progress, not just value
        const progressRatio = currentVal / score; // 0 to 1 based on animation progress
        
        if (progressRatio < 0.6) { // First 60% of animation
          setCurrentColor('#ef4444'); // red
          setScoreLabel('Needs Improvement');
        } else if (progressRatio < 0.85) { // 60% to 85% of animation 
          setCurrentColor('#f59e0b'); // yellow
          setScoreLabel('Good');
        } else { // 85%+ of animation
          setCurrentColor('#10b981'); // green
          setScoreLabel('Excellent');
        }
      }
    });

    return () => {
      tl.kill();
    };
  }, [score, maxScore]);

  // Calculate circle properties for JSX
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
            className="dark:stroke-gray-700"
          />
          {/* Progress circle - controlled by GSAP */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={currentColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-colors duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            {displayScore.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            out of {maxScore}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            On-Page Score
          </div>
        </div>
      </div>
      
      {/* Score interpretation */}
      <div className="mt-4 text-center">
        <div 
          className={`text-lg font-semibold transition-colors duration-300`} 
          style={{ color: currentColor }}
        >
          {scoreLabel}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Your website is performing {
            scoreLabel === 'Excellent' ? 'exceptionally well' : 
            scoreLabel === 'Good' ? 'well with room for improvement' : 
            'below optimal levels'
          }
        </div>
      </div>
    </div>
  );
};

export default ScoreCircle;