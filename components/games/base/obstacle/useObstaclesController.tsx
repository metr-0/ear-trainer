import {useRef} from "react";
import ObstaclesController from "@/components/games/base/obstacle/ObstaclesController";
import Obstacles from "@/components/games/base/obstacle/Obstacles";

const useObstaclesController = () => {
  const obstaclesControllerRef = useRef<null | ObstaclesController>(null);

  const show = (correctLane: number) => obstaclesControllerRef.current?.(correctLane);

  const View = () => <Obstacles registerObstaclesController={fn => (obstaclesControllerRef.current = fn)} />

  return {View, show};
};

export default useObstaclesController;
