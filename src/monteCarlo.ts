import AuditLog from "./AuditLog";
import normalDistribution from "./normalDistribution";
import Portfolio from "./Portfolio";
import Simulation from "./Simulation";
import fs from "fs";

const monteCarlo: Simulation = ({ portfolios, initialPrice, numSimulations }) => {
  const underlyingPrices: number[] = [initialPrice];
  const auditLogs: AuditLog[][] = portfolios.map(portfolio => [({
    iteration: 0,
    normal: 0,
    newUnderlyingPrice: 0,
    portfolio,
  })]);

  let newPortfolios: Portfolio[] = portfolios;

  for (let i = 1; i < numSimulations + 1; i++) {
    const normal = normalDistribution();

    for (let i = 0; i < portfolios.length; i++) {
      const newUnderlyingPrice = underlyingPrices[i - 1] * normal;

      underlyingPrices.push(newUnderlyingPrice);

      newPortfolios[i] = {
        ...newPortfolios[i],
        shares: newPortfolios[i].shares.map((position) => ({
          ...position,
          price: position.price * (1 + ((normal - 1) * position.leverage)),
        }))
      };

      newPortfolios[i] = {
        ...newPortfolios[i],
        shares: newPortfolios[i].shares.map((position) => ({
          ...position,
          total: position.quantity * position.price,
        }))
      };

      newPortfolios[i] = {
        ...newPortfolios[i],
        total: newPortfolios[i].shares.reduce((total, position) => position.total + total, 0),
      };

      auditLogs[i].push({
        iteration: i,
        normal,
        newUnderlyingPrice,
        portfolio: newPortfolios[i],
      });

      // rebalance
      newPortfolios[i] = {
        ...newPortfolios[i],
        shares: newPortfolios[i].shares.map((position) => {
          return {
            ...position,
            quantity: (newPortfolios[i].total / newPortfolios.length) / position.price,
          }
        })
      };
    };
  };

  for (let i = 0; i < auditLogs.length; i++) {
    try {
      fs.writeFileSync(`./data/auditLogs${i}.json`, JSON.stringify(auditLogs[i], null, 2));
    } catch (err) {
      console.error(err);
    }
  }

  return auditLogs;
}

export default monteCarlo;
