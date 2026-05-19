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

// ── Chart 1: Smoking Trend (with annotation) ──────────────────
vegaEmbed("#line_trend", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence in Malaysia (2011–2023)",
  width: 600,
  height: 300,
  layer: [
    {
      data: { url: BASE + "smoking_trend_national.csv" },
      mark: { type: "line", point: true, color: "#e63946" },
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: {
          field: "prevalence_overall",
          type: "quantitative",
          title: "Prevalence (%)",
          scale: { zero: false },
        },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "prevalence_overall", title: "Overall (%)" },
          { field: "prevalence_male", title: "Male (%)" },
          { field: "prevalence_female", title: "Female (%)" },
          { field: "source", title: "Source" },
        ],
      },
    },
    {
      data: { values: [{ year: "2015", prevalence_overall: 23.5 }] },
      mark: {
        type: "text",
        align: "left",
        dx: 6,
        dy: -10,
        fontSize: 10,
        color: "#c1121f",
        fontWeight: "bold",
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "prevalence_overall", type: "quantitative" },
        text: { value: "↓ Major tax hike" },
      },
    },
  ],
});

// ── Chart 2: Excise Duty Bar (with annotation) ────────────────
vegaEmbed("#excise_bar", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Cigarette Excise Duty Rate in Malaysia",
  width: 600,
  height: 300,
  layer: [
    {
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
    },
    {
      data: { values: [{ year: "2015", duty: 41 }] },
      mark: {
        type: "text",
        align: "center",
        dy: -10,
        fontSize: 10,
        color: "#c1121f",
        fontWeight: "bold",
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "duty", type: "quantitative" },
        text: { value: "+67%" },
      },
    },
    {
      data: { values: [{ year: "2015", duty: 36 }] },
      mark: {
        type: "text",
        align: "center",
        dy: -10,
        fontSize: 9,
        color: "#555",
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "duty", type: "quantitative" },
        text: { value: "↑ Biggest hike" },
      },
    },
  ],
});

// ── Chart 3: Sin Tax Revenue Stacked Bar ──────────────────────
vegaEmbed("#sin_tax_revenue", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Sin Tax Revenue: Tobacco vs Alcohol (2012–2017)",
  width: 600,
  height: 300,
  data: { url: BASE + "sin_tax_revenue.csv" },
  transform: [
    {
      fold: ["tobacco_revenue_myr_mil", "alcohol_revenue_myr_mil"],
      as: ["revenue_type", "revenue"],
    },
  ],
  mark: "bar",
  encoding: {
    x: { field: "year", type: "ordinal", title: "Year" },
    y: {
      field: "revenue",
      type: "quantitative",
      title: "Revenue (MYR mil)",
      stack: "zero",
    },
    color: {
      field: "revenue_type",
      type: "nominal",
      scale: {
        domain: ["tobacco_revenue_myr_mil", "alcohol_revenue_myr_mil"],
        range: ["#e63946", "#457b9d"],
      },
      legend: {
        title: "Revenue Type",
        labelExpr:
          "datum.label === 'tobacco_revenue_myr_mil' ? 'Tobacco' : 'Alcohol'",
      },
    },
    tooltip: [
      { field: "year", title: "Year" },
      { field: "revenue_type", title: "Type" },
      { field: "revenue", title: "Revenue (MYR mil)", format: ",.0f" },
      { field: "sin_tax_pct_of_excise", title: "% of Excise Revenue" },
    ],
  },
});

// ── Chart 4: Illicit Cigarettes (with annotations) ────────────
vegaEmbed("#illicit_trend", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Illicit Cigarette Market Share in Malaysia (2015–2024)",
  width: 600,
  height: 320,
  layer: [
    // Main line
    {
      data: { url: BASE + "illicit_cigarettes_trend.csv" },
      mark: { type: "line", point: true, color: "#e63946" },
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: {
          field: "illicit_share_pct",
          type: "quantitative",
          title: "Illicit Market Share (%)",
          scale: { domain: [30, 72] },
        },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "illicit_share_pct", title: "Illicit Share (%)" },
          { field: "notes", title: "Notes" },
        ],
      },
    },
    // Vertical rule: tax hike
    {
      data: { values: [{ year: "2016" }] },
      mark: {
        type: "rule",
        strokeDash: [5, 4],
        color: "#c1121f",
        strokeWidth: 1.5,
      },
      encoding: { x: { field: "year", type: "ordinal" } },
    },
    // Vertical rule: peak
    {
      data: { values: [{ year: "2020" }] },
      mark: {
        type: "rule",
        strokeDash: [5, 4],
        color: "#888",
        strokeWidth: 1.5,
      },
      encoding: { x: { field: "year", type: "ordinal" } },
    },
    // Vertical rule: moratorium
    {
      data: { values: [{ year: "2023" }] },
      mark: {
        type: "rule",
        strokeDash: [5, 4],
        color: "#2d6a4f",
        strokeWidth: 1.5,
      },
      encoding: { x: { field: "year", type: "ordinal" } },
    },
    // Annotation labels
    {
      data: {
        values: [
          { year: "2016", y: 70, label: "2015–16 Tax Hike" },
          { year: "2020", y: 70, label: "Peak: 63.8%" },
          { year: "2023", y: 70, label: "Moratorium" },
        ],
      },
      mark: {
        type: "text",
        align: "left",
        dx: 4,
        fontSize: 10,
        fontWeight: "bold",
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "y", type: "quantitative" },
        text: { field: "label" },
        color: {
          field: "label",
          type: "nominal",
          scale: {
            domain: ["2015–16 Tax Hike", "Peak: 63.8%", "Moratorium"],
            range: ["#c1121f", "#555", "#2d6a4f"],
          },
          legend: null,
        },
      },
    },
  ],
});

