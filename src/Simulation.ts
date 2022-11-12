import Portfolio from "./Portfolio";

type Simulation = ({ portfolio, initialPrice, numSimulations }: {
  portfolio: Portfolio,
  initialPrice: number,
  numSimulations: number
}) => number[];

export default Simulation;
