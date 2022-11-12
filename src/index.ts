import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import fs from "fs";

import Portfolio from "./Portfolio";
import monteCarlo from "./monteCarlo";
import chartConfig from "./chartConfig";

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

async function run() {
  console.log(monteCarlo({ portfolio, initialPrice: 10, numSimulations: 10 }));

  const data = null;

  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 400, height: 400, chartCallback: (ChartJS) => {
      ChartJS.defaults.responsive = true;
      ChartJS.defaults.maintainAspectRatio = false;
    }
  });
  const buffer = await chartJSNodeCanvas.renderToBuffer(chartConfig(data));
  await fs.writeFileSync("./example.png", buffer, "base64");
}

run();
