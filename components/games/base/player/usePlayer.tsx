import PlayerController from "@/components/games/base/player/PlayerController";
import Player from "@/components/games/base/player/Player";
import {useRef} from "react";
import {Animated} from "react-native";

const usePlayer = (images: {front: any, back: any}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const controller = useRef(new PlayerController(anim)).current;

  const View = () => <Player images={images} anim={anim} />;

  return {View, controller}
}

export default usePlayer;
