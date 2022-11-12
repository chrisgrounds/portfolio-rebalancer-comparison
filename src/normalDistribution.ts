import Distribution from "./Distribution";

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

export default normalDistribution;
