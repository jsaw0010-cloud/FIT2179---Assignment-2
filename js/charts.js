const BASE =
  "https://raw.githubusercontent.com/jsaw0010-cloud/FIT2179---Assignment-2/main/data/";

// COLOUR SYSTEM
// Chart 1  — Reds scheme (choropleth, sequential quantitative)
// Chart 2  — Steel blue #1a6b8a (trend line, informational)
// Chart 3  — Orange #e07b00 (tax/fiscal policy bars — colourblind-safe with blue & red)
// Chart 4  — Purple #7b2d8b (tobacco) + Amber #d4a017 (alcohol)
// Chart 5  — Crimson #c0392b (illicit/danger signal)
// Chart 6  — Steel blue (legal) + Crimson (illicit) — intentional semantic reuse
// Chart 7  — 5-category palette (each category gets a distinct colour)
// Chart 8  — Steel blue (male) + Terracotta #e07b54 (female)
// Chart 9  — Blues sequential scheme (neutral categorical)
// Chart 10 — Crimson (illicit) + Orange #e07b00 (tax/fiscal) — colourblind-safe pair

// ── Chart 1: Zoomable Choropleth Map ──────────────────────────
vegaEmbed("#choropleth", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence by Malaysian State (2019)",
  width: 700,
  height: 420,
  params: [
    {
      name: "zoom_level",
      value: 1800,
      bind: { input: "range", min: 800, max: 5000, step: 100, name: "Zoom: " }
    },
    {
      name: "center_to",
      value: [109.5, 3.5],
      bind: {
        input: "select",
        options: [[109.5, 3.5],[101.5, 3.1],[116.0, 5.5],[103.8, 1.5]],
        labels: ["All Malaysia","Peninsular Malaysia","Sabah / Sarawak","Southern Peninsular"],
        name: "Map Centre: "
      }
    }
  ],
  projection: {
    type: "mercator",
    center: { expr: "center_to" },
    scale: { expr: "zoom_level" }
  },
  layer: [
    {
      data: { url: BASE + "malaysia_state.topojson", format: { type: "topojson", feature: "states" } },
      transform: [{ calculate: "'No data for ' + datum.properties.Name", as: "note" }],
      mark: { type: "geoshape", fill: "#ddd", stroke: "white", strokeWidth: 1 },
      encoding: { tooltip: { field: "note" } }
    },
    {
      data: { url: BASE + "malaysia_state.topojson", format: { type: "topojson", feature: "states" } },
      transform: [{
        lookup: "properties.Name",
        from: { data: { url: BASE + "smoking_by_state_2019.csv" }, key: "state", fields: ["smoking_rate_pct","above_national_avg","region"] }
      }],
      mark: { type: "geoshape", stroke: "white", strokeWidth: 1 },
      encoding: {
        color: {
          field: "smoking_rate_pct", type: "quantitative", title: "Smoking Rate (%)",
          scale: { scheme: "reds", domain: [10, 30] }, legend: { orient: "bottom-right" }
        },
        tooltip: [
          { field: "properties.Name", title: "State" },
          { field: "smoking_rate_pct", title: "Smoking Rate (%)" },
          { field: "region", title: "Region" },
          { field: "above_national_avg", title: "Above national avg?" }
        ]
      }
    }
  ]
});

