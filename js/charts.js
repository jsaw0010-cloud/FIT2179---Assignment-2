vegaEmbed("#choropleth", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence by Malaysian State (2019)",
  width: 700,
  height: 400,
  projection: { type: "mercator" },
  layer: [
    {
      data: {
        url: "https://raw.githubusercontent.com/dosm-malaysia/openspatial/main/state/malaysia_state.topojson",
        format: { type: "topojson", feature: "malaysia_state" },
      },
      transform: [
        {
          lookup: "properties.name",
          from: {
            data: { url: BASE + "smoking_by_state_2019.csv" },
            key: "state",
            fields: ["smoking_rate_pct"],
          },
        },
      ],
      mark: {
        type: "geoshape",
        stroke: "white",
        strokeWidth: 1,
      },
      encoding: {
        color: {
          condition: {
            test: "datum.smoking_rate_pct !== null",
            field: "smoking_rate_pct",
            type: "quantitative",
            title: "Smoking Rate (%)",
            scale: { scheme: "reds" },
          },
          value: "#cccccc",
        },
        tooltip: [
          { field: "properties.name", title: "State" },
          { field: "smoking_rate_pct", title: "Smoking Rate (%)" },
        ],
      },
    },
  ],
});
