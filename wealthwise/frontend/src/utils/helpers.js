export function fmtINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function fmtFull(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function abbr(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 4)
    .toUpperCase();
}

export function getInvested(inv) {
  const type = (inv.type || "").toLowerCase();
  if (type === "sip") return inv.totalInvested || (inv.amount * (inv.instalments || 1)) || 0;
  return inv.amount || inv.totalInvested || 0;
}

export function getCurrentVal(inv, funds) {
  const f = funds.find((f) => f.id === inv.mutualFund?.fundId);
  return f ? parseFloat((inv.units * f.nav).toFixed(2)) : 0;
}
