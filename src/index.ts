import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import fs from "fs";

import Portfolio from "./Portfolio";
import monteCarlo from "./monteCarlo";
import chartConfig from "./chartConfig";
import AuditLog from "./AuditLog";

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

const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

async function run() {
  const data = monteCarlo({ portfolio, initialPrice: 10, numSimulations: 10 }).slice(1);
  const labels: string[] = data.map((d: AuditLog) => d.iteration.toString());

  const underlyingDataset: { label: string, borderColor: string, prices: number[] } = {
    label: "Underlying",
    borderColor: "rgb(51, 204, 204)",
    prices: data.map((d: AuditLog) => d.newUnderlyingPrice),
  };

  const portfolioLabels = data[0].portfolio.shares.map((position) => position.symbol);

  const portfolioDataset: { label: string, borderColor: string, prices: number[] }[] = portfolioLabels.map((label: string) => ({
    label,
    borderColor: `rgb(${randomRange(1, 256)}, ${randomRange(1, 256)}, ${randomRange(1, 256)})`,
    prices: data.map((d: AuditLog) => d.portfolio.shares.find((position) => position.symbol === label)?.total || 0),
  }));

  const totalDataset: { label: string, borderColor: string, prices: number[] } = {
    label: "Total",
    borderColor: "rgb(255, 0, 0)",
    prices: data.map((d: AuditLog) => d.portfolio.total),
  };

  const dataset: { label: string, borderColor: string, prices: number[] }[] = [
    underlyingDataset,
    totalDataset,
    ...portfolioDataset,
  ];

  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 400, height: 400, chartCallback: (ChartJS) => {
      ChartJS.defaults.responsive = true;
      ChartJS.defaults.maintainAspectRatio = false;
    }
  });

  const buffer = await chartJSNodeCanvas.renderToBuffer(chartConfig({ labels, dataset }));

  await fs.writeFileSync("./example.png", buffer, "base64");
}

run();
