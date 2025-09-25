import {useRef} from "react";
import PianoController from "@/components/piano/PianoController";
import Piano from "@/components/piano/Piano";

const usePiano = (onPlay: (midi: number) => void) => {
  const controllerRef = useRef<null | PianoController>(null);

  const set = (startNote: number, highlightedNote: number) =>
    controllerRef.current?.(startNote, highlightedNote);

  const View = () => <Piano
    onPlay={onPlay}
    registerController={fn => (controllerRef.current = fn)}
  />

  return {View, set};
};

export default usePiano;
