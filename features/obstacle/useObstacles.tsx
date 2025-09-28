import {useRef} from "react";
import OnShowObstacles from "@/features/obstacle/OnShowObstacles";
import Obstacles from "@/features/obstacle/Obstacles";

const useObstacles = () => {
  const onShowObstaclesRef = useRef<null | OnShowObstacles>(null);

  const show = (correctLane: number) => onShowObstaclesRef.current?.(correctLane);

  const View = () => <Obstacles registerObstaclesController={fn => (onShowObstaclesRef.current = fn)} />

  return {View, show};
};

export default useObstacles;
