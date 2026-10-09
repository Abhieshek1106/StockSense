// const $ = id => document.getElementById(id); let chart;
// const money = n => "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });
// function profile() { let vals = [["Budget", $("budget").selectedOptions[0].text], ["Risk", $("risk").value], ["Duration", $("duration").value], ["Sector", $("sector").value], ["Goal", $("goal").value]]; $("profile").innerHTML = vals.map(x => `<p><span>${x[0]}</span><b>${x[1]}</b></p>`).join("") }
// function trend(s) { $("chartempty").style.display = "none"; if (chart) chart.destroy(); let labels = ["Now", "6d", "12d", "18d", "24d", "30d"]; let vals = labels.map((_, i) => s.price + (s.predicted - s.price) * i / 5); chart = new Chart($("chart"), { type: "line", data: { labels, datasets: [{ data: vals, borderColor: "#25866b", backgroundColor: "rgba(37,134,107,.1)", fill: true, tension: .35, pointRadius: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { ticks: { callback: v => "₹" + v } } } } }) }
// $("form").addEventListener("submit", async e => { e.preventDefault(); profile(); let b = e.target.querySelector("button"); b.disabled = true; b.textContent = "Analyzing…"; try { let r = await fetch("/api/recommend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ budget: $("budget").value, risk: $("risk").value, duration: $("duration").value, sector: $("sector").value, goal: $("goal").value }) }); let d = await r.json(), items = d.results; $("count").textContent = items.length + " found"; $("sub").textContent = items.length ? "Filtered by preferences and ranked by model outputs." : "No match. Try broader filters."; if (!items.length) { $("cards").innerHTML = '<div class="empty">No matching stocks found.</div>'; return } $("cards").innerHTML = items.map((s, i) => `<article class="stock"><div class="stockhead"><span class="ticker">${s.symbol.slice(0, 4)}</span><div><b>${s.name}</b><small>${s.symbol} · ${s.sector}</small></div><span class="risk">${s.risk} risk proxy</span></div><div class="metrics"><div><small>Dataset close</small><b>${money(s.price)}</b></div><div><small>Model estimate</small><b>${money(s.predicted)}</b></div><div><small>Estimated return</small><b class="${s.change >= 0 ? "up" : "down"}">${s.change >= 0 ? "↗" : "↘"} ${s.change}%</b></div><button data-i="${i}">View trend ↗</button></div><small class="note">Positive-direction model probability: ${s.probability}% · Synthetic data</small></article>`).join(""); $("cards").querySelectorAll("button").forEach(btn => btn.onclick = () => trend(items[+btn.dataset.i])); trend(items[0]) } catch (err) { $("cards").textContent = "Could not load results. Is Flask running?" } finally { b.disabled = false; b.textContent = "Find matching stocks　→" } });
// ["budget", "risk", "duration", "sector", "goal"].forEach(id => $(id).addEventListener("change", profile));

// let priceChart = null;


// /* =========================================================
//    SHOW STOCK PRICE CHART
//    ========================================================= */

// function showStockChart(stock) {

//     const canvas = document.getElementById("chart");
//     const empty = document.getElementById("chartempty");

//     const selectedStock = document.getElementById("selectedStock");
//     const chartSubtitle = document.getElementById("chartSubtitle");

//     if (!canvas) return;

//     empty.style.display = "none";

//     selectedStock.textContent =
//         stock.Symbol + " · " + stock.Company;

//     chartSubtitle.textContent =
//         "Previous price vs estimated 30-day price";


//     /*
//      * Current price from dataset
//      */
//     const currentPrice = Number(stock.Close);


//     /*
//      * Model estimated return
//      *
//      * Example:
//      * Close = ₹1,000
//      * Target_Return = 8
//      *
//      * Estimated price:
//      * ₹1,000 × (1 + 8/100)
//      * = ₹1,080
//      */
//     const targetReturn = Number(stock.Target_Return);

//     const estimatedPrice =
//         currentPrice * (1 + targetReturn / 100);


//     /*
//      * Create simulated previous prices.
//      *
//      * IMPORTANT:
//      * The current dataset does not contain daily historical
//      * prices, so this is a visual simulation for the
//      * educational project.
//      */
//     const previousPrices = [];

//     const startPrice =
//         Number(stock.Open || currentPrice);

//     const low =
//         Number(stock.Low || currentPrice);

//     const high =
//         Number(stock.High || currentPrice);


//     for (let i = 0; i < 30; i++) {

//         const progress = i / 29;

//         let price =
//             startPrice +
//             (currentPrice - startPrice) * progress;

