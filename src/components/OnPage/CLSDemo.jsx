import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import gsap from 'gsap';

const CLSDemo = ({ clsScore }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShifted, setIsShifted] = useState(false);
  
  // Refs for DOM elements
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const discoverBtnRef = useRef(null);
  const cursorRef = useRef(null);
  const clickEffectRef = useRef(null);
  const annotationsRef = useRef(null);
  const tl = useRef(null);

  const resetDemo = () => {
    if (tl.current) {
      tl.current.kill(); // Kill any ongoing animation
    }
    setIsPlaying(false);
    setIsShifted(false);
    gsap.set(cursorRef.current, { opacity: 0, x: -50, y: -50 });
    gsap.set(clickEffectRef.current, { scale: 0, opacity: 0 });
    gsap.set(annotationsRef.current.children, { opacity: 0 });
  };
  
  const startDemo = () => {
    if (isPlaying) return;
    
    resetDemo();
    setIsPlaying(true);
    
    // Calculate DISCOVER MORE button position dynamically
    const containerRect = containerRef.current.getBoundingClientRect();
    const btnRect = discoverBtnRef.current.getBoundingClientRect();
    const targetX = btnRect.left - containerRect.left + (btnRect.width / 2);
    const targetY = btnRect.top - containerRect.top + (btnRect.height / 2);

    tl.current = gsap.timeline({
      onComplete: () => {
        setIsPlaying(false);
        // Auto-reset after a delay
        setTimeout(resetDemo, 2500);
      }
    });

    tl.current
      .to(cursorRef.current, {
        opacity: 1,
        x: targetX,
        y: targetY,
        duration: 1,
        ease: 'power2.inOut',
      }, 0.5)
      .call(() => setIsShifted(true), null, 1.5)
      .to(headerRef.current, {
        keyframes: {
          "25%": { x: -2 },
          "75%": { x: 2 },
          "100%": { x: 0 },
        },
        duration: 0.4,
        ease: 'none',
      }, 1.5)
      .to(annotationsRef.current.querySelector('.annotation-outline'), { opacity: 0.6 }, 1.8)
      .to(annotationsRef.current.querySelector('.annotation-arrow'), { opacity: 1 }, 1.8)
      .fromTo(clickEffectRef.current, {
        scale: 0,
        opacity: 0.5,
        x: targetX,
        y: targetY,
      }, {
        scale: 1,
        opacity: 0,
        duration: 0.5,
      }, 1.8)
      .fromTo(annotationsRef.current.querySelector('.annotation-miss'), {
        opacity: 0,
        scale: 0.5
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }, 2.0);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (tl.current) {
        tl.current.kill();
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">CLS Visualization Demo Example</h3>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-red-600 dark:text-red-400 font-medium">CLS: {clsScore.toFixed(3)} (Needs Improvement)</div>
          <button onClick={startDemo} disabled={isPlaying} className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors">
            <Play className="w-3 h-3" /> <span>Play Demo</span>
          </button>
          <button onClick={resetDemo} className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition-colors">
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div ref={containerRef} className="relative h-80 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
        {/* Mock Header - Expands when font loads */}
        <header 
          ref={headerRef} 
          className="absolute top-0 left-0 right-0 bg-blue-700 text-white z-10 transition-all duration-300 ease-in-out" 
          style={{ 
            height: isShifted ? '8.75rem' : '6rem', // 6rem (96px) to 8.75rem (140px) = 44px growth
            paddingBottom: isShifted ? '1.5rem' : '0.5rem'
          }}
        >
          <div className="h-full flex flex-col justify-between">
            <div className="px-6 py-3 flex items-center justify-between">
              <div className="font-bold text-2xl">Pushpay</div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline">(206) 870-1880</span>
                <button className="bg-orange-500 px-4 py-2 rounded">LOG IN</button>
              </div>
            </div>
            <div className="px-6 pb-2">
              <nav className="flex gap-8 justify-end text-base">
                <a href="#" className="flex items-center gap-1 hover:text-gray-200">
                  COACHING <span className="text-xs">▼</span>
                </a>
                <a href="#" className="flex items-center gap-1 hover:text-gray-200">
                  TRAINING <span className="text-xs">▼</span>
                </a>
                <a href="#" className="flex items-center gap-1 hover:text-gray-200">
                  PLANNING <span className="text-xs">▼</span>
                </a>
                <a href="#" className="flex items-center gap-1 hover:text-gray-200">
                  SPARK
                </a>
                <a href="#" className="flex items-center gap-1 hover:text-gray-200">
                  TOOLS <span className="text-xs">▼</span>
                </a>
                <a href="#" className="flex items-center gap-1 hover:text-gray-200">
                  COMPANY <span className="text-xs">▼</span>
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section - Gets pushed down by header expansion */}
        <div 
          className="absolute left-0 right-0 bg-blue-900 text-white transition-all duration-300 ease-in-out z-0" 
          style={{ 
            top: isShifted ? '8.75rem' : '6rem', // Moves down as header expands
            height: '8rem' 
          }}
        >
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-xl font-bold mb-3 leading-tight">
              STOP JUST CHASING REVENUE.<br />
              START DRIVING PROFIT.
            </h1>
            <button ref={discoverBtnRef} className="bg-orange-500 px-6 py-3 rounded font-semibold hover:bg-orange-600 text-sm">
              DISCOVER MORE
            </button>
          </div>
        </div>

        {/* Content Area - Also gets pushed down */}
        <div 
          className="absolute left-0 right-0 px-4 transition-all duration-300 ease-in-out" 
          style={{ 
            top: isShifted ? '16.75rem' : '14rem' // Moves down as everything shifts
          }}
        >
          <div className="space-y-3">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="h-8 bg-blue-200 dark:bg-blue-800 rounded flex items-center justify-center text-xs text-blue-800 dark:text-blue-200">Content Block 1</div>
              <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center text-xs text-green-800 dark:text-green-200">Content Block 2</div>
            </div>
          </div>
        </div>
        
        {/* Annotations Layer */}
        <div ref={annotationsRef} className="absolute inset-0 pointer-events-none">
          <div className="annotation-outline absolute top-[calc(50%-40px)] left-[50%] transform -translate-x-1/2 opacity-0 z-30">
            {/* Text above the ghost button */}
            <div className="text-center mb-2">
              <span className="bg-black bg-opacity-60 text-yellow-300 px-3 py-1 rounded text-sm font-bold mt-[-20px]">
                CTA was here
              </span>
            </div>
            
            {/* Ghost button outline - matches DISCOVER MORE dimensions */}
            <div className="border-2 border-dashed border-red-400 px-6 py-5 rounded bg-red-100 bg-opacity-5 w-[160px] mt-[30px]">
              {/* Empty - just showing the outline */}
            </div>
          </div>
          <div className="annotation-arrow absolute top-[180px] left-[200px] text-red-500 dark:text-red-400 text-sm font-bold opacity-0 z-30">↓ 44px shift</div>
          <div className="annotation-miss absolute top-[calc(50%-40px)] right-[10px] bg-red-600 text-white px-6 py-4 rounded-lg shadow-xl opacity-0 z-50 border border-red-800">
            <div className="text-xl font-bold">Lost conversion!</div>
            <div className="text-lg font-semibold opacity-90">CTA shifted down</div>
          </div>
        </div>

        {/* Conversion Counter Overlay */}
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-3 rounded shadow-lg z-30 border border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-600 dark:text-gray-400">Lost This Month:</div>
          <div className="text-lg font-bold text-red-600 dark:text-red-400">2-3 leads</div>
          <div className="text-sm font-semibold text-red-700 dark:text-red-500">= $12,500</div>
        </div>

        {/* Cursor & Click Effect Layer */}
        <div ref={cursorRef} className="absolute pointer-events-none opacity-0" style={{ transform: 'translate(-50%, -50%)', top: '-50px', left: '-50px' }}>
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-t-[16px] border-t-black border-r-[10px] border-r-transparent drop-shadow-lg" />
        </div>
        <div ref={clickEffectRef} className="absolute w-8 h-8 border-2 border-red-500 rounded-full opacity-0" style={{ transform: 'translate(-50%, -50%)' }} />
      </div>
      
      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-sm text-red-800 dark:text-red-200">
          <strong>Business Impact:</strong> When Barlow fonts load, the entire header and hero section shift down by 44px (CLS: 0.404). New visitors trying to click "DISCOVER MORE" - your primary conversion CTA - miss the button entirely. This frustration causes them to leave, costing you approximately $12,500/month (~$150,000 annually) in lost coaching opportunities.
        </p>
        <div className="mt-2 text-xs text-red-600 dark:text-red-400">
          <strong>Fix:</strong> Add <code className="bg-red-100 dark:bg-red-900 px-1 rounded">font-display: swap</code> and preload Barlow fonts to prevent layout shifts.
        </div>
      </div>

      {/* How to Test This Yourself */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          🔍 How to Test This Yourself:
        </h4>
        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <li>1. Open Chrome DevTools (F12)</li>
          <li>2. Go to Network tab → Disable cache</li>
          <li>3. Set throttling to "Slow 3G"</li>
          <li>4. Refresh bdrco.com and watch the header</li>
          <li>5. Notice how content jumps when Barlow font loads</li>
        </ol>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
          The issue is most visible on first visit or with slow connections - exactly when first impressions matter most.
        </p>
      </div>
    </div>
  );
};

export default CLSDemo;