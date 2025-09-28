import {useRef} from "react";
import OnProgressBarShow from "@/features/progressBar/OnProgressBarShow";
import ProgressBar from "@/features/progressBar/ProgressBar";

const useProgressBar = () => {
  const onProgressBarShowRef = useRef<null | OnProgressBarShow>(null);

  const View = () => <ProgressBar registerController={fn => (onProgressBarShowRef.current = fn)} />;
  const show = (duration: number) => onProgressBarShowRef.current?.(duration);

  return {View, show};
}

export default useProgressBar;
