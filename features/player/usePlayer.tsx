import {useRef} from "react";
import Player from "@/features/player/Player";
import PlayerColor from "@/features/player/PlayerColor";
import OnPlayerLaneChange from "@/features/player/OnPlayerLaneChange";
import OnPlayerColorChange from "@/features/player/OnPlayerColorChange";

const usePlayer = () => {
  const onPlayerLaneChangeRef = useRef<null | OnPlayerLaneChange>(null);
  const onPlayerColorChangeRef = useRef<null | OnPlayerColorChange>(null);
  const getLaneRef = useRef<null | (() => number)>(null);

  const View = () => <Player
    registerLaneController={(fn) => (onPlayerLaneChangeRef.current = fn)}
    registerColorController={(fn) => (onPlayerColorChangeRef.current = fn)}
    registerGetLane={(fn) => (getLaneRef.current = fn)}
  />;

  const moveTo = (newLane: number) => {
    onPlayerLaneChangeRef.current?.(newLane);
  };

  const moveUp = () => {
    onPlayerLaneChangeRef.current?.((prev) => Math.max(-1, prev - 1));
  };

  const moveDown = () => {
    onPlayerLaneChangeRef.current?.((prev) => Math.min(1, prev + 1));
  };

  const setColor = (color: PlayerColor) => {
    onPlayerColorChangeRef.current?.(color);
  };

  const getLane = () => {
    return getLaneRef.current ? getLaneRef.current() : 0;
  };

  return {View, getLane, moveTo, moveUp, moveDown, setColor};
}

export default usePlayer;
