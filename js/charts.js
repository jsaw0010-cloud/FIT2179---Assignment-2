const BASE =
  "https://raw.githubusercontent.com/jsaw0010-cloud/FIT2179---Assignment-2/main/data/";

// ── Chart 1: Choropleth Map with legend highlight ──────────────
vegaEmbed("#choropleth", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence by Malaysian State (2019)",
  width: 700,
  height: 420,
  params: [
    {
      name: "state_highlight",
      select: { type: "point", fields: ["above_national_avg"] },
      bind: "legend"
    }
  ],
  projection: { type: "mercator" },
  layer: [
    {
      data: {
        url: BASE + "malaysia_state.topojson",
        format: { type: "topojson", feature: "states" }
      },
      transform: [
        {
          lookup: "properties.Name",
          from: {
            data: { url: BASE + "smoking_by_state_2019.csv" },
            key: "state",
            fields: ["smoking_rate_pct", "above_national_avg"]
          }
        }
      ],
      mark: { type: "geoshape", stroke: "white", strokeWidth: 1 },
      encoding: {
        color: {
          field: "smoking_rate_pct",
          type: "quantitative",
          title: "Smoking Rate (%)",
          scale: { scheme: "reds", domain: [10, 30] },
          legend: { orient: "bottom-right" }
        },
        opacity: {
          condition: { param: "state_highlight", value: 1 },
          value: 0.2
        },
        tooltip: [
          { field: "properties.Name", title: "State" },
          { field: "smoking_rate_pct", title: "Smoking Rate (%)" },
          { field: "above_national_avg", title: "Above national avg?" }
        ]
      }
    }
  ]
});

// ── Chart 2: Smoking Trend Line Chart ──────────────────────────
vegaEmbed("#line_trend", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence in Malaysia (2011–2023)",
  width: 620,
  height: 300,
  layer: [
    {
      data: { url: BASE + "smoking_trend_national.csv" },
      mark: { type: "line", point: { size: 60 }, color: "#e63946", strokeWidth: 2.5 },
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: {
          field: "prevalence_overall",
          type: "quantitative",
          title: "Prevalence (%)",
          scale: { domain: [17, 25] },
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
      data: { values: [{ year: "2015", prevalence_overall: 22.8 }] },
      mark: {
        type: "text",
        align: "left",
        dx: 6,
        dy: -14,
        fontSize: 11,
        color: "#c1121f",
        fontWeight: "bold",
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "prevalence_overall", type: "quantitative" },
        text: { value: "↓ Major tax hike (2015–16)" },
      },
    },
    {
      data: { values: [{ year: "2023", prevalence_overall: 19.0 }] },
      mark: {
        type: "text",
        align: "right",
        dx: -6,
        dy: -14,
        fontSize: 11,
        color: "#457b9d",
        fontWeight: "bold",
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "prevalence_overall", type: "quantitative" },
        text: { value: "19.0% (2023)" },
      },
    },
    {
      data: { values: [{ year: "2027", target: 15 }] },
      mark: {
        type: "rule",
        strokeDash: [6, 4],
        color: "#2d6a4f",
        strokeWidth: 1.5,
      },
      encoding: {
        y: { field: "target", type: "quantitative" },
      },
    },
    {
      data: { values: [{ year: "2011", target: 15 }] },
      mark: {
        type: "text",
        align: "left",
        dx: 4,
        dy: -8,
        fontSize: 10,
        color: "#2d6a4f",
        fontWeight: "bold",
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "target", type: "quantitative" },
        text: { value: "2025 target: 15%" },
      },
    },
  ],
});

// ── Chart 3: Excise Duty Bar Chart ────────────────────────────
vegaEmbed("#excise_bar", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Cigarette Excise Duty Rate in Malaysia (2004–2025)",
  width: 620,
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
        opacity: {
          condition: {
            test: "datum.year == 2015 || datum.year == 2016",
            value: 1,
          },
          value: 0.6,
        },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "duty_per_stick_sen", title: "Duty (sen/stick)" },
          { field: "notes", title: "Notes" },
        ],
      },
    },
    {
      data: { values: [{ year: "2015", duty: 22 }] },
      mark: {
        type: "text",
        align: "center",
        dy: -12,
        fontSize: 11,
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
      data: { values: [{ year: "2016", duty: 43 }] },
      mark: {
        type: "text",
        align: "center",
        dy: -12,
        fontSize: 11,
        color: "#c1121f",
        fontWeight: "bold",
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "duty", type: "quantitative" },
        text: { value: "+100%" },
      },
    },
    {
      data: { values: [{ year: "2018", duty: 44 }] },
      mark: {
        type: "text",
        align: "left",
        dx: 4,
        dy: -10,
        fontSize: 10,
        color: "#666",
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "duty", type: "quantitative" },
        text: { value: "← 7-year freeze" },
      },
    },
  ],
});

