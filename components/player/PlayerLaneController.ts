type PlayerLaneController = (lane: number | ((prev: number) => number)) => void;

export default PlayerLaneController;