// ── Chart 2: Smoking Trend — STEEL BLUE ───────────────────────
vegaEmbed("#line_trend", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence in Malaysia (2011–2023)",
  width: 620,
  height: 300,
  layer: [
    {
      data: { url: BASE + "smoking_trend_national.csv" },
      mark: { type: "line", point: { size: 60, fill: "#1a6b8a" }, color: "#1a6b8a", strokeWidth: 2.5 },
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: { field: "prevalence_overall", type: "quantitative", title: "Prevalence (%)", scale: { domain: [17, 25] } },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "prevalence_overall", title: "Overall (%)" },
          { field: "prevalence_male", title: "Male (%)" },
          { field: "prevalence_female", title: "Female (%)" },
          { field: "source", title: "Source" }
        ]
      }
    },
    {
      data: { values: [{ year: "2015", prevalence_overall: 22.8 }] },
      mark: { type: "text", align: "left", dx: 6, dy: -14, fontSize: 11, color: "#1a4f6a", fontWeight: "bold" },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "prevalence_overall", type: "quantitative" },
        text: { value: "↓ Major tax hike (2015–16)" }
      }
    },
    {
      data: { values: [{ year: "2023", prevalence_overall: 19.0 }] },
      mark: { type: "text", align: "right", dx: -6, dy: -14, fontSize: 11, color: "#1a6b8a", fontWeight: "bold" },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "prevalence_overall", type: "quantitative" },
        text: { value: "19.0% (2023)" }
      }
    },
    {
      data: { values: [{ year: "2027", target: 15 }] },
      mark: { type: "rule", strokeDash: [6, 4], color: "#e07b00", strokeWidth: 1.5 },
      encoding: { y: { field: "target", type: "quantitative" } }
    },
    {
      data: { values: [{ year: "2011", target: 15 }] },
      mark: { type: "text", align: "left", dx: 4, dy: -8, fontSize: 10, color: "#e07b00", fontWeight: "bold" },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "target", type: "quantitative" },
        text: { value: "2025 target: 15%" }
      }
    }
  ]
});

// ── Chart 3: Excise Duty Bars — FOREST GREEN ──────────────────
vegaEmbed("#excise_bar", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Cigarette Excise Duty Rate in Malaysia (2004–2025)",
  width: 620,
  height: 300,
  layer: [
    {
      data: { url: BASE + "excise_duty_rates.csv" },
      mark: { type: "bar", color: "#e07b00" },
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: { field: "duty_per_stick_sen", type: "quantitative", title: "Duty per Stick (sen)" },
        opacity: { condition: { test: "datum.year == 2015 || datum.year == 2016", value: 1 }, value: 0.55 },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "duty_per_stick_sen", title: "Duty (sen/stick)" },
          { field: "notes", title: "Notes" }
        ]
      }
    },
    {
      data: { values: [{ year: "2015", duty: 22 }] },
      mark: { type: "text", align: "center", dy: -12, fontSize: 11, color: "#b35900", fontWeight: "bold" },
      encoding: { x: { field: "year", type: "ordinal" }, y: { field: "duty", type: "quantitative" }, text: { value: "+67%" } }
    },
    {
      data: { values: [{ year: "2016", duty: 43 }] },
      mark: { type: "text", align: "center", dy: -12, fontSize: 11, color: "#b35900", fontWeight: "bold" },
      encoding: { x: { field: "year", type: "ordinal" }, y: { field: "duty", type: "quantitative" }, text: { value: "+100%" } }
    },
    {
      data: { values: [{ year: "2018", duty: 44 }] },
      mark: { type: "text", align: "left", dx: 4, dy: -10, fontSize: 10, color: "#666" },
      encoding: { x: { field: "year", type: "ordinal" }, y: { field: "duty", type: "quantitative" }, text: { value: "← 7-year freeze" } }
    }
  ]
});

// ── Chart 4: Revenue Stacked Bar — PURPLE + AMBER ─────────────
vegaEmbed("#sin_tax_revenue", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Sin Tax Revenue: Tobacco vs Alcohol (2012–2017)",
  width: 500,
  height: 300,
  data: { url: BASE + "sin_tax_revenue.csv" },
  transform: [{ fold: ["tobacco_revenue_myr_mil", "alcohol_revenue_myr_mil"], as: ["revenue_type", "revenue"] }],
  mark: { type: "bar", width: 40 },
  encoding: {
    x: { field: "year", type: "ordinal", title: "Year" },
    y: { field: "revenue", type: "quantitative", title: "Revenue (MYR million)", stack: "zero" },
    color: {
      field: "revenue_type", type: "nominal",
      scale: { domain: ["tobacco_revenue_myr_mil", "alcohol_revenue_myr_mil"], range: ["#7b2d8b", "#d4a017"] },
      legend: { title: "Revenue Type", labelExpr: "datum.label === 'tobacco_revenue_myr_mil' ? 'Tobacco' : 'Alcohol'" }
    },
    tooltip: [
      { field: "year", title: "Year" },
      { field: "revenue_type", title: "Type" },
      { field: "revenue", title: "Revenue (MYR mil)", format: ",.0f" },
      { field: "sin_tax_pct_of_excise", title: "% of Total Excise Revenue" }
    ]
  }
});