// ── Chart 5: ASEAN Cigarette Prices ───────────────────────────
vegaEmbed("#asean_prices", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Legal vs Illicit Cigarette Prices Across ASEAN",
  width: 550,
  height: 300,
  data: { url: BASE + "asean_cigarette_prices.csv" },
  transform: [
    {
      fold: ["legal_price_usd", "illicit_price_usd"],
      as: ["price_type", "price"],
    },
    { filter: "datum.price !== null && datum.price !== ''" },
  ],
  mark: { type: "bar" },
  encoding: {
    y: {
      field: "country",
      type: "nominal",
      title: "Country",
      sort: { op: "max", field: "price", order: "descending" },
    },
    x: { field: "price", type: "quantitative", title: "Price (USD)" },
    color: {
      field: "price_type",
      type: "nominal",
      scale: {
        domain: ["legal_price_usd", "illicit_price_usd"],
        range: ["#457b9d", "#e63946"],
      },
      legend: {
        title: "Price Type",
        labelExpr:
          "datum.label === 'legal_price_usd' ? 'Legal' : 'Illicit'",
      },
    },
    tooltip: [
      { field: "country", title: "Country" },
      { field: "price_type", title: "Type" },
      { field: "price", title: "Price (USD)", format: ".2f" },
      { field: "tax_share_pct", title: "Tax Share (%)" },
      { field: "smoking_prevalence_pct", title: "Smoking Prevalence (%)" },
    ],
  },
});

// ── Chart 6: Smoking Demographics ─────────────────────────────
vegaEmbed("#demographics", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence by Demographic Group",
  data: { url: BASE + "smoking_demographics.csv" },
  facet: {
    field: "category",
    type: "nominal",
    columns: 2,
    header: { title: null },
  },
  spec: {
    width: 300,
    height: 150,
    mark: { type: "bar", color: "#e63946" },
    encoding: {
      x: {
        field: "prevalence_pct",
        type: "quantitative",
        title: "Prevalence (%)",
      },
      y: {
        field: "group",
        type: "nominal",
        title: null,
        sort: { field: "prevalence_pct", op: "max", order: "descending" },
      },
      tooltip: [
        { field: "category", title: "Category" },
        { field: "group", title: "Group" },
        { field: "prevalence_pct", title: "Prevalence (%)" },
        { field: "source", title: "Source" },
      ],
    },
  },
});

// ── Chart 8: Male vs Female Smoking Trend ─────────────────────
vegaEmbed("#gender_trend", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Male vs Female Smoking Prevalence in Malaysia (2011–2023)",
  width: 600,
  height: 300,
  data: { url: BASE + "smoking_trend_national.csv" },
  transform: [
    {
      fold: ["prevalence_male", "prevalence_female"],
      as: ["gender", "prevalence"]
    }
  ],
  mark: { type: "line", point: true },
  encoding: {
    x: {
      field: "year",
      type: "ordinal",
      title: "Year"
    },
    y: {
      field: "prevalence",
      type: "quantitative",
      title: "Prevalence (%)",
      scale: { zero: false }
    },
    color: {
      field: "gender",
      type: "nominal",
      scale: {
        domain: ["prevalence_male", "prevalence_female"],
        range: ["#457b9d", "#e63946"]
      },
      legend: {
        title: "Gender",
        labelExpr: "datum.label === 'prevalence_male' ? 'Male' : 'Female'"
      }
    },
    strokeWidth: {
      field: "gender",
      type: "nominal",
      scale: {
        domain: ["prevalence_male", "prevalence_female"],
        range: [3, 1.5]
      },
      legend: null
    },
    tooltip: [
      { field: "year", title: "Year" },
      { field: "gender", title: "Gender" },
      { field: "prevalence", title: "Prevalence (%)" },
      { field: "source", title: "Source" }
    ]
  }
});

