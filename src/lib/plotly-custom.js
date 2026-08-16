import Plotly from "plotly.js/lib/core";
import bar from "plotly.js/lib/bar";
import scatter from "plotly.js/lib/scatter";
import histogram from "plotly.js/lib/histogram";
import pie from "plotly.js/lib/pie";
import heatmap from "plotly.js/lib/heatmap";
import box from "plotly.js/lib/box";

// Bundle customizado com apenas os trace types usados pelos graficos deste
// dashboard, em vez do plotly.js completo (que inclui mapas, 3D, etc. e
// infla o bundle de ~1.8MB para ~4.7MB gzip). Ver components/PlotlyChart.jsx.
Plotly.register([bar, scatter, histogram, pie, heatmap, box]);

export default Plotly;
