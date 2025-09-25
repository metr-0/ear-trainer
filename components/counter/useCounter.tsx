import {useRef, useState} from "react";
import Counter from "@/components/counter/Counter";
import CounterVisibleController from "@/components/counter/CounterVisibleController";
import CounterController from "@/components/counter/CounterController";

const useCounter = (maxCount: number) => {
  const controllerRef = useRef<null | CounterController>(null);
  const visibleControllerRef = useRef<null | CounterVisibleController>(null);

  const inc = () => controllerRef.current?.(count => count + 1);
  const reset = () => controllerRef.current?.(0);

  const show = () => visibleControllerRef.current?.(true);
  const hide = () => visibleControllerRef.current?.(false);

  const View = () => <Counter
    maxCount={maxCount}
    registerController={fn => (controllerRef.current = fn)}
    registerVisibleController={fn => (visibleControllerRef.current = fn)}
  />;

  return {View, inc, reset, show, hide};
};

export default useCounter;
