import { useState, useEffect, useCallback, useRef } from "react";

// ─── Fund metadata ────────────────────────────────────────────────────────────
const FUND_META = {
  FID5982:  { name:"Fidelity Global Innovators SR F",      color:"#6366f1", asAt:"Mar 31 2026", totalHoldings:198, currency:"CAD",
    holdings:[
      {ticker:"AMZN",  name:"Amazon.com",           pct:10.34,cur:"USD",sector:"Consumer Disc.", geo:"United States"},
      {ticker:"NVDA",  name:"Nvidia",               pct:7.49, cur:"USD",sector:"Technology",    geo:"United States"},
      {ticker:"TSM",   name:"Taiwan Semiconductor", pct:5.72, cur:"USD",sector:"Technology",    geo:"Taiwan"},
      {ticker:"GOOGL", name:"Alphabet Cl. A",       pct:5.44, cur:"USD",sector:"Comm. Services",geo:"United States"},
      {ticker:"GOOG",  name:"Alphabet Cl. C",       pct:5.37, cur:"USD",sector:"Comm. Services",geo:"United States"},
      {ticker:"MU",    name:"Micron Technology",    pct:3.49, cur:"USD",sector:"Technology",    geo:"United States"},
      {ticker:"WDC",   name:"Western Digital",      pct:2.98, cur:"USD",sector:"Technology",    geo:"United States"},
      {ticker:"APP",   name:"AppLovin Corp",        pct:2.97, cur:"USD",sector:"Technology",    geo:"United States"},
      {ticker:"AEM.TO",name:"Agnico Eagle Mines",   pct:2.53, cur:"CAD",sector:"Materials",     geo:"Canada"},
      {ticker:"RBLX",  name:"Roblox Corp",          pct:2.34, cur:"USD",sector:"Comm. Services",geo:"United States"},
    ]},
  DYN2784:  { name:"Dynamic Global Growth Opps SR F",      color:"#0891b2", asAt:"Oct 31 2025", totalHoldings:30,  currency:"CAD",
    holdings:[
      {ticker:"NVDA", name:"Nvidia",              pct:7.6, cur:"USD",sector:"Technology",  geo:"United States"},
      {ticker:"SNOW", name:"Snowflake Inc.",       pct:5.7, cur:"USD",sector:"Technology",  geo:"United States"},
      {ticker:"NET",  name:"Cloudflare Inc.",      pct:5.5, cur:"USD",sector:"Technology",  geo:"United States"},
      {ticker:"FROG", name:"JFrog Ltd",            pct:5.1, cur:"USD",sector:"Technology",  geo:"Israel"},
      {ticker:"INSM", name:"Insmed Inc.",          pct:4.9, cur:"USD",sector:"Health Care", geo:"United States"},
      {ticker:"LITE", name:"Lumentum Holdings",    pct:4.0, cur:"USD",sector:"Technology",  geo:"United States"},
      {ticker:"MKSI", name:"MKS Instruments",      pct:3.9, cur:"USD",sector:"Technology",  geo:"United States"},
      {ticker:"APP",  name:"AppLovin Corp",        pct:3.9, cur:"USD",sector:"Technology",  geo:"United States"},
      {ticker:"CRWD", name:"CrowdStrike Holdings", pct:3.8, cur:"USD",sector:"Technology",  geo:"United States"},
    ]},
  FID5494:  { name:"Fidelity Insights Class SR F",          color:"#d97706", asAt:"Feb 28 2025", totalHoldings:331, currency:"CAD",
    holdings:[
      {ticker:"META",  name:"Meta Platforms",     pct:12.44,cur:"USD",sector:"Comm. Services",geo:"United States"},
      {ticker:"NVDA",  name:"Nvidia",             pct:7.87, cur:"USD",sector:"Technology",    geo:"United States"},
      {ticker:"BRK-B", name:"Berkshire Hathaway", pct:6.20, cur:"USD",sector:"Financials",    geo:"United States"},
      {ticker:"AMZN",  name:"Amazon.com",         pct:5.29, cur:"USD",sector:"Consumer Disc.",geo:"United States"},
      {ticker:"GOOGL", name:"Alphabet",           pct:3.60, cur:"USD",sector:"Comm. Services",geo:"United States"},
      {ticker:"AAPL",  name:"Apple Inc",          pct:3.54, cur:"USD",sector:"Technology",    geo:"United States"},
      {ticker:"MSFT",  name:"Microsoft",          pct:3.41, cur:"USD",sector:"Technology",    geo:"United States"},
      {ticker:"LLY",   name:"Eli Lilly",          pct:3.13, cur:"USD",sector:"Health Care",   geo:"United States"},
      {ticker:"NFLX",  name:"Netflix",            pct:2.83, cur:"USD",sector:"Comm. Services",geo:"United States"},
    ]},
  CIG11006: { name:"CI Global Leaders Fund CL F",           color:"#dc2626", asAt:"Mar 31 2026", totalHoldings:15,  currency:"CAD",
    holdings:[
      {ticker:"KRYAY",name:"Kerry Group PLC",      pct:6.13,cur:"USD",sector:"Consumer Staples",geo:"Ireland"},
      {ticker:"CNVVY",name:"ConvaTec Group PLC",   pct:5.99,cur:"USD",sector:"Health Care",     geo:"United Kingdom"},
      {ticker:"BVVBY",name:"Bureau Veritas SA",    pct:5.72,cur:"USD",sector:"Industrials",     geo:"France"},
      {ticker:"KHNGY",name:"Kuehne+Nagel Intl AG", pct:5.68,cur:"USD",sector:"Industrials",     geo:"Switzerland"},
      {ticker:"MSUXF",name:"Misumi Group Inc",     pct:5.21,cur:"USD",sector:"Industrials",     geo:"Japan"},
      {ticker:"ELAN", name:"Elanco Animal Health", pct:5.13,cur:"USD",sector:"Health Care",     geo:"United States"},
      {ticker:"BAH",  name:"Booz Allen Hamilton",  pct:4.39,cur:"USD",sector:"Industrials",     geo:"United States"},
      {ticker:"FCN",  name:"FTI Consulting",       pct:4.27,cur:"USD",sector:"Industrials",     geo:"United States"},
      {ticker:"MRAAY",name:"Murata Manufacturing", pct:4.25,cur:"USD",sector:"Technology",      geo:"Japan"},
      {ticker:"GSK",  name:"GSK Plc",              pct:4.18,cur:"USD",sector:"Health Care",     geo:"United Kingdom"},
    ]},
  CIG4574:  { name:"CI Global Leaders Corp Class CL F",     color:"#ea580c", asAt:"Feb 28 2026", totalHoldings:15,  currency:"CAD",
    holdings:[
      {ticker:"CNVVY",name:"ConvaTec Group PLC",   pct:6.48,cur:"USD",sector:"Health Care",      geo:"United Kingdom"},
      {ticker:"KRYAY",name:"Kerry Group PLC",      pct:6.00,cur:"USD",sector:"Consumer Staples",  geo:"Ireland"},
      {ticker:"BVVBY",name:"Bureau Veritas SA",    pct:5.97,cur:"USD",sector:"Industrials",       geo:"France"},
      {ticker:"MSUXF",name:"Misumi Group Inc",     pct:5.55,cur:"USD",sector:"Industrials",       geo:"Japan"},
      {ticker:"KHNGY",name:"Kuehne+Nagel Intl AG", pct:5.20,cur:"USD",sector:"Industrials",       geo:"Switzerland"},
      {ticker:"ELAN", name:"Elanco Animal Health", pct:5.06,cur:"USD",sector:"Health Care",       geo:"United States"},
      {ticker:"MRAAY",name:"Murata Manufacturing", pct:5.04,cur:"USD",sector:"Technology",        geo:"Japan"},
      {ticker:"GSK",  name:"GSK Plc",              pct:4.96,cur:"USD",sector:"Health Care",       geo:"United Kingdom"},
      {ticker:"NIPNF",name:"NEC Corp",             pct:4.19,cur:"USD",sector:"Technology",        geo:"Japan"},
      {ticker:"BAH",  name:"Booz Allen Hamilton",  pct:4.08,cur:"USD",sector:"Industrials",       geo:"United States"},
    ]},
};
const FUND_SYMBOLS = new Set(Object.keys(FUND_META));

