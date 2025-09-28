import {useRef} from "react";
import OnCountdownNumberChange from "@/features/countdown/OnCountdownNumberChange";
import Countdown from "@/features/countdown/Countdown";

const useCountdown = () => {
  const onCountdownNumberChangeRef = useRef<null | OnCountdownNumberChange>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const View = () => <Countdown
    registerNumberController={(fn) => (onCountdownNumberChangeRef.current = fn)}
  />;

  const startCountdown = (duration: number, ticks: number) => {
    if (!onCountdownNumberChangeRef.current) return;
    if (timerRef.current) {
      clearInterval(timerRef.current as any);
      timerRef.current = null;
    }

    let remaining = ticks;
    onCountdownNumberChangeRef.current?.(remaining);

    const interval = duration / ticks;

    timerRef.current = setInterval(() => {
      remaining -= 1;
      onCountdownNumberChangeRef.current?.(remaining);

      if (remaining <= 0 && timerRef.current) {
        clearInterval(timerRef.current as any);
        timerRef.current = null;
      }
    }, interval);
  };

  return {View, startCountdown};
}

export default useCountdown;
