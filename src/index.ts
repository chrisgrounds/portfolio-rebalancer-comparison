import Portfolio from "./Portfolio";
import monteCarlo from "./monteCarlo";

const portfolio: Portfolio = {
  total: (100 * 100) + (1000 * 10),
  shares: [
    {
      symbol: "abc",
      quantity: 100,
      price: 100,
      leverage: 1,
      total: 10000,
    },
    {
      symbol: "abcx",
      quantity: 1000,
      price: 10,
      leverage: 3,
      total: 10000,
    }
  ]
};

console.log(monteCarlo({ portfolio, initialPrice: 10, numSimulations: 10 }));
