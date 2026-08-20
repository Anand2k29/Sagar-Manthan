import { useState, useEffect } from 'react';

export function useAnimatedCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const numTarget = typeof target === 'string' ? parseInt(target.replace(/,/g, '')) : target;

  useEffect(() => {
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numTarget));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [numTarget, duration]);

  return count.toLocaleString();
}

export default function AnimatedCounter({ value, className = '' }) {
  const animated = useAnimatedCounter(value);
  return <span className={className}>{animated}</span>;
}
