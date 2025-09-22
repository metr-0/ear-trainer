import {useRef} from "react";
import ProgressBarController from "@/components/progressBar/ProgressBarController";
import ProgressBar from "@/components/progressBar/ProgressBar";

const useProgressBar = () => {
  const controllerRef = useRef<null | ProgressBarController>(null);

  const View = () => <ProgressBar registerController={fn => (controllerRef.current = fn)} />;
  const show = (duration: number) => controllerRef.current?.(duration);

  return {View, show};
}

export default useProgressBar;
