import {Animated, Easing} from "react-native";

export default class PlayerController {
  private readonly anim: Animated.Value;
  private lane: number;

  constructor(anim, initialLane = 0) {
    this.anim = anim;
    this.lane = initialLane;
  }

  getLane() {
    return this.lane;
  }

  public moveTo(newLane: number) {
    this.lane = newLane;
    Animated.timing(this.anim, {
      toValue: newLane,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }

  public moveUp() {
    if (this.lane > -1) {
      this.moveTo(this.lane - 1);
    }
  }

  public moveDown() {
    if (this.lane < 1) {
      this.moveTo(this.lane + 1);
    }
  }
}
