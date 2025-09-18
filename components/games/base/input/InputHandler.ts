import {PanResponder, PanResponderInstance} from "react-native";
import InputEventListener from "@/components/games/base/input/InputEventListener";
import InputEvent from "@/components/games/base/input/InputEvent";

export default class InputHandler {
  private readonly responder: PanResponderInstance;
  private readonly listeners: InputEventListener[] = [];

  private swipeLocked = false;

  public onInput(listener: InputEventListener) { this.listeners.push(listener); }
  public emit(event: InputEvent) { this.listeners.forEach(listener => listener(event)); }

  constructor() {
    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gestureState) => {
        if (this.swipeLocked) return;

        const { dy } = gestureState;

        if (dy > 30) {
          this.emit(InputEvent.MOVE_DOWN);
          this.swipeLocked = true;
        } else if (dy < -30) {
          this.emit(InputEvent.MOVE_UP);
          this.swipeLocked = true;
        }
      },

      onPanResponderRelease: () => {
        this.swipeLocked = false;
      },
      onPanResponderTerminate: () => {
        this.swipeLocked = false;
      },
    });

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown);
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") this.emit(InputEvent.MOVE_UP);
    if (e.key === "ArrowDown") this.emit(InputEvent.MOVE_DOWN);
  };

  getResponder() {
    return this.responder.panHandlers;
  }

  cleanup() {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.handleKeyDown);
    }
  }
}
