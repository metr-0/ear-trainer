import Player from "@/components/games/base/player/Player";
import {useRef} from "react";
import PlayerColor from "@/components/games/base/player/PlayerColor";
import PlayerLaneController from "@/components/games/base/player/PlayerLaneController";
import PlayerColorController from "@/components/games/base/player/PlayerColorController";

const usePlayerController = (scales: any) => {
  const laneControllerRef = useRef<null | PlayerLaneController>(null);
  const colorControllerRef = useRef<null | PlayerColorController>(null);
  const getLaneRef = useRef<null | (() => number)>(null);

  const View = () => <Player
    scales={scales}
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

export default usePlayerController;
