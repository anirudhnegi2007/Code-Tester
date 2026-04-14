// ─── useCountUp hook ─────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";


function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = Math.ceil(duration / 16);
        const inc = target / steps;
        let cur = 0;
        const interval = setInterval(() => {
          cur = Math.min(cur + inc, target);
          setCount(Math.round(cur));
          if (cur >= target) clearInterval(interval);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return [ref, count];
}

export default useCountUp;
