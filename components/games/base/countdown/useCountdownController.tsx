import {useRef} from "react";
import CountdownNumberController from "@/components/games/base/countdown/CountdownNumberController";
import Countdown from "@/components/games/base/countdown/Countdown";

const useCountdownController = (scales: any) => {
  const numberControllerRef = useRef<null | CountdownNumberController>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const View = () => <Countdown
    scales={scales}
    registerNumberController={(fn) => (numberControllerRef.current = fn)}
  />;

  const startCountdown = (duration: number, ticks: number) => {
    if (!numberControllerRef.current) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    let remaining = ticks;
    numberControllerRef.current?.(remaining);

    const interval = duration / ticks;

    timerRef.current = setInterval(() => {
      remaining -= 1;
      numberControllerRef.current?.(remaining);

      if (remaining <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, interval);
  };

  return {View, startCountdown};
}

export default useCountdownController;
