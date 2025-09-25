import {useRef} from "react";
import Player from "@/components/player/Player";
import PlayerColor from "@/components/player/PlayerColor";
import PlayerLaneController from "@/components/player/PlayerLaneController";
import PlayerColorController from "@/components/player/PlayerColorController";

const usePlayer = () => {
  const laneControllerRef = useRef<null | PlayerLaneController>(null);
  const colorControllerRef = useRef<null | PlayerColorController>(null);
  const getLaneRef = useRef<null | (() => number)>(null);

  const View = () => <Player
    registerLaneController={(fn) => (laneControllerRef.current = fn)}
    registerColorController={(fn) => (colorControllerRef.current = fn)}
    registerGetLane={(fn) => (getLaneRef.current = fn)}
  />;

  const moveTo = (newLane: number) => {
    laneControllerRef.current?.(newLane);
  };

  const moveUp = () => {
    laneControllerRef.current?.((prev) => Math.max(-1, prev - 1));
  };

  const moveDown = () => {
    laneControllerRef.current?.((prev) => Math.min(1, prev + 1));
  };

  const setColor = (color: PlayerColor) => {
    colorControllerRef.current?.(color);
  };

  const getLane = () => {
    return getLaneRef.current ? getLaneRef.current() : 0;
  };

  return {View, getLane, moveTo, moveUp, moveDown, setColor};
}

export default usePlayer;
