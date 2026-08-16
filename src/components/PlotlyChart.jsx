import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "../lib/plotly-custom";
import { BASE_CONFIG, mergeLayout } from "../lib/plotlyTheme";

const Plot = createPlotlyComponent(Plotly);

export default function PlotlyChart({ data, layout = {}, height = 340 }) {
  return (
    <Plot
      data={data}
      layout={{ ...mergeLayout(layout), height, autosize: true }}
      config={BASE_CONFIG}
      style={{ width: "100%", height: `${height}px` }}
      useResizeHandler
    />
  );
}
