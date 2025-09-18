import {Animated, Easing} from "react-native";
import CountdownEventListener from "@/components/games/base/countdown/CountdownEventListener";
import CountdownEvent from "@/components/games/base/countdown/CountdownEvent";

export default class CountdownTimer {
  private readonly anim: Animated.Value;
  private readonly duration: number;

  private readonly listeners: CountdownEventListener[] = [];

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
        this.emit(CountdownEvent.COMPLETED);
      }
    });

    this.emit(CountdownEvent.STARTED);
  }

  public onEvent = (listener: CountdownEventListener) => {
    this.listeners.push(listener);
  }

  private emit = (event: CountdownEvent) => this.listeners.forEach(listener => listener(event));
}