// ── Chart 5: Illicit Trend — CRIMSON (brushable) ──────────────
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
          mark: { type: "area", color: "#c0392b", opacity: 0.08 },
          encoding: {
            x: { field: "year", type: "ordinal", scale: { domain: { param: "time_brush" } }, axis: { title: "" } },
            y: { field: "illicit_share_pct", type: "quantitative", scale: { domain: [30, 72] } },
            y2: { datum: 30 }
          }
        },
        {
          mark: { type: "line", point: { size: 70, fill: "#c0392b" }, color: "#c0392b", strokeWidth: 2.5 },
          encoding: {
            x: { field: "year", type: "ordinal", scale: { domain: { param: "time_brush" } }, axis: { title: "" } },
            y: { field: "illicit_share_pct", type: "quantitative", title: "Illicit Market Share (%)", scale: { domain: [30, 72] } },
            tooltip: [
              { field: "year", title: "Year" },
              { field: "illicit_share_pct", title: "Illicit Share (%)" },
              { field: "notes", title: "Notes" }
            ]
          }
        },
        {
          data: { values: [{ year: "2016" }] },
          mark: { type: "rule", strokeDash: [5, 4], color: "#922b21", strokeWidth: 1.5 },
          encoding: { x: { field: "year", type: "ordinal" } }
        },
        {
          data: { values: [{ year: "2020" }] },
          mark: { type: "rule", strokeDash: [5, 4], color: "#888", strokeWidth: 1.5 },
          encoding: { x: { field: "year", type: "ordinal" } }
        },
        {
          data: { values: [{ year: "2023" }] },
          mark: { type: "rule", strokeDash: [5, 4], color: "#e07b00", strokeWidth: 1.5 },
          encoding: { x: { field: "year", type: "ordinal" } }
        },
        {
          data: { values: [
            { year: "2016", y: 70, label: "2015–16 Tax Hike" },
            { year: "2020", y: 70, label: "Peak: 63.8%" },
            { year: "2023", y: 70, label: "Moratorium" }
          ]},
          mark: { type: "text", align: "left", dx: 4, fontSize: 10, fontWeight: "bold" },
          encoding: {
            x: { field: "year", type: "ordinal" },
            y: { field: "y", type: "quantitative" },
            text: { field: "label" },
            color: {
              field: "label", type: "nominal",
              scale: { domain: ["2015–16 Tax Hike","Peak: 63.8%","Moratorium"], range: ["#922b21","#555","#e07b00"] },
              legend: null
            }
          }
        }
      ]
    },
    {
      width: 620,
      height: 50,
      title: "Drag to select a time range ↓",
      params: [{ name: "time_brush", select: { type: "interval", encodings: ["x"] } }],
      mark: { type: "line", color: "#c0392b" },
      encoding: {
        x: { field: "year", type: "ordinal", axis: { title: "Year" } },
        y: { field: "illicit_share_pct", type: "quantitative", axis: { tickCount: 3, grid: false, title: "" } }
      }
    }
  ]
});

// ── Chart 6: ASEAN Prices — BLUE (legal) + CRIMSON (illicit) ──
vegaEmbed("#asean_prices", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Legal vs Illicit Cigarette Prices Across ASEAN (2023)",
  width: 550,
  height: 280,
  data: { url: BASE + "asean_cigarette_prices.csv" },
  transform: [
    { fold: ["legal_price_usd", "illicit_price_usd"], as: ["price_type", "price"] },
    { filter: "datum.price !== null && datum.price !== ''" }
  ],
  mark: { type: "bar" },
  encoding: {
    y: { field: "country", type: "nominal", title: null, sort: { op: "max", field: "price", order: "descending" } },
    x: { field: "price", type: "quantitative", title: "Price (USD per pack)" },
    color: {
      field: "price_type", type: "nominal",
      scale: { domain: ["legal_price_usd", "illicit_price_usd"], range: ["#1a6b8a", "#c0392b"] },
      legend: { title: "Price Type", labelExpr: "datum.label === 'legal_price_usd' ? 'Legal' : 'Illicit'" }
    },
    tooltip: [
      { field: "country", title: "Country" },
      { field: "price_type", title: "Type" },
      { field: "price", title: "Price (USD)", format: ".2f" },
      { field: "tax_share_pct", title: "Tax Share (%)" },
      { field: "smoking_prevalence_pct", title: "Smoking Prevalence (%)" }
    ]
  }
});

