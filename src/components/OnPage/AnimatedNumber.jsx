import React, { useEffect, useState } from 'react';

const AnimatedNumber = ({ value, duration = 2000, decimals = 0, delay = 0, suffix = '', className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now() + delay;
    const endTime = startTime + duration;
    const startValue = 0;
    const endValue = parseFloat(value);

    const animate = () => {
      const now = Date.now();
      
      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }
      
      if (now >= endTime) {
        setDisplayValue(endValue);
        return;
      }

      const progress = (now - startTime) / duration;
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      
      setDisplayValue(currentValue);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, duration, delay]);

  const formatNumber = (num) => {
    return decimals > 0 ? num.toFixed(decimals) : Math.floor(num);
  };

  return (
    <span className={className}>
      {formatNumber(displayValue)}{suffix}
    </span>
  );
};

export default AnimatedNumber;