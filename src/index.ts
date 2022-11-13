import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import fs from "fs";

import Portfolio from "./Portfolio";
import monteCarlo from "./monteCarlo";
import chartConfig from "./chartConfig";
import AuditLog from "./AuditLog";

const ordsPortfolio: Portfolio = {
  total: (100 * 100) + (1000 * 10),
  shares: [
    {
      symbol: "ords",
      quantity: 100,
      price: 100,
      leverage: 1,
      total: 10000,
    }
  ]
};

const leveragedPortfolio: Portfolio = {
  total: (100 * 100) + (1000 * 10),
  shares: [
    {
      symbol: "ords",
      quantity: 100,
      price: 100,
      leverage: 1,
      total: 10000,
    },
    {
      symbol: "3x",
      quantity: 1000,
      price: 10,
      leverage: 3,
      total: 10000,
    }
  ]
};

const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

async function run() {
  const auditLogs = monteCarlo({ portfolios: [ordsPortfolio, leveragedPortfolio], initialPrice: 10, numSimulations: 10 });

  for (let i = 0; i < auditLogs.length; i++) {
    const auditLog = auditLogs[i];

    const labels: string[] = auditLog.map((d: AuditLog) => d.normal.toFixed(2));

    const portfolioLabels = auditLog[0].portfolio.shares.map((position) => position.symbol);

    const portfolioDataset: { label: string, borderColor: string, prices: number[] }[] = portfolioLabels.map((label: string) => ({
      label,
      borderColor: `rgb(${randomRange(1, 256)}, ${randomRange(1, 256)}, ${randomRange(1, 256)})`,
      prices: auditLog.map((d: AuditLog) => d.portfolio.shares.find((position) => position.symbol === label)?.total || 0),
    }));

    const totalPortfolioDataset: { label: string, borderColor: string, prices: number[] } = {
      label: "Total",
      borderColor: "rgb(255, 0, 0)",
      prices: auditLog.map((d: AuditLog) => d.portfolio.total),
    };

    const dataset: { label: string, borderColor: string, prices: number[] }[] = [
      totalPortfolioDataset,
      ...portfolioDataset,
    ];

    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: 400, height: 400, chartCallback: (ChartJS) => {
        ChartJS.defaults.responsive = true;
        ChartJS.defaults.maintainAspectRatio = false;
      }
    });

    const buffer = await chartJSNodeCanvas.renderToBuffer(chartConfig({ labels, dataset }));

    await fs.writeFileSync(`./data/auditLog${i}.png`, buffer, "base64");
  }
}

run();
