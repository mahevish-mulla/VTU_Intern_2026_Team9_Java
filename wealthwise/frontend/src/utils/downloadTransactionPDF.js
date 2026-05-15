// ─────────────────────────────────────────────────────────────
//  WealthWise — Transaction History PDF Generator
//  Style: CAS-style — Investor details table on top,
//         fund-wise transactions, running balance, totals row
//  Uses: jsPDF + jspdf-autotable
//  Install: npm install jspdf jspdf-autotable
// ─────────────────────────────────────────────────────────────

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── Colour Palette ────────────────────────────────────────────
const WHITE = [255, 255, 255];
const DARK_NAVY = [26, 47, 88];   // header bg & table head bg
const AMBER = [244, 160, 28];   // brand amber
const AMBER_DARK = [180, 90, 0];   // readable amber on white
const GREY_50 = [248, 249, 250];   // investor details row alt
const GREY_100 = [235, 238, 242];   // table alt row
const GREY_200 = [209, 213, 219];   // borders / dividers
const GREY_500 = [107, 114, 128];   // muted text
const GREY_800 = [31, 41, 55];   // body text
const GREEN = [22, 163, 74];   // positive returns
const RED = [220, 38, 38];   // negative returns

// ── Helpers ───────────────────────────────────────────────────
const INR = (n) =>
    new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(n);

const fmtDate = (raw) => {
    if (!raw) return "-";
    try {
        if (Array.isArray(raw)) {
            const d = new Date(raw[0], (raw[1] || 1) - 1, raw[2] || 1);
            return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
        }
        const d = new Date(raw);
        if (isNaN(d.getTime())) return "-";
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return "-"; }
};

const todayFull = () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
const todayShort = () => new Date().toISOString().slice(0, 10);
const safe = (v) => (v && String(v).trim()) || "Not Provided";

// ── Draw WealthWise header banner ─────────────────────────────
function drawHeader(doc, PW) {
    // Dark navy banner
    doc.setFillColor(...DARK_NAVY);
    doc.rect(0, 0, PW, 28, "F");

    // Amber bottom border
    doc.setFillColor(...AMBER);
    doc.rect(0, 28, PW, 1.2, "F");

    // "Wealth" white + "Wise" amber
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...WHITE);
    doc.text("Wealth", 14, 18);
    const ww = doc.getTextWidth("Wealth");
    doc.setTextColor(...AMBER);
    doc.text("Wise", 14 + ww, 18);

    // Tagline right side
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(200, 210, 230);
    doc.text("Transaction History Report", PW - 14, 14, { align: "right" });
    doc.setFontSize(7);
    doc.setTextColor(150, 165, 190);
    doc.text(`Generated: ${todayFull()}`, PW - 14, 22, { align: "right" });
}

// ── Main Export ───────────────────────────────────────────────

/**
 * @param {object} params
 * @param {Array}  params.investments  - raw investments array from your component
 * @param {Array}  params.funds        - funds array (id, name, schemeCode, nav, category, amc)
 * @param {object} params.liveNavs     - { [schemeCode]: navNumber }
 * @param {object} params.user         - { name, email, phone, pan, address }
 * @param {string} params.filterLabel  - "All" | "SIP" | "Lumpsum"
 */
