import Portfolio from "./Portfolio";

type AuditLog = {
  iteration: number
  normal: number,
  newUnderlyingPrice: number,
  portfolio: Portfolio,
}

export default AuditLog;
