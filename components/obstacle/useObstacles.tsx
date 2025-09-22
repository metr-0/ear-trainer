import {useRef} from "react";
import ObstaclesController from "@/components/obstacle/ObstaclesController";
import Obstacles from "@/components/obstacle/Obstacles";

const useObstacles = () => {
  const obstaclesControllerRef = useRef<null | ObstaclesController>(null);

  const show = (correctLane: number) => obstaclesControllerRef.current?.(correctLane);

  const View = () => <Obstacles registerObstaclesController={fn => (obstaclesControllerRef.current = fn)} />

  return {View, show};
};

export default useObstacles;