// ── Chart 9: Smoking by Ethnicity ─────────────────────────────
vegaEmbed("#ethnicity_bar", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence by Ethnicity in Malaysia (2019)",
  width: 500,
  height: 220,
  data: {
    values: [
      { ethnicity: "Malay",            prevalence: 22.6 },
      { ethnicity: "Other Bumiputra",  prevalence: 21.7 },
      { ethnicity: "Indian",           prevalence: 11.5 },
      { ethnicity: "Chinese",          prevalence: 13.7 }
    ]
  },
  mark: {
    type: "bar",
    cornerRadiusEnd: 4
  },
  encoding: {
    y: {
      field: "ethnicity",
      type: "nominal",
      title: null,
      sort: { field: "prevalence", order: "descending" }
    },
    x: {
      field: "prevalence",
      type: "quantitative",
      title: "Smoking Prevalence (%)",
      scale: { domain: [0, 30] }
    },
    color: {
      field: "prevalence",
      type: "quantitative",
      scale: { scheme: "reds", domain: [10, 25] },
      legend: null
    },
    tooltip: [
      { field: "ethnicity", title: "Ethnicity" },
      { field: "prevalence", title: "Prevalence (%)" }
    ]
  },
  layer: [
    {
      mark: { type: "bar", cornerRadiusEnd: 4 },
      encoding: {
        y: {
          field: "ethnicity",
          type: "nominal",
          sort: { field: "prevalence", order: "descending" }
        },
        x: {
          field: "prevalence",
          type: "quantitative",
          scale: { domain: [0, 30] }
        },
        color: {
          field: "prevalence",
          type: "quantitative",
          scale: { scheme: "reds", domain: [10, 25] },
          legend: null
        },
        tooltip: [
          { field: "ethnicity", title: "Ethnicity" },
          { field: "prevalence", title: "Prevalence (%)" }
        ]
      }
    },
    {
      mark: {
        type: "text",
        align: "left",
        dx: 5,
        fontSize: 12,
        color: "#4a3f30"
      },
      encoding: {
        y: {
          field: "ethnicity",
          type: "nominal",
          sort: { field: "prevalence", order: "descending" }
        },
        x: { field: "prevalence", type: "quantitative" },
        text: { field: "prevalence", format: ".1f" }
      }
    }
  ]
});

// ── Chart 10: Tax Rate vs Illicit Market Share ────────────────
vegaEmbed("#tax_vs_illicit", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Excise Duty vs Illicit Market Share (2015–2024)",
  width: 600,
  height: 320,
  resolve: { scale: { y: "independent" } },
  layer: [
    {
      data: { url: BASE + "illicit_cigarettes_trend.csv" },
      mark: { type: "area", opacity: 0.15, color: "#e63946" },
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: {
          field: "illicit_share_pct",
          type: "quantitative",
          title: "Illicit Market Share (%)",
          axis: { titleColor: "#e63946" },
          scale: { domain: [30, 72] }
        }
      }
    },
    {
      data: { url: BASE + "illicit_cigarettes_trend.csv" },
      mark: { type: "line", point: true, color: "#e63946", strokeWidth: 2 },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: {
          field: "illicit_share_pct",
          type: "quantitative",
          scale: { domain: [30, 72] }
        },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "illicit_share_pct", title: "Illicit Share (%)" }
        ]
      }
    },
    {
      data: { url: BASE + "excise_duty_rates.csv" },
      transform: [
        { filter: "datum.year >= 2015" }
      ],
      mark: {
        type: "line",
        point: true,
        color: "#457b9d",
        strokeWidth: 2,
        strokeDash: [5, 3]
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: {
          field: "duty_per_stick_sen",
          type: "quantitative",
          title: "Duty per Stick (sen)",
          axis: { titleColor: "#457b9d" },
          scale: { domain: [15, 50] }
        },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "duty_per_stick_sen", title: "Duty (sen/stick)" },
          { field: "notes", title: "Notes" }
        ]
      }
    },
    {
      data: {
        values: [
          { year: "2015", y: 68, label: "Tax jumps to 20 sen" },
          { year: "2016", y: 64, label: "Tax jumps to 40 sen" }
        ]
      },
      mark: {
        type: "text",
        align: "left",
        dx: 5,
        fontSize: 10,
        fontWeight: "bold",
        color: "#457b9d"
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "y", type: "quantitative", scale: { domain: [30, 72] } },
        text: { field: "label" }
      }
    }
  ]
});