//         /*
//          * Small deterministic variation
//          * based on the stock's trading range.
//          */
//         const variation =
//             Math.sin(i * 1.7) *
//             ((high - low) * 0.08);

//         price += variation;

//         previousPrices.push(
//             Number(price.toFixed(2))
//         );
//     }


//     /*
//      * Estimated future prices
//      */

//     const estimatedPrices =
//         new Array(30).fill(null);

//     for (let i = 0; i < 30; i++) {

//         const progress = i / 29;

//         const price =
//             currentPrice +
//             (estimatedPrice - currentPrice) * progress;

//         estimatedPrices.push(
//             Number(price.toFixed(2))
//         );
//     }


//     /*
//      * Labels
//      */

//     const labels = [];

//     for (let i = 30; i >= 1; i--) {
//         labels.push("P-" + i);
//     }

//     labels.push("Today");

//     for (let i = 1; i <= 30; i++) {
//         labels.push("E+" + i);
//     }


//     /*
//      * Combine datasets
//      */

//     const historyData = [
//         ...previousPrices,
//         currentPrice,
//         ...new Array(30).fill(null)
//     ];


//     const estimateData = [
//         ...new Array(30).fill(null),
//         currentPrice,
//         ...estimatedPrices
//     ];


//     /*
//      * Destroy old chart
//      */

//     if (priceChart) {
//         priceChart.destroy();
//     }


//     /*
//      * Create new chart
//      */

//     priceChart = new Chart(canvas, {

//         type: "line",

//         data: {

//             labels: labels,

//             datasets: [

//                 {
//                     label: "Previous Price",

//                     data: historyData,

//                     borderColor: "#2563eb",

//                     backgroundColor:
//                         "rgba(37, 99, 235, 0.08)",

//                     borderWidth: 2,

//                     pointRadius: 0,

//                     pointHoverRadius: 5,

//                     tension: 0.35,

//                     fill: true
//                 },

//                 {
//                     label: "Estimated Price",

//                     data: estimateData,

//                     borderColor: "#10b981",

//                     backgroundColor:
//                         "rgba(16, 185, 129, 0.08)",

//                     borderWidth: 2,

//                     borderDash: [6, 5],

//                     pointRadius: 0,

//                     pointHoverRadius: 5,

//                     tension: 0.35,

//                     fill: false
//                 }

//             ]
//         },

//         options: {

//             responsive: true,

//             maintainAspectRatio: false,

//             interaction: {
//                 mode: "index",
//                 intersect: false
//             },

//             plugins: {

//                 legend: {
//                     display: false
//                 },

//                 tooltip: {

//                     callbacks: {

//                         label: function (context) {

//                             if (
//                                 context.raw === null ||
//                                 context.raw === undefined
//                             ) {
//                                 return "";
//                             }

//                             return (
//                                 context.dataset.label +
//                                 ": ₹" +
//                                 Number(context.raw)
//                                     .toLocaleString(
//                                         "en-IN",
//                                         {
//                                             minimumFractionDigits: 2,
//                                             maximumFractionDigits: 2
//                                         }
//                                     )
//                             );
//                         }
//                     }
//                 }
//             },

//             scales: {

//                 x: {

//                     grid: {
//                         display: false
//                     },

//                     ticks: {

//                         maxTicksLimit: 8,

//                         color: "#8996aa",

//                         font: {
//                             size: 9
//                         }
//                     }
//                 },

//                 y: {

//                     grid: {
//                         color: "#edf1f6"
//                     },

//                     ticks: {

//                         color: "#8996aa",

//                         font: {
//                             size: 9
//                         },

//                         callback: function (value) {

//                             return "₹" +
//                                 Number(value)
//                                     .toLocaleString(
//                                         "en-IN"
//                                     );
//                         }
//                     }
//                 }
//             }
//         }
//     });
// }


const $ = id => document.getElementById(id);

let chart = null;


/* =========================================================
   MONEY FORMAT
   ========================================================= */

const money = n =>
    "₹" + Number(n).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });


/* =========================================================
   PROFILE
   ========================================================= */

function profile() {

    let vals = [
        ["Budget", $("budget").selectedOptions[0].text],
        ["Risk", $("risk").value],
        ["Duration", $("duration").value],
        ["Sector", $("sector").value],
        ["Goal", $("goal").value]
    ];

    $("profile").innerHTML =
        vals.map(x =>
            `<p>
                <span>${x[0]}</span>
                <b>${x[1]}</b>
            </p>`
        ).join("");
}


