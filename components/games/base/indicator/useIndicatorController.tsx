import {useRef} from "react";
import Indicator from "@/components/games/base/indicator/Indicator";
import IndicatorVisibleController from "@/components/games/base/indicator/IndicatorVisibleController";

const useIndicatorController = (scales: any) => {
  const indicatorShowControllerRef = useRef<null | IndicatorVisibleController>(null);
  const correctRef = useRef(false);

  const View = () => <Indicator
    scales={scales}
    registerVisibleController={(fn) => (indicatorShowControllerRef.current = fn)}
  />;

  const show = (newCorrect: boolean) => {
    correctRef.current = newCorrect;

    if (!indicatorShowControllerRef.current) return;
    indicatorShowControllerRef.current?.(true, newCorrect);
  };

  const hide = () => {
    if (!indicatorShowControllerRef.current) return;
    indicatorShowControllerRef.current?.(false, correctRef.current);
  }

  return { View, show, hide };
}

export default useIndicatorController;
