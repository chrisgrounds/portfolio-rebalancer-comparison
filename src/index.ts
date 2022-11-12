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
  let newPortfolio: Portfolio = portfolio;

  auditLog.push({
    iteration: 0,
    normal: 0,
    newUnderlyingPrice: 0,
    portfolio: newPortfolio,
  });

  for (let i = 1; i < numSimulations + 1; i++) {
    const normal = normalDistribution();
    const newUnderlyingPrice = underlyingPrices[i - 1] * normal;

    underlyingPrices.push(newUnderlyingPrice);

    newPortfolio = {
      shares: newPortfolio.shares.map((position) => ({
        ...position,
        price: position.price * (1 + ((normal - 1) * position.leverage)),
      }))
    };

    const portfolioTotal = newPortfolio.shares.reduce((total, position) => position.price * position.quantity + total, 0);

    newPortfolio = {
      shares: newPortfolio.shares.map((position) => ({
        ...position,
        quantity: position.quantity * (portfolioTotal / (position.price * position.quantity)),
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
      quantity: 1000,
      price: 10,
      leverage: 3
    }
  ]
};


console.log(monteCarlo({ portfolio, initialPrice: 10, numSimulations: 10 }));

// const sharesOnlyResult = monteCarlo.simulate(sharesOnly);
// const leverageAndSharesResult = monteCarlo.simulate(leverageAndShares);

// console.log(sharesOnlyResult)
// console.log(leverageAndSharesResult)
