export default interface GameStore {
  paused: boolean;
  setPaused: (value: boolean) => void;
}