export function downloadTransactionPDF({
    investments,
    funds,
    liveNavs,
    user,
    filterLabel = "All",
}) {
    // ── 1. Compute totals ───────────────────────────────────────
    const totalInvested = investments.reduce((a, inv) => a + Number(inv.amount), 0);

    const currentValue = investments.reduce((sum, inv) => {
        const fund = funds.find((f) => f.id === inv.mutualFund?.fundId);
        if (!fund) return sum;
        const nav = liveNavs[fund.schemeCode] || fund.nav;
        return sum + Number(inv.units) * nav;
    }, 0);

    const totalReturn = currentValue - totalInvested;
    const returnPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
    const isPositive = totalReturn >= 0;

    // ── 2. Build per-fund grouped rows with running balance ─────
    const fundMap = new Map();
    investments.forEach((inv) => {
        const fundId = inv.mutualFund?.fundId;
        if (!fundMap.has(fundId)) fundMap.set(fundId, []);
        fundMap.get(fundId).push(inv);
    });

    // ── 3. Init PDF — A4 portrait ───────────────────────────────
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const PW = doc.internal.pageSize.getWidth();   // 210
    const PH = doc.internal.pageSize.getHeight();  // 297

    // White base
    doc.setFillColor(...WHITE);
    doc.rect(0, 0, PW, PH, "F");

    // ── 4. Header banner ────────────────────────────────────────
    drawHeader(doc, PW);

    let curY = 36;

    // ── 5. "Investor Details" section heading ───────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...GREY_800);
    doc.text("Investor Details", 14, curY + 6);

    // Underline
    doc.setDrawColor(...DARK_NAVY);
    doc.setLineWidth(0.6);
    doc.line(14, curY + 8, PW - 14, curY + 8);

    curY += 14;

    // ── 6. Investor details table ───────────────────────────────
    //    Two-column layout: label (bold) | value, repeated twice per row
    const detailRows = [
        ["Name", safe(user?.name), "Report Date", todayFull()],
        ["Email", safe(user?.email), "Phone", safe(user?.phone)],
        ["Filter", filterLabel, "PAN", safe(user?.pan)],
    ];

    autoTable(doc, {
        startY: curY,
        margin: { left: 14, right: 14 },
        theme: "plain",
        body: detailRows,
        styles: {
            font: "helvetica",
            fontSize: 9,
            cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
            lineColor: GREY_200,
            lineWidth: 0.3,
            textColor: GREY_800,
        },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 28, fillColor: GREY_50, textColor: GREY_800 },
            1: { cellWidth: 66, fillColor: WHITE },
            2: { fontStyle: "bold", cellWidth: 28, fillColor: GREY_50, textColor: GREY_800 },
            3: { cellWidth: 60, fillColor: WHITE },
        },
        // alternate row shading
        didParseCell(data) {
            if (data.row.index % 2 === 0) {
                if (data.column.index === 0 || data.column.index === 2) {
                    data.cell.styles.fillColor = [220, 226, 237];
                }
            }
        },
    });

    curY = doc.lastAutoTable.finalY + 10;

    // ── 7. Portfolio Summary heading ────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...GREY_800);
    doc.text("Portfolio Summary", 14, curY + 6);

    doc.setDrawColor(...DARK_NAVY);
    doc.setLineWidth(0.6);
    doc.line(14, curY + 8, PW - 14, curY + 8);

    curY += 14;

    // ── 8. Per-fund transaction tables ──────────────────────────
    fundMap.forEach((invList, fundId) => {
        const fund = funds.find((f) => f.id === fundId);
        const fundName = fund?.name || "Unknown Fund";
        const schemeCode = fund?.schemeCode || "";
        const category = fund?.category || "";
        const amc = fund?.amc || "";

        // Sort by date ascending
        const sorted = [...invList].sort((a, b) => {
            const da = new Date(a.investmentDate || a.investedAt || a.createdAt || a.date);
            const db = new Date(b.investmentDate || b.investedAt || b.createdAt || b.date);
            return da - db;
        });

        // Running balance unit tracker
        let balanceUnits = 0;

        const tableRows = sorted.map((inv) => {
            const nav = fund ? (liveNavs[fund.schemeCode] || fund.nav) : 0;
            const units = Number(inv.units);
            const amount = Number(inv.amount);
            balanceUnits += units;

            return [
                fmtDate(inv.investmentDate || inv.investedAt || inv.createdAt || inv.date),
                inv.type === "SIP" ? "SIP Purchase" : "Lumpsum Purchase",
                INR(amount),
                units.toFixed(3),
                `Rs. ${Number(inv.buyNav || nav).toFixed(2)}`,
                balanceUnits.toFixed(3),
            ];
        });

        // Fund name block
        if (curY > PH - 60) {
            doc.addPage();
            doc.setFillColor(...WHITE);
            doc.rect(0, 0, PW, PH, "F");
            drawHeader(doc, PW);
            curY = 36;
        }

        // Fund title row
        doc.setFillColor(...GREY_50);
        doc.rect(14, curY, PW - 28, 16, "F");
        doc.setDrawColor(...GREY_200);
        doc.setLineWidth(0.3);
        doc.rect(14, curY, PW - 28, 16);

        // Amber left accent bar
        doc.setFillColor(...AMBER);
        doc.rect(14, curY, 2.5, 16, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...DARK_NAVY);
        doc.text(fundName, 20, curY + 6.5, { maxWidth: PW - 40 });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...GREY_500);
        const metaLine = [schemeCode && `ISIN: ${schemeCode}`, amc && `AMC: ${amc}`, category && `Category: ${category}`]
            .filter(Boolean).join("  |  ");
        doc.text(metaLine, 20, curY + 12.5, { maxWidth: PW - 40 });

        curY += 20;

        // Transaction table for this fund
        autoTable(doc, {
            startY: curY,
            margin: { left: 14, right: 14 },
            theme: "plain",

            head: [["Date", "Transaction", "Amount (Rs.)", "Units", "NAV (Rs.)", "Balance Units"]],

            body: tableRows,

            styles: {
                font: "helvetica",
                fontSize: 8,
                textColor: GREY_800,
                cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 },
                lineColor: GREY_200,
                lineWidth: 0.25,
                fillColor: WHITE,
                valign: "middle",
            },

            headStyles: {
                fontSize: 8,
                fontStyle: "bold",
                textColor: WHITE,
                fillColor: DARK_NAVY,
                lineWidth: 0,
                cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
                halign: "center",
            },

            alternateRowStyles: { fillColor: GREY_100 },

            columnStyles: {
                0: { cellWidth: 26, halign: "center" },
                1: { cellWidth: 38 },
                2: { cellWidth: 30, halign: "right" },
                3: { cellWidth: 22, halign: "right" },
                4: { cellWidth: 26, halign: "right" },
                5: { cellWidth: 30, halign: "right" },
            },
        });

        curY = doc.lastAutoTable.finalY + 8;
    });

    // ── 9. Grand Totals block ────────────────────────────────────
    if (curY > PH - 50) {
        doc.addPage();
        doc.setFillColor(...WHITE);
        doc.rect(0, 0, PW, PH, "F");
        drawHeader(doc, PW);
        curY = 36;
    }

    // Section label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...GREY_800);
    doc.text("Summary Totals", 14, curY + 6);
    doc.setDrawColor(...DARK_NAVY);
    doc.setLineWidth(0.6);
    doc.line(14, curY + 8, PW - 14, curY + 8);

    curY += 14;

    const totalRows = [
        ["Total Invested", `Rs. ${INR(totalInvested)}`],
        ["Current Value", `Rs. ${INR(currentValue)}`],
        ["Total Returns", `${isPositive ? "+" : "-"}Rs. ${INR(Math.abs(totalReturn))} (${isPositive ? "+" : ""}${returnPct.toFixed(2)}%)`],
        ["No. of Transactions", String(investments.length)],
    ];

    autoTable(doc, {
        startY: curY,
        margin: { left: 14, right: 14 },
        theme: "plain",
        body: totalRows,
        styles: {
            font: "helvetica",
            fontSize: 9.5,
            cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
            lineColor: GREY_200,
            lineWidth: 0.3,
            textColor: GREY_800,
        },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 60, fillColor: [220, 226, 237] },
            1: { cellWidth: 100, fillColor: WHITE },
        },
        didParseCell(data) {
            // Returns row — color the value
            if (data.row.index === 2 && data.column.index === 1) {
                data.cell.styles.textColor = isPositive ? GREEN : RED;
                data.cell.styles.fontStyle = "bold";
            }
            if (data.column.index === 0) {
                data.cell.styles.fillColor = [220, 226, 237];
            }
        },
    });

    curY = doc.lastAutoTable.finalY + 8;

    // ── 10. Footer on every page ──────────────────────────────────
    const pageCount = doc.internal.getNumberOfPages();

    for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);

        doc.setDrawColor(...GREY_200);
        doc.setLineWidth(0.4);
        doc.line(14, PH - 14, PW - 14, PH - 14);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6);
        doc.setTextColor(...GREY_500);
        doc.text(
            "WealthWise is not SEBI registered. This report is for informational purposes only. " +
            "Mutual fund investments are subject to market risk. Please read all scheme-related documents carefully.",
            14, PH - 9,
            { maxWidth: PW - 55 }
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(...AMBER_DARK);
        doc.text("WealthWise", PW - 14, PH - 9, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(...GREY_500);
        doc.text(`Page ${p} of ${pageCount}`, PW - 14, PH - 5, { align: "right" });
    }

    // ── 11. Save ──────────────────────────────────────────────────
    doc.save(`WealthWise_Transactions_${todayShort()}.pdf`);
}