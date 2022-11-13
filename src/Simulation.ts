import AuditLog from "./AuditLog";
import Portfolio from "./Portfolio";

type Simulation = ({ portfolio, initialPrice, numSimulations }: {
  portfolio: Portfolio,
  initialPrice: number,
  numSimulations: number
}) => AuditLog[];

export default Simulation;
