import Portfolio from "./Portfolio";
import Distribution from "./Distribution";

type Simulation = ({ portfolio, initialPrice, numSimulations }: {
  portfolio: Portfolio,
  initialPrice: number,
  numSimulations: number
}) => number[];

export default Simulation;
