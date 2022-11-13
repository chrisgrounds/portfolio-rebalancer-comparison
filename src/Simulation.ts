import AuditLog from "./AuditLog";
import Portfolio from "./Portfolio";

type Simulation = ({ portfolios, initialPrice, numSimulations }: {
  portfolios: Portfolio[],
  initialPrice: number,
  numSimulations: number
}) => AuditLog[][];

export default Simulation;
