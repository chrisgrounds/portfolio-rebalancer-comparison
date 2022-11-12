import { ChartConfiguration } from "chart.js";

const chartConfig = (data: { labels: string[], dataset: { label: string, prices: number[] }[] }): ChartConfiguration => ({
  type: "line",
  data: {
    labels: data.labels,
    datasets: data.dataset.map(({ label, prices }: { label: string, prices: number[] }) => ({
      label: label,
      data: prices.map(price => price),
      fill: false,
      borderColor: ["rgb(51, 204, 204)"],
      borderWidth: 1,
      xAxisID: "xAxis1"
    }))
  },
  options: {
    scales: {
      y: {
        suggestedMin: 0,
      }
    }
  }
});

export default chartConfig;
