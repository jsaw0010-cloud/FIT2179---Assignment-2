const BASE =
  "https://raw.githubusercontent.com/jsaw0010-cloud/fit2179-assignment2/main/data/";

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
      field: "smoking_prevalence_pct",
      type: "quantitative",
      title: "Prevalence (%)",
      scale: { zero: false },
    },
    tooltip: [
      { field: "year", title: "Year" },
      { field: "smoking_prevalence_pct", title: "Prevalence (%)" },
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
  mark: "bar",
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
    ],
  },
});

// Add more charts here...