/* =========================================================
   STOCK PRICE TREND
   ========================================================= */

function trend(s) {

    const canvas = $("chart");
    const empty = $("chartempty");

    if (!canvas) return;

    empty.style.display = "none";


    /* -----------------------------------------------------
       Update chart title if those elements exist
       ----------------------------------------------------- */

    const selectedStock = $("selectedStock");
    const chartSubtitle = $("chartSubtitle");

    if (selectedStock) {
        selectedStock.textContent =
            `${s.symbol} · ${s.name}`;
    }

    if (chartSubtitle) {
        chartSubtitle.textContent =
            "Previous price vs estimated 30-day price";
    }


    /* -----------------------------------------------------
       Current price
       ----------------------------------------------------- */

    const currentPrice = Number(s.price);


    /* -----------------------------------------------------
       Estimated price

       The Flask API already calculates s.predicted,
       so use that directly instead of calculating it again.
       ----------------------------------------------------- */

    const estimatedPrice = Number(s.predicted);


    /* -----------------------------------------------------
       Previous price trend

       Your current dataset has only one price record per
       stock, not 30 days of historical prices.

       Therefore we create a visual previous-price trend
       between Open and Close using the stock's available
       trading range.

       These values are for educational visualization only.
       ----------------------------------------------------- */

    const startPrice = Number(
        s.open || s.price
    );

    const low = Number(
        s.low || s.price
    );

    const high = Number(
        s.high || s.price
    );


    const previousPrices = [];

    for (let i = 0; i < 30; i++) {

        const progress = i / 29;

        let price =
            startPrice +
            (currentPrice - startPrice) * progress;


        /* Small variation based on trading range */

        const variation =
            Math.sin(i * 1.7) *
            ((high - low) * 0.08);


        price += variation;


        previousPrices.push(
            Number(price.toFixed(2))
        );
    }


    /* -----------------------------------------------------
       Estimated future prices
       ----------------------------------------------------- */

    const estimatedPrices = [];

    for (let i = 0; i < 30; i++) {

        const progress = i / 29;

        const price =
            currentPrice +
            (estimatedPrice - currentPrice) * progress;

        estimatedPrices.push(
            Number(price.toFixed(2))
        );
    }


    /* -----------------------------------------------------
       Chart labels
       ----------------------------------------------------- */

    const labels = [];


    /* Previous period */

    for (let i = 30; i >= 1; i--) {
        labels.push("P-" + i);
    }


    /* Current */

    labels.push("Today");


    /* Future period */

    for (let i = 1; i <= 30; i++) {
        labels.push("E+" + i);
    }


    /* -----------------------------------------------------
       Previous price dataset
       ----------------------------------------------------- */

    const historyData = [
        ...previousPrices,
        currentPrice,
        ...new Array(30).fill(null)
    ];


    /* -----------------------------------------------------
       Estimated price dataset
       ----------------------------------------------------- */

    const estimateData = [
        ...new Array(30).fill(null),
        currentPrice,
        ...estimatedPrices
    ];


    /* -----------------------------------------------------
       Destroy previous chart
       ----------------------------------------------------- */

    if (chart) {
        chart.destroy();
    }


    /* -----------------------------------------------------
       Create new chart
       ----------------------------------------------------- */

    chart = new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                /* =========================================
                   PREVIOUS PRICE
                   ========================================= */

                {
                    label: "Previous Price",

                    data: historyData,

                    borderColor: "#2563eb",

                    backgroundColor:
                        "rgba(37, 99, 235, 0.08)",

                    borderWidth: 2,

                    pointRadius: 0,

                    pointHoverRadius: 5,

                    tension: 0.35,

                    fill: true
                },


                /* =========================================
                   ESTIMATED PRICE
                   ========================================= */

                {
                    label: "Estimated Price",

                    data: estimateData,

                    borderColor:
                        Number(s.change) >= 0
                            ? "#10b981"
                            : "#ef4444",

                    backgroundColor:
                        Number(s.change) >= 0
                            ? "rgba(16, 185, 129, 0.08)"
                            : "rgba(239, 68, 68, 0.08)",

                    borderWidth: 2,

                    borderDash: [6, 5],

                    pointRadius: 0,

                    pointHoverRadius: 5,

                    tension: 0.35,

                    fill: false
                }

            ]
        },


        /* =================================================
           CHART OPTIONS
           ================================================= */

        options: {

            responsive: true,

            maintainAspectRatio: false,


            interaction: {
                mode: "index",
                intersect: false
            },


            plugins: {

                legend: {
                    display: false
                },


                tooltip: {

                    callbacks: {

                        label: function (context) {

                            if (
                                context.raw === null ||
                                context.raw === undefined
                            ) {
                                return "";
                            }

                            return (
                                context.dataset.label +
                                ": " +
                                money(context.raw)
                            );
                        }
                    }
                }
            },


            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {

                        maxTicksLimit: 9,

                        color: "#8996aa",

                        font: {
                            size: 9
                        }
                    }
                },


                y: {

                    grid: {
                        color: "#edf1f6"
                    },

                    ticks: {

                        color: "#8996aa",

                        font: {
                            size: 9
                        },

                        callback: function (value) {

                            return money(value);
                        }
                    }
                }
            }
        }
    });
}


