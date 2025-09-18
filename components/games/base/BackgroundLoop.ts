import {Animated, Easing} from "react-native";

export default class BackgroundLoop {
  private readonly bpm: number;
  private readonly anim: Animated.Value;
  private readonly laneWidth: number;

  private running = false;

  constructor(bpm: number, anim: Animated.Value, laneWidth: number) {
    this.bpm = bpm;
    this.anim = anim;
    this.laneWidth = laneWidth;
  }

  public start() {
    if (this.running) return;
    this.running = true;
    this.runAnimation();
  }

  public stop() {
    this.running = false;
    this.anim.stopAnimation();
  }

  private runAnimation() {
    if (!this.running) return;

    const pixelsPerBeat = 512;
    const duration = (60 / this.bpm) * 1000;

    this.anim.setValue(0);

    Animated.timing(this.anim, {
      toValue: this.laneWidth,
      duration: (duration * this.laneWidth) / pixelsPerBeat,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => this.runAnimation());
  }
}
