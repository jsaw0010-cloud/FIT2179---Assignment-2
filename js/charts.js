const BASE =
  "https://raw.githubusercontent.com/jsaw0010-cloud/FIT2179---Assignment-2/main/data/";

// ── Chart 0: Choropleth Map ────────────────────────────────────
vegaEmbed("#choropleth", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence by Malaysian State (2019)",
  width: 700,
  height: 400,
  projection: { type: "mercator" },
  layer: [
    {
      data: {
        url: BASE + "malaysia_state.topojson",
        format: { type: "topojson", feature: "states" },
      },
      transform: [
        {
          lookup: "properties.Name",
          from: {
            data: { url: BASE + "smoking_by_state_2019.csv" },
            key: "state",
            fields: ["smoking_rate_pct"],
          },
        },
      ],
      mark: { type: "geoshape", stroke: "white", strokeWidth: 1 },
      encoding: {
        color: {
          field: "smoking_rate_pct",
          type: "quantitative",
          title: "Smoking Rate (%)",
          scale: { scheme: "reds" },
        },
        tooltip: [
          { field: "properties.Name", title: "State" },
          { field: "smoking_rate_pct", title: "Smoking Rate (%)" },
        ],
      },
    },
  ],
});

// ── Chart 1: Smoking Trend Line Chart ──────────────────────────
vegaEmbed("#line_trend", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence in Malaysia (2011–2023)",
  width: 600,
  height: 300,
  data: { url: BASE + "smoking_trend_national.csv" },
  mark: { type: "line", point: true },
  encoding: {
    x: { field: "year", type: "ordinal", title: "Year" },
    y: {
      field: "prevalence_overall",
      type: "quantitative",
      title: "Prevalence (%)",
      scale: { zero: false },
    },
    color: { value: "#e63946" },
    tooltip: [
      { field: "year", title: "Year" },
      { field: "prevalence_overall", title: "Overall (%)" },
      { field: "prevalence_male", title: "Male (%)" },
      { field: "prevalence_female", title: "Female (%)" },
      { field: "source", title: "Source" },
    ],
  },
});

// ── Chart 2: Excise Duty Bar Chart ────────────────────────────
vegaEmbed("#excise_bar", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Cigarette Excise Duty Rate in Malaysia",
  width: 600,
  height: 300,
  data: { url: BASE + "excise_duty_rates.csv" },
  mark: { type: "bar", color: "#457b9d" },
  encoding: {
    x: { field: "year", type: "ordinal", title: "Year" },
    y: {
      field: "duty_per_stick_sen",
      type: "quantitative",
      title: "Duty per Stick (sen)",
    },
    tooltip: [
      { field: "year", title: "Year" },
      { field: "duty_per_stick_sen", title: "Duty (sen/stick)" },
      { field: "notes", title: "Notes" },
    ],
  },
});
