type CounterController = (count: number | ((prev: number) => number)) => void;

export default CounterController;