/* =========================================================
   RECOMMENDATION FORM
   ========================================================= */

$("form").addEventListener(
    "submit",
    async e => {
        e.preventDefault();
        profile();

        const button =
            e.target.querySelector("button");

        button.disabled = true;

        button.textContent =
            "Analyzing…";


        try {
            const response =
                await fetch(
                    "/api/recommend",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            budget:
                                $("budget").value,

                            risk:
                                $("risk").value,

                            duration:
                                $("duration").value,

                            sector:
                                $("sector").value,

                            goal:
                                $("goal").value
                        })
                    }
                );


            const data =
                await response.json();

            const items =
                data.results;

            /* ---------------------------------------------
               Result count
               --------------------------------------------- */

            $("count").textContent =
                items.length + " found";


            $("sub").textContent =
                items.length
                    ? "Filtered by preferences and ranked by model outputs."
                    : "No match. Try broader filters.";


            /* ---------------------------------------------
               No results
               --------------------------------------------- */

            if (!items.length) {

                $("cards").innerHTML =
                    '<div class="empty">' +
                    'No matching stocks found.' +
                    '</div>';

                if (chart) {
                    chart.destroy();
                    chart = null;
                }

                $("chartempty").style.display =
                    "grid";

                return;
            }


            /* ---------------------------------------------
               Create stock cards
               --------------------------------------------- */

            $("cards").innerHTML =

                items.map((s, i) => `

                    <article class="stock">

                        <div class="stockhead">

                            <span class="ticker">
                                ${s.symbol.slice(0, 4)}
                            </span>

                            <div>

                                <b>
                                    ${s.name}
                                </b>

                                <small>
                                    ${s.symbol}
                                    ·
                                    ${s.sector}
                                </small>

                            </div>

                            <span class="risk">
                                ${s.risk} risk proxy
                            </span>

                        </div>


                        <div class="metrics">

                            <div>

                                <small>
                                    Dataset close
                                </small>

                                <b>
                                    ${money(s.price)}
                                </b>

                            </div>


                            <div>

                                <small>
                                    Model estimate
                                </small>

                                <b>
                                    ${money(s.predicted)}
                                </b>

                            </div>


                            <div>

                                <small>
                                    Estimated return
                                </small>

                                <b class="${s.change >= 0
                        ? "up"
                        : "down"
                    }">

                                    ${s.change >= 0
                        ? "↗"
                        : "↘"
                    }

                                    ${s.change}%

                                </b>

                            </div>


                            <button
                                data-i="${i}">
                                View trend ↗
                            </button>

                        </div>


                        <small class="note">

                            Positive-direction model
                            probability:
                            ${s.probability}%

                            · Synthetic data

                        </small>

                    </article>

                `).join("");


            /* ---------------------------------------------
               Attach chart buttons
               --------------------------------------------- */

            $("cards")
                .querySelectorAll("button")
                .forEach(button => {

                    button.onclick = () => {

                        const stock =
                            items[
                            Number(button.dataset.i)
                            ];

                        trend(stock);

                    };

                });


            /* ---------------------------------------------
               Show first stock automatically
               --------------------------------------------- */

            trend(items[0]);


        } catch (err) {

            console.error(err);

            $("cards").innerHTML =
                '<div class="empty">' +
                'Could not load results. ' +
                'Is Flask running?' +
                '</div>';

        } finally {

            button.disabled = false;

            button.textContent =
                "Find matching stocks　→";
        }
    }
);


/* =========================================================
   UPDATE PROFILE WHEN USER CHANGES OPTIONS
   ========================================================= */

[
    "budget",
    "risk",
    "duration",
    "sector",
    "goal"

].forEach(id => {

    $(id).addEventListener(
        "change",
        profile
    );

});


/* =========================================================
   INITIAL PROFILE
   ========================================================= */

profile();