type OnPlayerLaneChange = (lane: number | ((prev: number) => number)) => void;

export default OnPlayerLaneChange;
