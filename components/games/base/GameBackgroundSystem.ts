import {Animated, Easing} from "react-native";
import { GameEngineUpdateEventOptionType } from "react-native-game-engine";

export default class BackgroundSystem {
  private readonly bpm: number;
  private readonly anim: Animated.Value;
  private readonly laneWidth: number;

  constructor(bpm: number, anim: Animated.Value, laneWidth: number) {
    this.bpm = bpm;
    this.anim = anim;
    this.laneWidth = laneWidth;

    this.startAnimation();
  }

  private startAnimation() {
    const pixelsPerBeat = 512;
    const duration = (60 / this.bpm) * 1000;

    this.anim.setValue(0);

    const animate = () => {
      this.anim.setValue(0);
      Animated.timing(this.anim, {
        toValue: this.laneWidth,
        duration: (duration * this.laneWidth) / pixelsPerBeat,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        animate();
      });
    };

    animate();
  }

  system = (entities: any, _options: GameEngineUpdateEventOptionType) => {
    return entities;
  };
}
