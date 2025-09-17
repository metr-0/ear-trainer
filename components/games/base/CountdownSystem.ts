import {Animated, Easing} from "react-native";
import {GameEngineUpdateEventOptionType} from "react-native-game-engine";
import CountdownEventListener from "@/components/games/base/CountdownEventListener";
import CountdownEvent from "@/components/games/base/CountdownEvent";

export default class CountdownSystem {
  private readonly anim: Animated.Value;
  private readonly duration: number;

  private readonly listeners: CountdownEventListener[] = [];

  private animation?: Animated.CompositeAnimation;
  private startTime: number = 0;

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

    this.animation.start();

    this.startTime = Date.now();
    this.emit(CountdownEvent.STARTED);
  }

  public onEvent = (listener: CountdownEventListener) => {
    this.listeners.push(listener);
    if (Date.now() - this.startTime < this.duration) listener(CountdownEvent.STARTED);
  }

  private emit = (event: CountdownEvent) => this.listeners.forEach(listener => listener(event));

  public system = (entities: any, _options: GameEngineUpdateEventOptionType) => {
    if (this.startTime && Date.now() - this.startTime > this.duration) {
      this.startTime = 0;
      this.emit(CountdownEvent.COMPLETED);
    }

    return entities;
  };
}
