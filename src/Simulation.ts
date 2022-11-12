import Strategy from "./Strategy";
import Distribution from "./Distribution";

type Simulation = ({ strategy, initialPrice, numSimulations }: {
  strategy: Strategy,
  initialPrice: number,
  numSimulations: number
}) => number[];

export default Simulation;
