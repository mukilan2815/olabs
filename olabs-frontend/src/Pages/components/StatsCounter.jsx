import React, { useState, useEffect, useRef } from "react";

const StatsCounter = ({ label, endValue }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const countedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !countedRef.current) {
          countedRef.current = true;
          
          const duration = 2000; // ms
          const steps = 50;
          const stepValue = endValue / steps;
          const stepTime = duration / steps;
          
          let currentStep = 0;
          
          const timer = setInterval(() => {
            currentStep++;
            const nextCount = Math.round(stepValue * currentStep);
            setCount(nextCount > endValue ? endValue : nextCount);
            
            if (currentStep >= steps) {
              clearInterval(timer);
              setCount(endValue);
            }
          }, stepTime);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [endValue]);

  return (
    <div className="stats-counter" ref={countRef}>
      <div className="stats-number">{count.toLocaleString()}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
};

export default StatsCounter;
