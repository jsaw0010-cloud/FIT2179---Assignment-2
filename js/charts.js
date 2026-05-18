// ── Chart 0: Choropleth Map (DIAGNOSTIC) ──────────────────────
vegaEmbed("#choropleth", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: 700,
  height: 400,
  projection: { type: "mercator" },
  data: {
    url: "https://raw.githubusercontent.com/dosm-malaysia/openspatial/main/state/malaysia_state.topojson",
    format: { type: "topojson", feature: "state" },
  },
  mark: {
    type: "geoshape",
    fill: "lightblue",
    stroke: "white",
    strokeWidth: 1,
  },
});