// ── Chart 7: Demographics — 5-CATEGORY PALETTE (dropdown) ─────
vegaEmbed("#demographics", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence by Demographic Group",
  width: 400,
  height: 200,
  params: [{
    name: "category_selection",
    bind: {
      input: "select",
      options: [null, "gender", "age_group", "ethnicity", "education", "residence"],
      labels: ["Show All", "Gender", "Age Group", "Ethnicity", "Education", "Residence"],
      name: "Filter by category: "
    }
  }],
  data: { url: BASE + "smoking_demographics.csv" },
  transform: [{ filter: "category_selection == null || datum.category == category_selection" }],
  layer: [
    {
      mark: { type: "bar", cornerRadiusEnd: 4 },
      encoding: {
        y: { field: "group", type: "nominal", title: null, sort: { field: "prevalence_pct", op: "max", order: "descending" }, axis: { labelFontSize: 12 } },
        x: { field: "prevalence_pct", type: "quantitative", title: "Smoking Prevalence (%)", scale: { domain: [0, 45] } },
        color: {
          field: "category", type: "nominal",
          scale: {
            domain: ["gender","age_group","ethnicity","education","residence"],
            range: ["#c0392b","#1a6b8a","#e07b00","#d4a017","#7b2d8b"]
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
      mark: { type: "text", align: "left", dx: 5, fontSize: 11, fontWeight: "bold", color: "#4a3f30" },
      encoding: {
        y: { field: "group", type: "nominal", sort: { field: "prevalence_pct", op: "max", order: "descending" } },
        x: { field: "prevalence_pct", type: "quantitative" },
        text: { field: "prevalence_pct", format: ".1f" }
      }
    }
  ]
});

// ── Chart 8: Gender Trend — BLUE (male) + TERRACOTTA (female) ─
vegaEmbed("#gender_trend", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Male vs Female Smoking Prevalence in Malaysia (2011–2023)",
  width: 620,
  height: 300,
  data: { url: BASE + "smoking_trend_national.csv" },
  transform: [{ fold: ["prevalence_male", "prevalence_female"], as: ["gender", "prevalence"] }],
  layer: [
    {
      mark: { type: "line", point: { size: 70 } },
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: { field: "prevalence", type: "quantitative", title: "Prevalence (%)", scale: { zero: true, domain: [0, 48] } },
        color: {
          field: "gender", type: "nominal",
          scale: { domain: ["prevalence_male","prevalence_female"], range: ["#1a6b8a","#e07b54"] },
          legend: { title: "Gender", labelExpr: "datum.label === 'prevalence_male' ? 'Male' : 'Female'" }
        },
        strokeWidth: {
          field: "gender", type: "nominal",
          scale: { domain: ["prevalence_male","prevalence_female"], range: [3, 2] },
          legend: null
        },
        strokeDash: {
          field: "gender", type: "nominal",
          scale: { domain: ["prevalence_male","prevalence_female"], range: [[1,0],[6,3]] },
          legend: null
        },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "gender", title: "Gender" },
          { field: "prevalence", title: "Prevalence (%)" },
          { field: "source", title: "Source" }
        ]
      }
    },
    {
      data: { values: [
        { year: "2023", prevalence: 35.7, label: "Male: 35.7%" },
        { year: "2023", prevalence: 1.5, label: "Female: 1.5%" }
      ]},
      mark: { type: "text", align: "right", dx: -6, fontSize: 11, fontWeight: "bold" },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "prevalence", type: "quantitative" },
        text: { field: "label" },
        color: {
          field: "label", type: "nominal",
          scale: { domain: ["Male: 35.7%","Female: 1.5%"], range: ["#1a6b8a","#e07b54"] },
          legend: null
        }
      }
    }
  ]
});