// ── Chart 4: Sin Tax Revenue Stacked Bar ──────────────────────
vegaEmbed("#sin_tax_revenue", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Sin Tax Revenue: Tobacco vs Alcohol (2012–2017)",
  width: 500,
  height: 300,
  data: { url: BASE + "sin_tax_revenue.csv" },
  transform: [
    {
      fold: ["tobacco_revenue_myr_mil", "alcohol_revenue_myr_mil"],
      as: ["revenue_type", "revenue"],
    },
  ],
  mark: { type: "bar", width: 40 },
  encoding: {
    x: { field: "year", type: "ordinal", title: "Year" },
    y: {
      field: "revenue",
      type: "quantitative",
      title: "Revenue (MYR million)",
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
      { field: "revenue_type", title: "Type",
        labelExpr: "datum.label === 'tobacco_revenue_myr_mil' ? 'Tobacco' : 'Alcohol'" },
      { field: "revenue", title: "Revenue (MYR mil)", format: ",.0f" },
      { field: "sin_tax_pct_of_excise", title: "% of Total Excise Revenue" },
    ],
  },
});

// ── Chart 5: Illicit Trend — Overview+Detail brushing ─────────
vegaEmbed("#illicit_trend", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { url: BASE + "illicit_cigarettes_trend.csv" },
  vconcat: [
    {
      title: "Illicit Cigarette Market Share in Malaysia (2015–2024)",
      width: 620,
      height: 280,
      layer: [
        {
          mark: { type: "area", color: "#e63946", opacity: 0.08 },
          encoding: {
            x: {
              field: "year",
              type: "ordinal",
              scale: { domain: { param: "time_brush" } },
              axis: { title: "" }
            },
            y: {
              field: "illicit_share_pct",
              type: "quantitative",
              title: "Illicit Market Share (%)",
              scale: { domain: [30, 72] }
            }
          }
        },
        {
          mark: { type: "line", point: { size: 70 }, color: "#e63946", strokeWidth: 2.5 },
          encoding: {
            x: {
              field: "year",
              type: "ordinal",
              scale: { domain: { param: "time_brush" } },
              axis: { title: "" }
            },
            y: {
              field: "illicit_share_pct",
              type: "quantitative",
              scale: { domain: [30, 72] }
            },
            tooltip: [
              { field: "year", title: "Year" },
              { field: "illicit_share_pct", title: "Illicit Share (%)" },
              { field: "notes", title: "Notes" }
            ]
          }
        },
        {
          data: { values: [{ year: "2016" }] },
          mark: { type: "rule", strokeDash: [5, 4], color: "#c1121f", strokeWidth: 1.5 },
          encoding: { x: { field: "year", type: "ordinal" } }
        },
        {
          data: { values: [{ year: "2020" }] },
          mark: { type: "rule", strokeDash: [5, 4], color: "#888", strokeWidth: 1.5 },
          encoding: { x: { field: "year", type: "ordinal" } }
        },
        {
          data: { values: [{ year: "2023" }] },
          mark: { type: "rule", strokeDash: [5, 4], color: "#2d6a4f", strokeWidth: 1.5 },
          encoding: { x: { field: "year", type: "ordinal" } }
        },
        {
          data: {
            values: [
              { year: "2016", y: 70, label: "2015–16 Tax Hike" },
              { year: "2020", y: 70, label: "Peak: 63.8%" },
              { year: "2023", y: 70, lab

// ── Chart 6: ASEAN Cigarette Prices ───────────────────────────
vegaEmbed("#asean_prices", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Legal vs Illicit Cigarette Prices Across ASEAN (2023)",
  width: 550,
  height: 280,
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
      title: null,
      sort: { op: "max", field: "price", order: "descending" },
    },
    x: {
      field: "price",
      type: "quantitative",
      title: "Price (USD per pack)",
    },
    color: {
      field: "price_type",
      type: "nominal",
      scale: {
        domain: ["legal_price_usd", "illicit_price_usd"],
        range: ["#457b9d", "#e63946"],
      },
      legend: {
        title: "Price Type",
        labelExpr: "datum.label === 'legal_price_usd' ? 'Legal' : 'Illicit'",
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

// ── Chart 7: Demographics with dropdown filter ────────────────
vegaEmbed("#demographics", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence by Demographic Group",
  width: 400,
  height: 200,
  params: [
    {
      name: "category_selection",
      bind: {
        input: "select",
        options: [null, "gender", "age_group", "ethnicity", "education", "residence"],
        labels: ["Show All", "Gender", "Age Group", "Ethnicity", "Education", "Residence"],
        name: "Filter by category: "
      }
    }
  ],
  data: { url: BASE + "smoking_demographics.csv" },
  transform: [
    {
      filter: "category_selection == null || datum.category == category_selection"
    }
  ],
  layer: [
    {
      mark: { type: "bar", cornerRadiusEnd: 4 },
      encoding: {
        y: {
          field: "group",
          type: "nominal",
          title: null,
          sort: { field: "prevalence_pct", op: "max", order: "descending" },
          axis: { labelFontSize: 12 }
        },
        x: {
          field: "prevalence_pct",
          type: "quantitative",
          title: "Smoking Prevalence (%)",
          scale: { domain: [0, 45] }
        },
        color: {
          field: "category",
          type: "nominal",
          scale: {
            domain: ["gender", "age_group", "ethnicity", "education", "residence"],
            range: ["#e63946", "#457b9d", "#2a9d8f", "#e9c46a", "#f4a261"]
          },
          legend: { title: "Category" }
        },
        tooltip: [
          { field: "category", title: "Category" },
          { field: "group", title: "Group" },
          { field: "prevalence_pct", title: "Prevalence (%)" },
          { field: "source", title: "Source" }
        ]
      }
    },
    {
      mark: {
        type: "text",
        align: "left",
        dx: 5,
        fontSize: 11,
        fontWeight: "bold",
        color: "#4a3f30"
      },
      encoding: {
        y: {
          field: "group",
          type: "nominal",
          sort: { field: "prevalence_pct", op: "max", order: "descending" }
        },
        x: { field: "prevalence_pct", type: "quantitative" },
        text: { field: "prevalence_pct", format: ".1f" }
      }
    }
  ]
});

// ── Chart 8: Male vs Female Smoking Trend ─────────────────────
vegaEmbed("#gender_trend", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Male vs Female Smoking Prevalence in Malaysia (2011–2023)",
  width: 620,
  height: 300,
  data: { url: BASE + "smoking_trend_national.csv" },
  transform: [
    {
      fold: ["prevalence_male", "prevalence_female"],
      as: ["gender", "prevalence"],
    },
  ],
  layer: [
    {
      mark: { type: "line", point: { size: 70 } },
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: {
          field: "prevalence",
          type: "quantitative",
          title: "Prevalence (%)",
          scale: { zero: true, domain: [0, 48] },
        },
        color: {
          field: "gender",
          type: "nominal",
          scale: {
            domain: ["prevalence_male", "prevalence_female"],
            range: ["#457b9d", "#e63946"],
          },
          legend: {
            title: "Gender",
            labelExpr:
              "datum.label === 'prevalence_male' ? 'Male' : 'Female'",
          },
        },
        strokeWidth: {
          field: "gender",
          type: "nominal",
          scale: {
            domain: ["prevalence_male", "prevalence_female"],
            range: [3, 2],
          },
          legend: null,
        },
        strokeDash: {
          field: "gender",
          type: "nominal",
          scale: {
            domain: ["prevalence_male", "prevalence_female"],
            range: [[1, 0], [6, 3]],
          },
          legend: null,
        },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "gender", title: "Gender" },
          { field: "prevalence", title: "Prevalence (%)" },
          { field: "source", title: "Source" },
        ],
      },
    },
    {
      data: {
        values: [
          { year: "2023", prevalence: 35.7, label: "Male: 35.7%" },
          { year: "2023", prevalence: 1.5,  label: "Female: 1.5%" },
        ],
      },
      mark: {
        type: "text",
        align: "right",
        dx: -6,
        fontSize: 11,
        fontWeight: "bold",
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "prevalence", type: "quantitative" },
        text: { field: "label" },
        color: {
          field: "label",
          type: "nominal",
          scale: {
            domain: ["Male: 35.7%", "Female: 1.5%"],
            range: ["#457b9d", "#e63946"],
          },
          legend: null,
        },
      },
    },
  ],
});

// ── Chart 9: Smoking by Ethnicity ─────────────────────────────
vegaEmbed("#ethnicity_bar", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence by Ethnicity in Malaysia (2019)",
  width: 500,
  height: 200,
  data: {
    values: [
      { ethnicity: "Malay",           prevalence: 22.6 },
      { ethnicity: "Other Bumiputra", prevalence: 21.7 },
      { ethnicity: "Chinese",         prevalence: 13.7 },
      { ethnicity: "Indian",          prevalence: 11.5 },
    ],
  },
  layer: [
    {
      mark: { type: "bar", cornerRadiusEnd: 4 },
      encoding: {
        y: {
          field: "ethnicity",
          type: "nominal",
          title: null,
          sort: { field: "prevalence", order: "descending" },
          axis: { labelFontSize: 13 },
        },
        x: {
          field: "prevalence",
          type: "quantitative",
          title: "Smoking Prevalence (%)",
          scale: { domain: [0, 30] },
        },
        color: {
          field: "prevalence",
          type: "quantitative",
          scale: { scheme: "reds", domain: [10, 25] },
          legend: null,
        },
        tooltip: [
          { field: "ethnicity", title: "Ethnicity" },
          { field: "prevalence", title: "Prevalence (%)" },
        ],
      },
    },
    {
      mark: {
        type: "text",
        align: "left",
        dx: 6,
        fontSize: 12,
        fontWeight: "bold",
        color: "#4a3f30",
      },
      encoding: {
        y: {
          field: "ethnicity",
          type: "nominal",
          sort: { field: "prevalence", order: "descending" },
        },
        x: { field: "prevalence", type: "quantitative" },
        text: { field: "prevalence", format: ".1f" },
      },
    },
  ],
});

// ── Chart 10: Tax Rate vs Illicit Market Share ────────────────
vegaEmbed("#tax_vs_illicit", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Excise Duty vs Illicit Market Share (2015–2024)",
  width: 620,
  height: 320,
  resolve: { scale: { y: "independent" } },
  layer: [
    {
      data: { url: BASE + "illicit_cigarettes_trend.csv" },
      mark: { type: "area", opacity: 0.12, color: "#e63946" },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: {
          field: "illicit_share_pct",
          type: "quantitative",
          title: "Illicit Market Share (%)",
          axis: { titleColor: "#c1121f", labelColor: "#c1121f" },
          scale: { domain: [30, 72] },
        },
      },
    },
    {
      data: { url: BASE + "illicit_cigarettes_trend.csv" },
      mark: { type: "line", point: { size: 60 }, color: "#e63946", strokeWidth: 2.5 },
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: {
          field: "illicit_share_pct",
          type: "quantitative",
          scale: { domain: [30, 72] },
        },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "illicit_share_pct", title: "Illicit Share (%)" },
        ],
      },
    },
    {
      data: { url: BASE + "excise_duty_rates.csv" },
      transform: [{ filter: "datum.year >= 2015" }],
      mark: {
        type: "line",
        point: { size: 60 },
        color: "#457b9d",
        strokeWidth: 2.5,
        strokeDash: [6, 3],
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: {
          field: "duty_per_stick_sen",
          type: "quantitative",
          title: "Duty per Stick (sen)",
          axis: { titleColor: "#457b9d", labelColor: "#457b9d" },
          scale: { domain: [15, 50] },
        },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "duty_per_stick_sen", title: "Duty (sen/stick)" },
          { field: "notes", title: "Notes" },
        ],
      },
    },
    {
      data: {
        values: [
          { year: "2015", y: 68, label: "Tax: 20 sen →" },
          { year: "2016", y: 63, label: "Tax: 40 sen →" },
        ],
      },
      mark: {
        type: "text",
        align: "left",
        dx: 5,
        fontSize: 10,
        fontWeight: "bold",
        color: "#457b9d",
      },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "y", type: "quantitative", scale: { domain: [30, 72] } },
        text: { field: "label" },
      },
    },
  ],
});
