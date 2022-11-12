import AuditLog from "./AuditLog";
import normalDistribution from "./normalDistribution";
import Portfolio from "./Portfolio";
import Simulation from "./Simulation";

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
      ...newPortfolio,
      shares: newPortfolio.shares.map((position) => ({
        ...position,
        price: position.price * (1 + ((normal - 1) * position.leverage)),
      }))
    };

    newPortfolio = {
      ...newPortfolio,
      shares: newPortfolio.shares.map((position) => ({
        ...position,
        total: position.quantity * position.price,
      }))
    };

    newPortfolio = {
      ...newPortfolio,
      total: newPortfolio.shares.reduce((total, position) => position.total + total, 0),
    };

    // rebalance
    newPortfolio = {
      ...newPortfolio,
      shares: newPortfolio.shares.map((position) => {
        return {
          ...position,
          quantity: (newPortfolio.total / 2) / position.price,
        }
      })
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

export default monteCarlo;
