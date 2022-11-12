import fs from "fs";

import Simulation from "./Simulation";
import Strategy from "./Strategy";
import Distribution from "./Distribution";
import AuditLog from "./AuditLog";
import Portfolio from "./Portfolio";
import Position from "./Position";

// https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
const normalDistribution: Distribution = (): number => {
  const u = Math.random();
  const v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 1; // Normalise to .5 -> 1.5

  return (num > 1.5 || num < 0.5)
    ? normalDistribution() // resample between 0 and 1
    : num;
}

const monteCarlo: Simulation = ({ strategy, initialPrice, numSimulations }) => {
  const underlyingPrices: number[] = [initialPrice];
  const auditLog: AuditLog[] = [];

  for (let i = 1; i < numSimulations + 1; i++) {
    const normal = normalDistribution();
    const newUnderlyingPrice = underlyingPrices[i - 1] * normal;

    underlyingPrices.push(newUnderlyingPrice);

    auditLog.push({
      iteration: i,
      normal,
      newUnderlyingPrice
    });
  };

  try {
    fs.writeFileSync('./output.json', JSON.stringify(auditLog, null, 2));
  } catch (err) {
    console.error(err);
  }
  return underlyingPrices;
}

const shares: Strategy = (changeInPriceAsPercent: number) => changeInPriceAsPercent;
const leveraged2x: Strategy = (changeInPriceAsPercent: number) => changeInPriceAsPercent * 2;
const leveraged3x: Strategy = (changeInPriceAsPercent: number) => changeInPriceAsPercent * 3;


// TODO: rebalancing

console.log(monteCarlo({ strategy: shares, initialPrice: 10, numSimulations: 10 }));

// const sharesOnlyResult = monteCarlo.simulate(sharesOnly);
// const leverageAndSharesResult = monteCarlo.simulate(leverageAndShares);

// console.log(sharesOnlyResult)
// console.log(leverageAndSharesResult)
