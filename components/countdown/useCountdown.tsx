import {useRef} from "react";
import CountdownNumberController from "@/components/countdown/CountdownNumberController";
import Countdown from "@/components/countdown/Countdown";

const useCountdown = () => {
  const numberControllerRef = useRef<null | CountdownNumberController>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const View = () => <Countdown
    registerNumberController={(fn) => (numberControllerRef.current = fn)}
  />;

  const startCountdown = (duration: number, ticks: number) => {
    if (!numberControllerRef.current) return;
    if (timerRef.current) {
      clearInterval(timerRef.current as any);
      timerRef.current = null;
    }

    let remaining = ticks;
    numberControllerRef.current?.(remaining);

    const interval = duration / ticks;

    timerRef.current = setInterval(() => {
      remaining -= 1;
      numberControllerRef.current?.(remaining);

      if (remaining <= 0 && timerRef.current) {
        clearInterval(timerRef.current as any);
        timerRef.current = null;
      }
    }, interval);
  };

  return {View, startCountdown};
}

export default useCountdown;