// Tickers that have live prices on Yahoo Finance (stocks/ETFs only — no fund codes)
const PRICE_TICKERS = [
  "AAPL","TSLA","SHOP.TO","BRK-B",
  "AMZN","NVDA","TSM","GOOGL","GOOG","MU","WDC","APP","AEM.TO","RBLX",
  "SNOW","NET","FROG","INSM","LITE","MKSI","CRWD",
  "META","MSFT","LLY","NFLX",
  "KRYAY","CNVVY","BVVBY","KHNGY","MSUXF","ELAN","BAH","FCN","MRAAY","GSK","NIPNF",
  "CADUSD=X"
];

const SECURITY_CATALOGUE = [
  {symbol:"AAPL",    name:"Apple Inc",                         type:"stock", cur:"USD", sector:"Technology",      geo:"United States"},
  {symbol:"TSLA",    name:"Tesla Inc",                         type:"stock", cur:"USD", sector:"Consumer Disc.",  geo:"United States"},
  {symbol:"SHOP.TO", name:"Shopify Inc Cl A",                  type:"stock", cur:"CAD", sector:"Technology",      geo:"Canada"},
  {symbol:"BRK-B",   name:"Berkshire Hathaway CDR",            type:"cdr",   cur:"CAD", sector:"Financials",      geo:"United States"},
  {symbol:"FID5982", name:"Fidelity Global Innovators SR F",   type:"fund",  cur:"CAD", sector:"Technology",      geo:"Multi-National"},
  {symbol:"DYN2784", name:"Dynamic Global Growth Opps SR F",   type:"fund",  cur:"CAD", sector:"Technology",      geo:"United States"},
  {symbol:"FID5494", name:"Fidelity Insights Class SR F",      type:"fund",  cur:"CAD", sector:"Technology",      geo:"United States"},
  {symbol:"CIG11006",name:"CI Global Leaders Fund CL F",       type:"fund",  cur:"CAD", sector:"Industrials",     geo:"International"},
  {symbol:"CIG4574", name:"CI Global Leaders Corp Class CL F", type:"fund",  cur:"CAD", sector:"Industrials",     geo:"International"},
];

const SEED_TRANSACTIONS = [
  {id:"s1",  date:"2026-05-28",type:"Buy", symbol:"AAPL",    name:"Apple Inc",                         qty:31,      price:310.85, amount:9636.35,  account:"RRSP", cur:"USD", notes:"Opening balance"},
  {id:"s2",  date:"2026-05-28",type:"Buy", symbol:"TSLA",    name:"Tesla Inc",                         qty:8,       price:440.36, amount:3522.88,  account:"RRSP", cur:"USD", notes:"Opening balance"},
  {id:"s3",  date:"2026-05-28",type:"Buy", symbol:"SHOP.TO", name:"Shopify Inc Cl A",                  qty:10,      price:147.47, amount:1474.70,  account:"RRSP", cur:"CAD", notes:"Opening balance"},
  {id:"s4",  date:"2026-05-28",type:"Buy", symbol:"BRK-B",   name:"Berkshire Hathaway CDR",            qty:579,     price:34.95,  amount:20236.05, account:"TFSA", cur:"CAD", notes:"Opening balance"},
  {id:"s5",  date:"2026-05-28",type:"Buy", symbol:"FID5982", name:"Fidelity Global Innovators SR F",   qty:875.09,  price:68.60,  amount:60026.89, account:"RRSP", cur:"CAD", notes:"Opening balance"},
  {id:"s6",  date:"2026-05-28",type:"Buy", symbol:"DYN2784", name:"Dynamic Global Growth Opps SR F",   qty:2542.66, price:18.53,  amount:47118.11, account:"TFSA", cur:"CAD", notes:"Opening balance"},
  {id:"s7",  date:"2026-05-28",type:"Buy", symbol:"FID5494", name:"Fidelity Insights Class SR F",      qty:690.36,  price:44.75,  amount:30890.24, account:"RRSP", cur:"CAD", notes:"Opening balance"},
  {id:"s8",  date:"2026-05-28",type:"Buy", symbol:"CIG11006",name:"CI Global Leaders Fund CL F",       qty:759.84,  price:18.44,  amount:14010.42, account:"TFSA", cur:"CAD", notes:"Opening balance"},
  {id:"s9",  date:"2026-05-28",type:"Buy", symbol:"CIG4574", name:"CI Global Leaders Corp Class CL F", qty:9.20,    price:36.56,  amount:336.32,   account:"TFSA", cur:"CAD", notes:"Opening balance"},
  {id:"s10", date:"2026-05-28",type:"Cash",symbol:"CASH",    name:"Cash",                              qty:1,       price:171.22, amount:171.22,   account:"CASH", cur:"CAD", notes:"Opening cash balance"},
];

const ACCOUNT_TYPES = ["RRSP","TFSA","CASH","Non-Registered","RESP","FHSA","Prianka RRSP"];
const TX_TYPES = ["Buy","Sell","Dividend","Reinvested Dividend","RRSP Contribution","TFSA Contribution","RESP Contribution","Management Fee","Portfolio Manager Tax (HST)","Split","Transfer In","Transfer Out","Cash Deposit","Cash Withdrawal","Interest"];
const TX_META = {
  "Buy":                        {affectsQty:true,  cashSign:-1, color:"#10b981", icon:"↑"},
  "Sell":                       {affectsQty:true,  cashSign:+1, color:"#ef4444", icon:"↓"},
  "Dividend":                   {affectsQty:false, cashSign:+1, color:"#6366f1", icon:"$"},
  "Reinvested Dividend":        {affectsQty:true,  cashSign:0,  color:"#8b5cf6", icon:"↺"},
  "RRSP Contribution":          {affectsQty:false, cashSign:+1, color:"#0891b2", icon:"⊕"},
  "TFSA Contribution":          {affectsQty:false, cashSign:+1, color:"#0891b2", icon:"⊕"},
  "RESP Contribution":          {affectsQty:false, cashSign:+1, color:"#0891b2", icon:"⊕"},
  "Management Fee":             {affectsQty:false, cashSign:-1, color:"#f59e0b", icon:"−"},
  "Portfolio Manager Tax (HST)":{affectsQty:false, cashSign:-1, color:"#f97316", icon:"−"},
  "Split":                      {affectsQty:true,  cashSign:0,  color:"#14b8a6", icon:"✕"},
  "Transfer In":                {affectsQty:true,  cashSign:0,  color:"#10b981", icon:"→"},
  "Transfer Out":               {affectsQty:true,  cashSign:0,  color:"#ef4444", icon:"←"},
  "Cash Deposit":               {affectsQty:false, cashSign:+1, color:"#10b981", icon:"⊕"},
  "Cash Withdrawal":            {affectsQty:false, cashSign:-1, color:"#ef4444", icon:"⊖"},
  "Interest":                   {affectsQty:false, cashSign:+1, color:"#6366f1", icon:"$"},
  "Cash":                       {affectsQty:false, cashSign:+1, color:"#94a3b8", icon:"·"},
};

const DEFAULT_USDCAD = 1.363;
const SECTOR_COLORS = {"Technology":"#6366f1","Comm. Services":"#8b5cf6","Consumer Disc.":"#f59e0b","Health Care":"#10b981","Financials":"#3b82f6","Industrials":"#ef4444","Materials":"#f97316","Consumer Staples":"#14b8a6","Energy":"#84cc16","Real Estate":"#ec4899"};
const GEO_COLORS    = {"United States":"#3b82f6","Canada":"#ef4444","Taiwan":"#10b981","Japan":"#f59e0b","United Kingdom":"#8b5cf6","France":"#f97316","Switzerland":"#14b8a6","Ireland":"#84cc16","Israel":"#ec4899","Multi-National":"#94a3b8","International":"#6b7280","Other":"#6b7280"};

