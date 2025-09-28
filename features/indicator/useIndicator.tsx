import {useRef} from "react";
import Indicator from "@/features/indicator/Indicator";
import OnIndicatorVisibleChange from "@/features/indicator/OnIndicatorVisibleChange";

const useIndicator = () => {
  const onIndicatorVisibleChangeRef = useRef<null | OnIndicatorVisibleChange>(null);
  const correctRef = useRef(false);

  const View = () => <Indicator
    registerVisibleController={(fn) => (onIndicatorVisibleChangeRef.current = fn)}
  />;

  const show = (newCorrect: boolean) => {
    correctRef.current = newCorrect;

    if (!onIndicatorVisibleChangeRef.current) return;
    onIndicatorVisibleChangeRef.current?.(true, newCorrect);
  };

  const hide = () => {
    if (!onIndicatorVisibleChangeRef.current) return;
    onIndicatorVisibleChangeRef.current?.(false, correctRef.current);
  }

  return { View, show, hide };
}

export default useIndicator;
