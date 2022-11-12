import fs from "fs";

import Simulation from "./Simulation";
import Strategy from "./Strategy";
import AuditLog from "./AuditLog";
import Portfolio from "./Portfolio";
import Position from "./Position";
import normalDistribution from "./normalDistribution";

const monteCarlo: Simulation = ({ portfolio, initialPrice, numSimulations }) => {
  const underlyingPrices: number[] = [initialPrice];
  const auditLog: AuditLog[] = [];
  let newPortfolio: Portfolio;

  for (let i = 1; i < numSimulations + 1; i++) {
    const normal = normalDistribution();
    const newUnderlyingPrice = underlyingPrices[i - 1] * normal;

    underlyingPrices.push(newUnderlyingPrice);

    newPortfolio = {
      shares: portfolio.shares.map((position) => ({
        ...position,
        price: position.price * (1 + ((normal - 1) * position.leverage)),
      }))
    };

    auditLog.push({
      iteration: i,
      normal,
      newUnderlyingPrice,
      portfolio: newPortfolio,
    });
  };

  try {
    fs.writeFileSync('./output.json', JSON.stringify(auditLog, null, 2));
  } catch (err) {
    console.error(err);
  }
  return underlyingPrices;
}

const portfolio: Portfolio = {
  shares: [
    {
      symbol: "abc",
      quantity: 100,
      price: 100,
      leverage: 1,
    },
    {
      symbol: "abcx",
      quantity: 100,
      price: 10,
      leverage: 3
    }
  ]
};

// TODO: rebalancing

console.log(monteCarlo({ portfolio, initialPrice: 10, numSimulations: 10 }));

// const sharesOnlyResult = monteCarlo.simulate(sharesOnly);
// const leverageAndSharesResult = monteCarlo.simulate(leverageAndShares);

// console.log(sharesOnlyResult)
// console.log(leverageAndSharesResult)
