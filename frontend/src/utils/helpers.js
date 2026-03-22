export function fmtINR(n) {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + " L";
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
  return inv.type === "sip" ? inv.totalInvested : inv.amount;
}

export function getCurrentVal(inv, funds) {
  const f = funds.find((f) => f.id === inv.fundId);
  return f ? parseFloat((inv.units * f.nav).toFixed(2)) : 0;
}
