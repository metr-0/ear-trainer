import {Animated, Easing} from "react-native";
import ProgressBarEventListener from "@/components/games/base/progressBar/ProgressBarEventListener";
import ProgressBarEvent from "@/components/games/base/progressBar/ProgressBarEvent";

export default class ProgressBarTimer {
  private readonly anim: Animated.Value;
  private readonly duration: number;

  private readonly listeners: ProgressBarEventListener[] = [];

  private animation?: Animated.CompositeAnimation;

  constructor(durationMs: number, anim: Animated.Value) {
    this.anim = anim;
    this.duration = durationMs;
  }

  public start() {
    if (this.animation) {
      this.animation.stop();
    }

    this.anim.setValue(0);
    this.animation = Animated.timing(this.anim, {
      toValue: 1,
      duration: this.duration,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    this.animation.start(({ finished }) => {
      if (finished) {
        this.emit(ProgressBarEvent.COMPLETED);
      }
    });

    this.emit(ProgressBarEvent.STARTED);
  }

  public onEvent = (listener: ProgressBarEventListener) => {
    this.listeners.push(listener);
  }

  private emit = (event: ProgressBarEvent) => this.listeners.forEach(listener => listener(event));
}
