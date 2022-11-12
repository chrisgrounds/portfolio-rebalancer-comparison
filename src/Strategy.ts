import Portfolio from "./Portfolio";

type Strategy = (portfolio: Portfolio, changeInPriceAsPercent: number) => Portfolio;

export default Strategy;
