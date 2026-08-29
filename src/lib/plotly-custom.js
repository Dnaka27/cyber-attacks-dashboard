import Plotly from "plotly.js/lib/core";
import bar from "plotly.js/lib/bar";
import scatter from "plotly.js/lib/scatter";
import histogram from "plotly.js/lib/histogram";
import pie from "plotly.js/lib/pie";
import heatmap from "plotly.js/lib/heatmap";
import box from "plotly.js/lib/box";

// Custom bundle with only the trace types used by this dashboard's charts,
// instead of the full plotly.js (which includes maps, 3D, etc. and
// inflates the bundle from ~1.8MB to ~4.7MB gzip). See components/PlotlyChart.jsx.
Plotly.register([bar, scatter, histogram, pie, heatmap, box]);

export default Plotly;
