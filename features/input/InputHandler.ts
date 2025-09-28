import {PanResponder, PanResponderInstance, Platform} from "react-native";
import InputEventListener from "@/features/input/InputEventListener";
import InputEvent from "@/features/input/InputEvent";

export default class InputHandler {
  private readonly responder: PanResponderInstance;
  private listeners: InputEventListener[] = [];

  private swipeLocked = false;

  public onInput(listener: InputEventListener) {
    this.listeners.push(listener);
    return () => this.listeners = this.listeners.filter(l => l !== listener);
  }
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

    if (Platform.OS === 'web') {
      if (typeof window !== "undefined") {
        window.addEventListener("keydown", this.handleKeyDown);
      }
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
    if (Platform.OS === 'web') {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", this.handleKeyDown);
      }
    }
  }
}
