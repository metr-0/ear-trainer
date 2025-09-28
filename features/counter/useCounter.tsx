import {useRef} from "react";
import Counter from "@/features/counter/Counter";
import OnCounterVisibleChange from "@/features/counter/OnCounterVisibleChange";
import OnCountChange from "@/features/counter/OnCountChange";

const useCounter = (maxCount: number) => {
  const onCountChangeRef = useRef<null | OnCountChange>(null);
  const onCounterVisibleChangeRef = useRef<null | OnCounterVisibleChange>(null);

  const inc = () => onCountChangeRef.current?.(count => count + 1);
  const reset = () => onCountChangeRef.current?.(0);

  const show = () => onCounterVisibleChangeRef.current?.(true);
  const hide = () => onCounterVisibleChangeRef.current?.(false);

  const View = () => <Counter
    maxCount={maxCount}
    registerController={fn => (onCountChangeRef.current = fn)}
    registerVisibleController={fn => (onCounterVisibleChangeRef.current = fn)}
  />;

  return {View, inc, reset, show, hide};
};

export default useCounter;
