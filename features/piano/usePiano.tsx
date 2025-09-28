import {useRef} from "react";
import OnPianoChange from "@/features/piano/OnPianoChange";
import Piano from "@/features/piano/Piano";

const usePiano = (onPlay: (midi: number) => void) => {
  const onPianoChangeRef = useRef<null | OnPianoChange>(null);

  const set = (startNote: number, highlightedNote: number) =>
    onPianoChangeRef.current?.(startNote, highlightedNote);

  const View = () => <Piano
    onPlay={onPlay}
    registerController={fn => (onPianoChangeRef.current = fn)}
  />

  return {View, set};
};

export default usePiano;