// ── Chart 9: Ethnicity Bars — BLUES SEQUENTIAL ────────────────
vegaEmbed("#ethnicity_bar", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Smoking Prevalence by Ethnicity in Malaysia (2019)",
  width: 500,
  height: 200,
  data: { values: [
    { ethnicity: "Malay", prevalence: 22.6 },
    { ethnicity: "Other Bumiputra", prevalence: 21.7 },
    { ethnicity: "Chinese", prevalence: 13.7 },
    { ethnicity: "Indian", prevalence: 11.5 }
  ]},
  layer: [
    {
      mark: { type: "bar", cornerRadiusEnd: 4 },
      encoding: {
        y: { field: "ethnicity", type: "nominal", title: null, sort: { field: "prevalence", order: "descending" }, axis: { labelFontSize: 13 } },
        x: { field: "prevalence", type: "quantitative", title: "Smoking Prevalence (%)", scale: { domain: [0, 30] } },
        color: {
          field: "prevalence", type: "quantitative",
          scale: { scheme: "blues", domain: [10, 25] },
          legend: null
        },
        tooltip: [
          { field: "ethnicity", title: "Ethnicity" },
          { field: "prevalence", title: "Prevalence (%)" }
        ]
      }
    },
    {
      mark: { type: "text", align: "left", dx: 6, fontSize: 12, fontWeight: "bold", color: "#4a3f30" },
      encoding: {
        y: { field: "ethnicity", type: "nominal", sort: { field: "prevalence", order: "descending" } },
        x: { field: "prevalence", type: "quantitative" },
        text: { field: "prevalence", format: ".1f" }
      }
    }
  ]
});

// ── Chart 10: Tax vs Illicit — CRIMSON + GREEN (dual axis) ────
vegaEmbed("#tax_vs_illicit", {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Excise Duty vs Illicit Market Share (2015–2024)",
  width: 620,
  height: 320,
  resolve: { scale: { y: "independent" } },
  layer: [
    {
      data: { url: BASE + "illicit_cigarettes_trend.csv" },
      mark: { type: "area", opacity: 0.1, color: "#c0392b" },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "illicit_share_pct", type: "quantitative", title: "Illicit Market Share (%)", axis: { titleColor: "#922b21", labelColor: "#922b21", orient: "left", titlePadding: 10 }, scale: { domain: [30, 72] } },
        y2: { datum: 30 }
      }
    },
    {
      data: { url: BASE + "illicit_cigarettes_trend.csv" },
      mark: { type: "line", point: { size: 60, fill: "#c0392b" }, color: "#c0392b", strokeWidth: 2.5 },
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: { field: "illicit_share_pct", type: "quantitative", scale: { domain: [30, 72] } },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "illicit_share_pct", title: "Illicit Share (%)" }
        ]
      }
    },
    {
      data: { url: BASE + "excise_duty_rates.csv" },
      transform: [{ filter: "datum.year >= 2015" }],
      mark: { type: "line", point: { size: 60, fill: "#e07b00" }, color: "#e07b00", strokeWidth: 2.5, strokeDash: [6, 3] },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "duty_per_stick_sen", type: "quantitative", title: "Duty per Stick (sen)", axis: { titleColor: "#b35900", labelColor: "#b35900", orient: "right", titlePadding: 12, titleAngle: 90, titleAlign: "center" }, scale: { domain: [15, 50] } },
        tooltip: [
          { field: "year", title: "Year" },
          { field: "duty_per_stick_sen", title: "Duty (sen/stick)" },
          { field: "notes", title: "Notes" }
        ]
      }
    },
    {
      data: { values: [
        { year: "2015", y: 68, label: "Tax: 20 sen →" },
        { year: "2016", y: 63, label: "Tax: 40 sen →" }
      ]},
      mark: { type: "text", align: "left", dx: 5, fontSize: 10, fontWeight: "bold", color: "#b35900" },
      encoding: {
        x: { field: "year", type: "ordinal" },
        y: { field: "y", type: "quantitative", scale: { domain: [30, 72] } },
        text: { field: "label" }
      }
    }
  ]
});