const THEMES = {
  light:{bg:"#f4f6fa",surface:"#ffffff",surfaceAlt:"#f0f2f7",border:"rgba(0,0,0,0.08)",borderMed:"rgba(0,0,0,0.14)",text:"#0f172a",textSub:"#475569",textMuted:"#94a3b8",accent:"#4f46e5",accentBg:"rgba(79,70,229,0.08)",accentText:"#4f46e5",rowHover:"rgba(0,0,0,0.025)",statBg:"#eef0f7",tabActive:"#4f46e5",tabActiveBg:"rgba(79,70,229,0.1)",tabActiveBdr:"rgba(79,70,229,0.35)",tabInactive:"#64748b",footerBg:"rgba(0,0,0,0.03)",scrollbar:"#d1d5db",pieBorder:"#f4f6fa",upColor:"#059669",downColor:"#dc2626",upBg:"rgba(5,150,105,0.1)",downBg:"rgba(220,38,38,0.1)",loading:"#94a3b8",inputBg:"#ffffff",inputBorder:"rgba(0,0,0,0.15)",danger:"#dc2626",dangerBg:"rgba(220,38,38,0.08)"},
  dark: {bg:"#080d1a",surface:"rgba(255,255,255,0.03)",surfaceAlt:"rgba(255,255,255,0.02)",border:"rgba(255,255,255,0.07)",borderMed:"rgba(255,255,255,0.13)",text:"#f1f5f9",textSub:"#94a3b8",textMuted:"#475569",accent:"#6366f1",accentBg:"rgba(99,102,241,0.15)",accentText:"#a5b4fc",rowHover:"rgba(255,255,255,0.025)",statBg:"rgba(255,255,255,0.04)",tabActive:"#a5b4fc",tabActiveBg:"rgba(99,102,241,0.15)",tabActiveBdr:"rgba(99,102,241,0.5)",tabInactive:"#4b5563",footerBg:"rgba(255,255,255,0.015)",scrollbar:"#1e293b",pieBorder:"#080d1a",upColor:"#10b981",downColor:"#ef4444",upBg:"rgba(16,185,129,0.1)",downBg:"rgba(239,68,68,0.1)",loading:"#374151",inputBg:"rgba(255,255,255,0.06)",inputBorder:"rgba(255,255,255,0.15)",danger:"#f87171",dangerBg:"rgba(248,113,113,0.08)"},
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fCAD  = n => n==null ? "—" : `CA$${Number(n).toLocaleString("en-CA",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fNum  = (n,d=2) => n==null ? "—" : Number(n).toLocaleString("en-CA",{minimumFractionDigits:d,maximumFractionDigits:d});
const toCAD = (price, cur, rate) => price==null ? null : (cur==="USD"||cur==="EUR"||cur==="GBP"||cur==="CHF") ? price*rate : price;
const uid   = () => Math.random().toString(36).slice(2,10);
const today = () => new Date().toISOString().slice(0,10);

// ─── Price fetcher — routes through CORS proxy to reach Yahoo Finance ─────────
async function fetchPrice(ticker) {
  // Yahoo Finance blocks direct browser requests (CORS). Route through corsproxy.io.
  const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`;
  const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(yfUrl)}`;
  try {
    const r = await fetch(proxyUrl);
    if (!r.ok) return null;
    const data = await r.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta || !meta.regularMarketPrice) return null;
    const closes = (data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || []).filter(v => v != null);
    const prevClose = closes.length >= 2 ? closes[closes.length-2] : (meta.previousClose || meta.chartPreviousClose || meta.regularMarketPrice);
    const price = meta.regularMarketPrice;
    const change = price - prevClose;
    return {
      price,
      prevClose,
      change,
      changePct: prevClose > 0 ? (change / prevClose) * 100 : 0,
      currency: meta.currency || "USD",
      marketState: meta.marketState || "CLOSED",
    };
  } catch { return null; }
}

// ─── Derive holdings from transaction ledger ──────────────────────────────────
function deriveHoldings(transactions) {
  const map = {};
  const sorted = [...transactions].sort((a,b) => a.date.localeCompare(b.date));
  sorted.forEach(tx => {
    if (!tx.symbol || tx.symbol === "CASH") return;
    const meta = TX_META[tx.type] || { affectsQty:false, cashSign:0 };
    if (!meta.affectsQty) return;
    const key = `${tx.symbol}::${tx.account}`;
    if (!map[key]) {
      const cat = SECURITY_CATALOGUE.find(s => s.symbol === tx.symbol) || {};
      const fm  = FUND_META[tx.symbol] || {};
      map[key] = {
        symbol:    tx.symbol,
        name:      tx.name || cat.name || tx.symbol,
        qty:       0,
        totalCost: 0,
        account:   tx.account,
        cur:       tx.cur || cat.cur || "CAD",
        type:      cat.type || "fund",
        sector:    cat.sector || fm.sector || "—",
        geo:       cat.geo || fm.geo || "—",
      };
    }
    const h = map[key];
    if (tx.type === "Split") {
      h.qty += (tx.qty || 0);
    } else if (tx.type === "Sell" || tx.type === "Transfer Out") {
      const avgCost = h.qty > 0 ? h.totalCost / h.qty : 0;
      h.qty = Math.max(0, h.qty - (tx.qty || 0));
      h.totalCost = h.qty * avgCost;
    } else {
      h.qty       += (tx.qty || 0);
      h.totalCost += Math.abs(tx.amount || 0);
    }
  });
  return Object.values(map).filter(h => h.qty > 0.0001);
}

function deriveCash(transactions) {
  return transactions.reduce((sum, tx) => {
    const meta = TX_META[tx.type] || { cashSign:0 };
    return sum + (meta.cashSign * Math.abs(tx.amount || 0));
  }, 0);
}

// ─── Build consolidated 30 positions ─────────────────────────────────────────
// Merges direct stock holdings INTO the same row as fund holdings for the same ticker.
// e.g. AAPL direct + AAPL inside FID5494 → one row showing combined value.
function buildConsolidated(holdings, prices, usdCad) {
  const map = {};
  const add = (key, name, val, src, sector, geo, ticker) => {
    if (!map[key]) map[key] = { name, val:0, sources:[], sector, geo, ticker };
    map[key].val += val;
    if (!map[key].sources.includes(src)) map[key].sources.push(src);
  };

  // First pass: fund holdings (use last-known NAV × units for fund value)
  holdings.forEach(h => {
    if (!FUND_SYMBOLS.has(h.symbol)) return;
    const fm = FUND_META[h.symbol];
    // Fund value: try live NAV price, fall back to avg cost (prev-day NAV × units)
    const pd = prices[h.symbol]; // funds won't have prices — pd will be null
    const navPerUnit = pd ? toCAD(pd.price, pd.currency || "CAD", usdCad) : (h.qty > 0 ? h.totalCost / h.qty : 0);
    const posVal = h.qty * navPerUnit;
    fm.holdings.forEach(fh => {
      add(fh.ticker, fh.name, (fh.pct / 100) * posVal, h.symbol, fh.sector, fh.geo, fh.ticker);
    });
  });

  // Second pass: direct stock holdings — merge into existing fund key if it exists, else create new
  holdings.forEach(h => {
    if (FUND_SYMBOLS.has(h.symbol)) return;
    const pd = prices[h.symbol];
    // Use live price if available, else avg cost (in native currency)
    const nativePricePerShare = pd ? pd.price : (h.qty > 0 ? h.totalCost / h.qty : 0);
    const nativeCur = pd ? (pd.currency || h.cur) : h.cur;
    const valCAD = h.qty * toCAD(nativePricePerShare, nativeCur, usdCad);

    if (map[h.symbol]) {
      // ticker already exists from fund holdings — merge in
      map[h.symbol].val += valCAD;
      if (!map[h.symbol].sources.includes("Direct")) map[h.symbol].sources.push("Direct");
    } else {
      add(h.symbol, h.name, valCAD, "Direct", h.sector, h.geo, h.symbol);
    }
  });

  return Object.entries(map).sort((a,b) => b[1].val - a[1].val).slice(0, 30);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ChangeChip({ pct, t }) {
  if (pct == null) return <span style={{color:t.textMuted,fontSize:11}}>—</span>;
  const up = pct >= 0;
  return <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,background:up?t.upBg:t.downBg,color:up?t.upColor:t.downColor,whiteSpace:"nowrap"}}>{up?"▲":"▼"} {Math.abs(pct).toFixed(2)}%</span>;
}

function StatCard({ label, val, sub, accent, t }) {
  return (
    <div style={{flex:1,minWidth:130,background:t.statBg,borderRadius:10,padding:"12px 16px",border:`1px solid ${t.border}`}}>
      <div style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>{label}</div>
      <div style={{fontSize:17,fontWeight:700,color:accent||t.text,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"-0.5px"}}>{val}</div>
      <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{sub}</div>
    </div>
  );
}

function PieChart({ data, colorMap, pieBorder, size=130 }) {
  const total = data.reduce((s,d) => s+d.val, 0);
  if (!total) return null;
  let cum = 0;
  const slices = data.map(d => { const p=d.val/total, s=cum; cum+=p; return {...d,pct:p,start:s}; });
  const cx=size/2, cy=size/2, r=size/2-5;
  const arc = (s,e) => {
    const a0=(s*2*Math.PI)-Math.PI/2, a1=(e*2*Math.PI)-Math.PI/2;
    return `M${cx},${cy} L${cx+r*Math.cos(a0)},${cy+r*Math.sin(a0)} A${r},${r} 0 ${e-s>0.5?1:0},1 ${cx+r*Math.cos(a1)},${cy+r*Math.sin(a1)} Z`;
  };
  return <svg width={size} height={size} style={{flexShrink:0}}>{slices.map((s,i)=><path key={i} d={arc(s.start,s.start+s.pct)} fill={colorMap[s.label]||"#94a3b8"} stroke={pieBorder} strokeWidth={1.5}/>)}</svg>;
}

// ─── Transaction Form ─────────────────────────────────────────────────────────
function TxForm({ t, onAdd, editTx, onSave, onCancel }) {
  const blank = { date:today(), type:"Buy", symbol:"", name:"", qty:"", price:"", amount:"", account:"RRSP", cur:"CAD", notes:"" };
  const [form, setForm] = useState(editTx || blank);
  const [query, setQuery] = useState(editTx?.symbol || "");
  const [showSug, setShowSug] = useState(false);

  useEffect(() => { if (editTx) { setForm(editTx); setQuery(editTx.symbol || ""); } }, [editTx?.id]);

  const set = (k, v) => setForm(f => ({...f, [k]:v}));
  const sugs = query.length > 0
    ? SECURITY_CATALOGUE.filter(s => s.symbol.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase())).slice(0,6)
    : [];

  const pickSec = s => { setForm(f => ({...f, symbol:s.symbol, name:s.name, cur:s.cur})); setQuery(s.symbol); setShowSug(false); };

  const submit = () => {
    if (!form.date || !form.type || !form.symbol) return;
    const tx = { ...form, id: editTx?.id || uid(), qty:parseFloat(form.qty)||0, price:parseFloat(form.price)||0, amount:parseFloat(form.amount)||0 };
    editTx ? onSave(tx) : onAdd(tx);
    if (!editTx) { setForm(blank); setQuery(""); }
  };

  const inp = { style:{background:t.inputBg,border:`1px solid ${t.inputBorder}`,borderRadius:6,padding:"7px 10px",color:t.text,fontSize:12,width:"100%",outline:"none"} };
  const needsQty  = TX_META[form.type]?.affectsQty;
  const isInflow  = ["RRSP Contribution","TFSA Contribution","RESP Contribution","Cash Deposit","Interest","Cash"].includes(form.type);
  const isOutflow = ["Management Fee","Portfolio Manager Tax (HST)","Cash Withdrawal"].includes(form.type);

  return (
    <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,padding:20,marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:14}}>{editTx ? "Edit Transaction" : "Add Transaction"}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10}}>
        <div>
          <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>Date</label>
          <input type="date" value={form.date} onChange={e=>set("date",e.target.value)} {...inp}/>
        </div>
        <div>
          <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>Type</label>
          <select value={form.type} onChange={e=>set("type",e.target.value)} {...inp}>
            {TX_TYPES.map(tt=><option key={tt} value={tt}>{tt}</option>)}
          </select>
        </div>
        <div style={{position:"relative"}}>
          <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>Symbol</label>
          <input value={query} onChange={e=>{setQuery(e.target.value);set("symbol",e.target.value);setShowSug(true);}} onFocus={()=>setShowSug(true)} onBlur={()=>setTimeout(()=>setShowSug(false),180)} placeholder="e.g. AAPL, FID5982" {...inp}/>
          {showSug && sugs.length > 0 && (
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:t.surface,border:`1px solid ${t.borderMed}`,borderRadius:8,zIndex:200,marginTop:2,boxShadow:"0 4px 16px rgba(0,0,0,0.15)"}}>
              {sugs.map(s=>(
                <div key={s.symbol} onMouseDown={()=>pickSec(s)} style={{padding:"8px 12px",cursor:"pointer",fontSize:12,borderBottom:`1px solid ${t.border}`}}
                  onMouseEnter={e=>e.currentTarget.style.background=t.rowHover} onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <strong style={{color:t.text,fontFamily:"'JetBrains Mono',monospace"}}>{s.symbol}</strong>
                  <span style={{color:t.textSub,marginLeft:8}}>{s.name}</span>
                  <span style={{float:"right",fontSize:10,color:t.textMuted,background:t.statBg,padding:"1px 6px",borderRadius:4}}>{s.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>Security Name</label>
          <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Name" {...inp}/>
        </div>
        <div>
          <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>Account</label>
          <select value={form.account} onChange={e=>set("account",e.target.value)} {...inp}>
            {ACCOUNT_TYPES.map(a=><option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>Currency</label>
          <select value={form.cur} onChange={e=>set("cur",e.target.value)} {...inp}>
            {["CAD","USD","EUR","GBP","CHF"].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {needsQty && (
          <div>
            <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>{form.type==="Split"?"Shares Added":"Qty / Units"}</label>
            <input type="number" value={form.qty} onChange={e=>{set("qty",e.target.value);if(form.price)set("amount",(parseFloat(e.target.value)||0)*(parseFloat(form.price)||0));}} placeholder="0.0000" step="any" {...inp}/>
          </div>
        )}
        {needsQty && !isInflow && (
          <div>
            <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>Price per unit</label>
            <input type="number" value={form.price} onChange={e=>{set("price",e.target.value);if(form.qty)set("amount",(parseFloat(e.target.value)||0)*(parseFloat(form.qty)||0));}} placeholder="0.00" step="any" {...inp}/>
          </div>
        )}
        <div>
          <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>{isInflow?"Amount (CAD)":isOutflow?"Fee Amount (CAD)":"Total Amount (CAD)"}</label>
          <input type="number" value={form.amount} onChange={e=>set("amount",e.target.value)} placeholder="0.00" step="any" {...inp}/>
        </div>
        <div style={{gridColumn:"span 2"}}>
          <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4}}>Notes (optional)</label>
          <input value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Optional note" {...inp}/>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:14,justifyContent:"flex-end"}}>
        {editTx && <button onClick={onCancel} style={{padding:"8px 16px",borderRadius:7,border:`1px solid ${t.borderMed}`,background:"transparent",color:t.textSub,cursor:"pointer",fontSize:12}}>Cancel</button>}
        <button onClick={submit} style={{padding:"8px 20px",borderRadius:7,border:"none",background:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>
          {editTx ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dark, setDark]                 = useState(false);
  const t = THEMES[dark ? "dark" : "light"];

  const [transactions, setTransactions] = useState(() => {
    try { const s = localStorage.getItem("ptx_v2"); return s ? JSON.parse(s) : SEED_TRANSACTIONS; } catch { return SEED_TRANSACTIONS; }
  });
  const [prices, setPrices]             = useState({});
  const [priceStatus, setPriceStatus]   = useState({}); // ticker -> "ok"|"error"|"loading"
  const [loading, setLoading]           = useState(true);
  const [lastUpdated, setLastUpdated]   = useState(null);
  const [usdCad, setUsdCad]             = useState(DEFAULT_USDCAD);
  const [tab, setTab]                   = useState("consolidated");
  const [expandedFund, setExpandedFund] = useState(null);
  const [editTx, setEditTx]             = useState(null);
  const [delConfirm, setDelConfirm]     = useState(null);
  const [txFilter, setTxFilter]         = useState({type:"",account:"",symbol:"",from:"",to:""});
  const [txSort, setTxSort]             = useState({col:"date",dir:"desc"});

  useEffect(() => { try { localStorage.setItem("ptx_v2", JSON.stringify(transactions)); } catch {} }, [transactions]);

  const holdings = deriveHoldings(transactions);
  const cash     = Math.max(0, deriveCash(transactions));

  // Separate fund vs direct for accurate valuation
  const fundHoldings   = holdings.filter(h => FUND_SYMBOLS.has(h.symbol));
  const directHoldings = holdings.filter(h => !FUND_SYMBOLS.has(h.symbol));

  // Fund value: prev-day NAV × units (cost basis when no live price)
  const fundValCAD = fundHoldings.reduce((s, h) => {
    const pd = prices[h.symbol]; // will be null — funds not on Yahoo Finance
    const nav = pd ? toCAD(pd.price, pd.currency || "CAD", usdCad) : (h.qty > 0 ? h.totalCost / h.qty : 0);
    return s + h.qty * nav;
  }, 0);

  // Direct stock value: live price in CAD
  const directValCAD = directHoldings.reduce((s, h) => {
    const pd = prices[h.symbol];
    if (!pd) {
      // Fall back to cost basis converted to CAD
      return s + (h.qty > 0 ? toCAD(h.totalCost / h.qty, h.cur, usdCad) * h.qty : 0);
    }
    return s + h.qty * toCAD(pd.price, pd.currency || h.cur, usdCad);
  }, 0);

  const totalPortCAD = fundValCAD + directValCAD + cash;

  // Refresh prices — only fetch priceable tickers (stocks, not fund codes)
  const refresh = useCallback(async () => {
    setLoading(true);
    const statusMap = {};
    PRICE_TICKERS.forEach(tk => { statusMap[tk] = "loading"; });
    setPriceStatus({...statusMap});

    const results = {};
    await Promise.all(PRICE_TICKERS.map(async tk => {
      const d = await fetchPrice(tk);
      if (d) { results[tk] = d; statusMap[tk] = "ok"; }
      else   { statusMap[tk] = "error"; }
    }));

    // USD/CAD rate
    if (results["CADUSD=X"]?.price) setUsdCad(1 / results["CADUSD=X"].price);

    setPrices(results);
    setPriceStatus({...statusMap});
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const consolidated = buildConsolidated(holdings, prices, usdCad);
  const conTot = consolidated.reduce((s,[,d]) => s+d.val, 0);

  const sectorMap = {}, geoMap = {};
  consolidated.forEach(([,d]) => {
    sectorMap[d.sector] = (sectorMap[d.sector]||0) + d.val;
    geoMap[d.geo||"Other"] = (geoMap[d.geo||"Other"]||0) + d.val;
  });
  const sectorData = Object.entries(sectorMap).sort((a,b)=>b[1]-a[1]).map(([label,val])=>({label,val}));
  const geoData    = Object.entries(geoMap).sort((a,b)=>b[1]-a[1]).map(([label,val])=>({label,val}));

  const addTx  = tx => setTransactions(p => [...p, {...tx,id:uid()}]);
  const saveTx = tx => setTransactions(p => p.map(x => x.id===tx.id ? tx : x));
  const delTx  = id => { setTransactions(p => p.filter(x => x.id!==id)); setDelConfirm(null); };

  const totalContribs = transactions.filter(x=>x.type?.includes("Contribution")||x.type==="Cash Deposit").reduce((s,x)=>s+Math.abs(x.amount||0),0);
  const totalFees     = transactions.filter(x=>x.type?.includes("Fee")||x.type?.includes("Tax")).reduce((s,x)=>s+Math.abs(x.amount||0),0);
  const totalDivs     = transactions.filter(x=>x.type==="Dividend"||x.type==="Interest").reduce((s,x)=>s+Math.abs(x.amount||0),0);

  const filteredTxs = transactions
    .filter(x => {
      if (txFilter.type    && x.type !== txFilter.type) return false;
      if (txFilter.account && x.account !== txFilter.account) return false;
      if (txFilter.symbol  && !x.symbol?.toLowerCase().includes(txFilter.symbol.toLowerCase())) return false;
      if (txFilter.from    && x.date < txFilter.from) return false;
      if (txFilter.to      && x.date > txFilter.to) return false;
      return true;
    })
    .sort((a,b) => {
      const dir = txSort.dir === "asc" ? 1 : -1;
      return (a[txSort.col]??"")<(b[txSort.col]??"") ? -dir : (a[txSort.col]??"")>(b[txSort.col]??"") ? dir : 0;
    });

  // Loaded price count for status display
  const pricesLoaded = Object.values(priceStatus).filter(s=>s==="ok").length;
  const pricesTotal  = PRICE_TICKERS.filter(t=>t!=="CADUSD=X").length;

  const thS = r => ({padding:"8px 12px",textAlign:r?"right":"left",color:t.textMuted,fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.5px",whiteSpace:"nowrap",background:t.surfaceAlt,borderBottom:`1px solid ${t.border}`});
  const tdS = (r, mono) => ({padding:"8px 12px",textAlign:r?"right":"left",color:t.textSub,fontSize:12,fontFamily:mono?"'JetBrains Mono',monospace":"inherit",borderBottom:`1px solid ${t.border}`});
  const TABS = [{key:"consolidated",label:"Top 30"},{key:"breakdown",label:"Sector & Geo"},{key:"funds",label:"Funds"},{key:"direct",label:"Direct Stocks"},{key:"transactions",label:"Transactions"}];

  return (
    <div style={{background:t.bg,minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:t.text,padding:"20px 24px",transition:"background 0.2s,color 0.2s"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:${t.scrollbar};border-radius:4px}select,input{color-scheme:${dark?"dark":"light"}}`}</style>

      {/* ── Header ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
        <div>
          <div style={{fontSize:10,color:t.accent,textTransform:"uppercase",letterSpacing:"2px",fontWeight:600,marginBottom:5}}>Portfolio Intelligence</div>
          <h1 style={{margin:0,fontSize:24,fontWeight:700,color:t.text,letterSpacing:"-0.5px"}}>Holdings Dashboard</h1>
          <div style={{fontSize:11,color:t.textMuted,marginTop:4}}>
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString("en-CA")} · ${pricesLoaded}/${pricesTotal} prices loaded · USD/CAD ${usdCad.toFixed(4)}`
              : "Loading live prices…"}
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setDark(d=>!d)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:`1px solid ${t.borderMed}`,background:t.surface,color:t.textSub,cursor:"pointer",fontSize:12,fontWeight:500,transition:"all 0.15s"}}>
            <span>{dark?"☀️":"🌙"}</span>{dark?"Light":"Dark"}
          </button>
          <button onClick={refresh} disabled={loading} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${t.borderMed}`,background:loading?t.surfaceAlt:t.accentBg,color:loading?t.textMuted:t.accentText,cursor:loading?"not-allowed":"pointer",fontSize:12,fontWeight:600,transition:"all 0.15s"}}>
            {loading ? `⟳ Loading… (${pricesLoaded}/${pricesTotal})` : "⟳ Refresh Live Prices"}
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10}}>
        <StatCard label="Total Portfolio (CA$)"  val={fCAD(totalPortCAD)}   sub="funds prev-day · stocks live"  accent={t.accent}   t={t}/>
        <StatCard label="Mutual Funds (CA$)"      val={fCAD(fundValCAD)}    sub="prev-day NAV × units"           t={t}/>
        <StatCard label="Direct Stocks (CA$)"     val={fCAD(directValCAD)}  sub="live real-time prices"          accent="#059669"    t={t}/>
        <StatCard label="Cash (CA$)"              val={fCAD(cash)}           sub="all accounts"                  t={t}/>
        <StatCard label="Dividends (CA$)"         val={fCAD(totalDivs)}     sub="received"                       accent="#6366f1"    t={t}/>
        <StatCard label="USD/CAD Rate"            val={usdCad.toFixed(4)}    sub="live"                          accent="#0891b2"    t={t}/>
      </div>
      <div style={{marginBottom:18,padding:"8px 14px",background:t.statBg,borderRadius:8,border:`1px solid ${t.border}`,fontSize:11,color:t.textSub,lineHeight:1.6}}>
        <strong>📊 Mutual funds</strong> — NAV settles once daily after 4 pm ET; value = prev-day close × units.&nbsp;&nbsp;
        <strong>⚡ Direct stocks</strong> (AAPL, TSLA, SHOP, BRK-B) — live, refresh every 5 min.&nbsp;&nbsp;
        <strong>💱 All values</strong> in Canadian dollars (CA$). USD prices converted at live USD/CAD rate.
      </div>

      {/* ── Tabs ── */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
        {TABS.map(tb=>(
          <button key={tb.key} onClick={()=>setTab(tb.key)} style={{padding:"7px 16px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:tab===tb.key?600:400,border:`1px solid ${tab===tb.key?t.tabActiveBdr:t.border}`,background:tab===tb.key?t.tabActiveBg:"transparent",color:tab===tb.key?t.tabActive:t.tabInactive,transition:"all 0.15s"}}>
            {tb.label}{tb.key==="transactions"?<span style={{marginLeft:6,fontSize:10,background:t.accentBg,color:t.accentText,padding:"1px 6px",borderRadius:8}}>{transactions.length}</span>:""}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          TOP 30 CONSOLIDATED
      ══════════════════════════════════════════════════════ */}
      {tab==="consolidated" && (
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden"}}>
          <div style={{padding:"11px 16px",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:t.surfaceAlt}}>
            <div style={{fontSize:13,fontWeight:600,color:t.text}}>Top 30 Consolidated Positions</div>
            <div style={{fontSize:11,color:t.textMuted}}>Direct holdings merged with fund holdings · all values CA$ · covers 97%+ of mapped portfolio</div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr>{["#","Company","Ticker","Sector","Geography","Sources","Live Price (CA$)","Prev Close (CA$)","Day Chg","Consolidated Value (CA$)","% of Portfolio"].map((h,i)=><th key={i} style={thS(i>=6)}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {consolidated.map(([key,d],i) => {
                  const pd  = prices[d.ticker];
                  const pc  = pd ? toCAD(pd.price, pd.currency||"USD", usdCad) : null;
                  const pv  = pd ? toCAD(pd.prevClose, pd.currency||"USD", usdCad) : null;
                  const pct = (d.val / totalPortCAD * 100).toFixed(2);
                  const bw  = (d.val / consolidated[0][1].val * 100).toFixed(0);
                  const sc  = SECTOR_COLORS[d.sector] || "#94a3b8";
                  const gc  = GEO_COLORS[d.geo] || "#94a3b8";
                  const hasDirect = d.sources.includes("Direct");
                  return (
                    <tr key={key} onMouseEnter={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background=t.rowHover)} onMouseLeave={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background="")}>
                      <td style={{...tdS(false),color:t.textMuted,fontSize:11,width:26}}>{i+1}</td>
                      <td style={tdS(false)}>
                        <div style={{fontWeight:600,color:t.text}}>{d.name}</div>
                        <div style={{marginTop:3,height:3,width:`${bw}%`,background:sc,borderRadius:2,minWidth:4,opacity:0.7}}/>
                      </td>
                      <td style={{...tdS(false,true),color:t.textMuted,fontSize:11}}>{d.ticker}</td>
                      <td style={tdS(false)}><span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:`${sc}22`,color:sc,fontWeight:500}}>{d.sector}</span></td>
                      <td style={tdS(false)}><span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:`${gc}18`,color:gc,fontWeight:500}}>{d.geo}</span></td>
                      <td style={tdS(false)}>
                        {d.sources.map(s=><span key={s} style={{fontSize:9,padding:"1px 5px",borderRadius:3,marginRight:3,display:"inline-block",background:s==="Direct"?`${t.upColor}18`:t.accentBg,color:s==="Direct"?t.upColor:t.accentText,fontWeight:s==="Direct"?700:400}}>{s}</span>)}
                      </td>
                      <td style={{...tdS(true,true),fontWeight:700,color:t.text,fontSize:13}}>
                        {pc ? <>{fCAD(pc)}{hasDirect&&<span style={{fontSize:9,color:t.upColor,marginLeft:3}}>live</span>}</> : <span style={{color:t.loading,fontSize:11}}>loading…</span>}
                      </td>
                      <td style={{...tdS(true,true),color:t.textSub,fontSize:12}}>{pv ? fCAD(pv) : "—"}</td>
                      <td style={tdS(true)}><ChangeChip pct={pd?.changePct} t={t}/></td>
                      <td style={{...tdS(true,true),fontWeight:700,color:sc,fontSize:13}}>{fCAD(d.val)}</td>
                      <td style={{...tdS(true,true),color:t.textMuted,fontSize:11}}>{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{padding:"8px 16px",background:t.footerBg,borderTop:`1px solid ${t.border}`,fontSize:10,color:t.textMuted}}>
            30 positions shown · direct holdings (AAPL, TSLA, SHOP, BRK-B) merged with same-ticker fund holdings where applicable · ~49% of each fund's holdings are in positions beyond the disclosed top 10
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          SECTOR & GEO
      ══════════════════════════════════════════════════════ */}
      {tab==="breakdown" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>
          {[{title:"By Sector",data:sectorData,cmap:SECTOR_COLORS},{title:"By Geography",data:geoData,cmap:GEO_COLORS}].map(({title,data,cmap})=>(
            <div key={title} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,padding:18}}>
              <div style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:16}}>{title} — Top 30 Positions</div>
              <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:16}}>
                <PieChart data={data} colorMap={cmap} pieBorder={t.pieBorder} size={130}/>
                <div style={{flex:1}}>
                  {data.map(d=>(
                    <div key={d.label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                      <div style={{width:8,height:8,borderRadius:2,background:cmap[d.label]||"#94a3b8",flexShrink:0}}/>
                      <div style={{flex:1,fontSize:12,color:t.textSub}}>{d.label}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:t.textMuted}}>{(d.val/conTot*100).toFixed(1)}%</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:t.textMuted,minWidth:84,textAlign:"right"}}>{fCAD(d.val)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{borderTop:`1px solid ${t.border}`,paddingTop:12}}>
                {data.map(d=>{ const p=d.val/conTot*100; return(
                  <div key={d.label} style={{marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:11,color:t.textSub}}>{d.label}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:t.textMuted}}>{p.toFixed(1)}%</span>
                    </div>
                    <div style={{background:t.statBg,borderRadius:3,height:5,overflow:"hidden"}}>
                      <div style={{width:`${p}%`,height:"100%",background:cmap[d.label]||"#94a3b8",borderRadius:3}}/>
                    </div>
                  </div>
                );})}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          FUNDS
      ══════════════════════════════════════════════════════ */}
      {tab==="funds" && fundHoldings.map(h => {
        const fm  = FUND_META[h.symbol];
        const nav = h.qty > 0 ? h.totalCost / h.qty : 0; // prev-day NAV per unit
        const posVal = h.qty * nav;
        return (
          <div key={`${h.symbol}::${h.account}`} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",marginBottom:12}}>
            <div onClick={()=>setExpandedFund(expandedFund===h.symbol?null:h.symbol)}
              style={{padding:"12px 18px",cursor:"pointer",borderLeft:`3px solid ${fm.color}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:dark?`linear-gradient(90deg,${fm.color}0f 0%,transparent 80%)`:t.surfaceAlt}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:t.text}}>{fm.name}</div>
                <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{h.symbol} · {h.account} · {fNum(h.qty,4)} units · holdings as at {fm.asAt}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:15,fontWeight:700,color:fm.color,fontFamily:"'JetBrains Mono',monospace"}}>{fCAD(posVal)}</div>
                <div style={{fontSize:10,color:t.textMuted}}>prev-day NAV {fCAD(nav)}/unit · {expandedFund===h.symbol?"▲ collapse":"▼ expand"}</div>
              </div>
            </div>
            {expandedFund===h.symbol && (
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr>{["#","Holding","Ticker","Sector","Geography","Fund %","Live Price (CA$)","Prev Close (CA$)","Day Chg","Implied Value (CA$)"].map((h,i)=><th key={i} style={thS(i>=5)}>{h}</th>)}</tr></thead>
                  <tbody>
                    {fm.holdings.map((fh,i) => {
                      const pd  = prices[fh.ticker];
                      const pc  = pd ? toCAD(pd.price, pd.currency||fh.cur, usdCad) : null;
                      const pv  = pd ? toCAD(pd.prevClose, pd.currency||fh.cur, usdCad) : null;
                      const imp = (fh.pct/100)*posVal;
                      return (
                        <tr key={fh.ticker} onMouseEnter={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background=t.rowHover)} onMouseLeave={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background="")}>
                          <td style={{...tdS(false),color:t.textMuted,fontSize:11}}>{i+1}</td>
                          <td style={tdS(false)}><div style={{fontWeight:600,color:t.text}}>{fh.name}</div></td>
                          <td style={{...tdS(false,true),color:t.textMuted,fontSize:11}}>{fh.ticker}</td>
                          <td style={tdS(false)}><span style={{fontSize:10,color:SECTOR_COLORS[fh.sector]||"#94a3b8"}}>{fh.sector}</span></td>
                          <td style={tdS(false)}><span style={{fontSize:10,color:GEO_COLORS[fh.geo]||"#94a3b8"}}>{fh.geo}</span></td>
                          <td style={{...tdS(true),color:t.textSub,fontWeight:600}}>{fh.pct.toFixed(2)}%</td>
                          <td style={{...tdS(true,true),fontWeight:700,color:t.text,fontSize:13}}>
                            {pc ? fCAD(pc) : <span style={{color:t.loading,fontSize:11}}>loading…</span>}
                          </td>
                          <td style={{...tdS(true,true),color:t.textSub,fontSize:12}}>{pv ? fCAD(pv) : "—"}</td>
                          <td style={tdS(true)}><ChangeChip pct={pd?.changePct} t={t}/></td>
                          <td style={{...tdS(true,true),fontWeight:700,color:fm.color,fontSize:13}}>{fCAD(imp)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* ══════════════════════════════════════════════════════
          DIRECT STOCKS
      ══════════════════════════════════════════════════════ */}
      {tab==="direct" && (
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden"}}>
          <div style={{padding:"11px 16px",borderBottom:`1px solid ${t.border}`,background:t.surfaceAlt,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:13,fontWeight:600,color:t.text}}>Direct Holdings</div>
            <div style={{fontSize:11,color:t.textMuted}}>Live prices · all values in CA$</div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr>{["Stock","Symbol","Account","Qty","Avg Cost (CA$)","Live Price (CA$)","Prev Close (CA$)","Day Chg","Market Value (CA$)","Book Value (CA$)","G / L (CA$)"].map((h,i)=><th key={i} style={thS(i>=2)}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {directHoldings.map(h => {
                  const pd     = prices[h.symbol];
                  const livePC = pd ? toCAD(pd.price,    pd.currency||h.cur, usdCad) : null;
                  const prevPC = pd ? toCAD(pd.prevClose, pd.currency||h.cur, usdCad) : null;
                  const avgCostCAD  = h.qty > 0 ? toCAD(h.totalCost/h.qty, h.cur, usdCad) : null;
                  const bookValCAD  = h.qty > 0 ? toCAD(h.totalCost, h.cur, usdCad) : 0;
                  const mktValCAD   = livePC != null ? h.qty * livePC : (avgCostCAD != null ? h.qty * avgCostCAD : null);
                  const gl          = (mktValCAD != null && bookValCAD != null) ? mktValCAD - bookValCAD : null;
                  const glPct       = (gl != null && bookValCAD > 0) ? (gl / bookValCAD * 100) : null;
                  const glColor     = gl == null ? t.textMuted : gl >= 0 ? t.upColor : t.downColor;
                  return (
                    <tr key={`${h.symbol}::${h.account}`} onMouseEnter={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background=t.rowHover)} onMouseLeave={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background="")}>
                      <td style={tdS(false)}>
                        <div style={{fontWeight:600,color:t.text}}>{h.name}</div>
                        <div style={{fontSize:10,color:t.textMuted,marginTop:1}}>{h.sector} · {h.geo}{h.type==="cdr"?" · CIBC CDR (CAD hedged)":""}</div>
                      </td>
                      <td style={{...tdS(false,true),color:t.textMuted,fontSize:11}}>{h.symbol}</td>
                      <td style={tdS(false)}><span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:t.accentBg,color:t.accentText}}>{h.account}</span></td>
                      <td style={{...tdS(true,true),color:t.textSub}}>{fNum(h.qty,4)}</td>
                      <td style={{...tdS(true,true),color:t.textMuted,fontSize:11}}>{avgCostCAD!=null?fCAD(avgCostCAD):"—"}</td>
                      <td style={{...tdS(true,true),fontWeight:700,color:t.text,fontSize:14}}>
                        {livePC != null ? <>{fCAD(livePC)}<span style={{fontSize:9,color:t.upColor,marginLeft:3,fontFamily:"sans-serif"}}>live</span></> : <span style={{color:t.loading}}>loading…</span>}
                      </td>
                      <td style={{...tdS(true,true),color:t.textSub,fontSize:12}}>{prevPC!=null?fCAD(prevPC):"—"}</td>
                      <td style={tdS(true)}><ChangeChip pct={pd?.changePct} t={t}/></td>
                      <td style={{...tdS(true,true),fontWeight:700,color:t.accent,fontSize:14}}>{mktValCAD!=null?fCAD(mktValCAD):"—"}</td>
                      <td style={{...tdS(true,true),color:t.textMuted,fontSize:12}}>{bookValCAD>0?fCAD(bookValCAD):"—"}</td>
                      <td style={{...tdS(true,true),fontWeight:600,color:glColor,fontSize:12}}>
                        {gl!=null ? <>{gl>=0?"+":""}{fCAD(gl)}<span style={{display:"block",fontSize:10}}>{glPct!=null?`${glPct>=0?"+":""}${glPct.toFixed(1)}%`:""}</span></> : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {directHoldings.length === 0 && (
            <div style={{padding:"32px 16px",textAlign:"center",color:t.textMuted,fontSize:13}}>No direct holdings found. Add transactions of type "Buy" for stocks.</div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TRANSACTIONS
      ══════════════════════════════════════════════════════ */}
      {tab==="transactions" && (
        <div>
          <TxForm t={t} onAdd={addTx} editTx={editTx} onSave={tx=>{saveTx(tx);setEditTx(null);}} onCancel={()=>setEditTx(null)}/>

          {/* Summary */}
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
            <StatCard label="Transactions"        val={transactions.length}    sub="total"               t={t}/>
            <StatCard label="Contributions (CA$)" val={fCAD(totalContribs)}    sub="all accounts"       accent="#059669" t={t}/>
            <StatCard label="Dividends (CA$)"     val={fCAD(totalDivs)}        sub="received"           accent="#6366f1" t={t}/>
            <StatCard label="Fees + Tax (CA$)"    val={fCAD(totalFees)}        sub="mgmt + HST"         accent="#f59e0b" t={t}/>
          </div>

          {/* Filters */}
          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:12,padding:14,marginBottom:12,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
            <div>
              <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:3}}>Type</label>
              <select value={txFilter.type} onChange={e=>setTxFilter(f=>({...f,type:e.target.value}))} style={{background:t.inputBg,border:`1px solid ${t.inputBorder}`,borderRadius:6,padding:"6px 8px",color:t.text,fontSize:11,width:"100%"}}>
                <option value="">All types</option>{TX_TYPES.map(tt=><option key={tt} value={tt}>{tt}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:3}}>Account</label>
              <select value={txFilter.account} onChange={e=>setTxFilter(f=>({...f,account:e.target.value}))} style={{background:t.inputBg,border:`1px solid ${t.inputBorder}`,borderRadius:6,padding:"6px 8px",color:t.text,fontSize:11,width:"100%"}}>
                <option value="">All accounts</option>{ACCOUNT_TYPES.map(a=><option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:3}}>Symbol</label>
              <input value={txFilter.symbol} onChange={e=>setTxFilter(f=>({...f,symbol:e.target.value}))} placeholder="Filter…" style={{background:t.inputBg,border:`1px solid ${t.inputBorder}`,borderRadius:6,padding:"6px 8px",color:t.text,fontSize:11,width:"100%"}}/>
            </div>
            <div>
              <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:3}}>From</label>
              <input type="date" value={txFilter.from} onChange={e=>setTxFilter(f=>({...f,from:e.target.value}))} style={{background:t.inputBg,border:`1px solid ${t.inputBorder}`,borderRadius:6,padding:"6px 8px",color:t.text,fontSize:11,width:"100%"}}/>
            </div>
            <div>
              <label style={{fontSize:10,color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:3}}>To</label>
              <input type="date" value={txFilter.to} onChange={e=>setTxFilter(f=>({...f,to:e.target.value}))} style={{background:t.inputBg,border:`1px solid ${t.inputBorder}`,borderRadius:6,padding:"6px 8px",color:t.text,fontSize:11,width:"100%"}}/>
            </div>
            <div style={{display:"flex",alignItems:"flex-end"}}>
              <button onClick={()=>setTxFilter({type:"",account:"",symbol:"",from:"",to:""})} style={{padding:"6px 12px",borderRadius:6,border:`1px solid ${t.border}`,background:"transparent",color:t.textSub,cursor:"pointer",fontSize:11}}>Clear filters</button>
            </div>
          </div>

          {/* Ledger table */}
          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden"}}>
            <div style={{padding:"10px 16px",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:t.surfaceAlt}}>
              <div style={{fontSize:13,fontWeight:600,color:t.text}}>Transaction Ledger</div>
              <div style={{fontSize:11,color:t.textMuted}}>{filteredTxs.length} of {transactions.length}</div>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr>
                    {[["date","Date"],["type","Type"],["symbol","Symbol"],["name","Security"],["account","Account"],["qty","Qty"],["price","Price"],["amount","Amount (CA$)"],["cur","CCY"],["notes","Notes"],["",""]].map(([col,label],i)=>(
                      <th key={i} style={{...thS(i>=5&&i<=7),cursor:col?"pointer":"default"}} onClick={()=>{if(!col)return;setTxSort(s=>({col,dir:s.col===col&&s.dir==="desc"?"asc":"desc"}));}}>
                        <span style={{color:txSort.col===col?t.accent:t.textMuted}}>{label}{txSort.col===col?(txSort.dir==="asc"?" ↑":" ↓"):""}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTxs.map(tx => {
                    const m = TX_META[tx.type] || {color:"#94a3b8",icon:"·",cashSign:0};
                    const isSeed = String(tx.id).startsWith("s");
                    return (
                      <tr key={tx.id} onMouseEnter={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background=t.rowHover)} onMouseLeave={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background="")}>
                        <td style={{...tdS(false,true),fontSize:11,color:t.textSub}}>{tx.date}</td>
                        <td style={tdS(false)}>
                          <span style={{fontSize:10,padding:"2px 8px",borderRadius:12,background:`${m.color}18`,color:m.color,fontWeight:600,whiteSpace:"nowrap"}}>{m.icon} {tx.type}</span>
                        </td>
                        <td style={{...tdS(false,true),fontWeight:600,color:t.text}}>{tx.symbol}</td>
                        <td style={{...tdS(false),color:t.textSub,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.name}</td>
                        <td style={tdS(false)}><span style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:t.accentBg,color:t.accentText}}>{tx.account}</span></td>
                        <td style={{...tdS(true,true),color:t.textSub}}>{tx.qty?fNum(tx.qty,4):"—"}</td>
                        <td style={{...tdS(true,true),color:t.textSub}}>{tx.price?fCAD(tx.price):"—"}</td>
                        <td style={{...tdS(true,true),fontWeight:600,color:m.cashSign===-1?t.downColor:m.cashSign===1?t.upColor:t.textSub}}>
                          {tx.amount!=null&&tx.amount!==0?(m.cashSign===-1?"-":"+")+fCAD(Math.abs(tx.amount)):"—"}
                        </td>
                        <td style={{...tdS(false),color:t.textMuted,fontSize:11}}>{tx.cur}</td>
                        <td style={{...tdS(false),color:t.textMuted,fontSize:11,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.notes}</td>
                        <td style={{...tdS(false),whiteSpace:"nowrap"}}>
                          {!isSeed ? <>
                            <button onClick={()=>setEditTx(tx)} style={{fontSize:11,padding:"3px 8px",borderRadius:5,border:`1px solid ${t.border}`,background:"transparent",color:t.textSub,cursor:"pointer",marginRight:4}}>Edit</button>
                            {delConfirm===tx.id
                              ? <><button onClick={()=>delTx(tx.id)} style={{fontSize:11,padding:"3px 8px",borderRadius:5,border:`1px solid ${t.danger}`,background:t.dangerBg,color:t.danger,cursor:"pointer",marginRight:4}}>Confirm</button><button onClick={()=>setDelConfirm(null)} style={{fontSize:11,padding:"3px 8px",borderRadius:5,border:`1px solid ${t.border}`,background:"transparent",color:t.textSub,cursor:"pointer"}}>Cancel</button></>
                              : <button onClick={()=>setDelConfirm(tx.id)} style={{fontSize:11,padding:"3px 8px",borderRadius:5,border:`1px solid ${t.border}`,background:"transparent",color:t.danger,cursor:"pointer"}}>Delete</button>
                            }
                          </> : <span style={{fontSize:10,color:t.textMuted,fontStyle:"italic"}}>seed</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{marginTop:20,padding:"11px 16px",background:t.footerBg,borderRadius:10,border:`1px solid ${t.border}`,fontSize:10,color:t.textMuted,lineHeight:1.8}}>
        <strong>Prices:</strong> Yahoo Finance via corsproxy.io (free, ~30s load). OTC/ADR tickers: Kerry Group (KRYAY), ConvaTec (CNVVY), Bureau Veritas (BVVBY), Kuehne+Nagel (KHNGY), Misumi (MSUXF), Murata (MRAAY), NEC (NIPNF), GSK (NYSE).
        Fund NAVs are not on Yahoo Finance — fund values use prev-day NAV × units from transactions.
        Transactions saved in browser localStorage. <strong>Not financial advice.</strong>
      </div>
    </div>
  );
}
