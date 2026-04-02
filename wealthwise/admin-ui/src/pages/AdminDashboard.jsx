import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

const Svg = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const DashIcon = () => <Svg><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></Svg>;
const UsersIcon = () => <Svg><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
const AmcIcon = () => <Svg><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></Svg>;
const FundIcon = () => <Svg><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></Svg>;
const InvestIcon = () => <Svg><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Svg>;
const LogoutIcon = () => <Svg><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>;
const PlusIcon = () => <Svg><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const TrashIcon = () => <Svg size={14}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></Svg>;
const CloseIcon = () => <Svg><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;

const S = {
  app: { display:"flex", minHeight:"100vh", background:"#0a0e1a", color:"#e2e8f0", fontFamily:"'DM Sans','Segoe UI',sans-serif" },
  sidebar: { width:240, background:"#0d1225", borderRight:"1px solid #1e2a45", display:"flex", flexDirection:"column", padding:"24px 0", position:"fixed", height:"100vh", zIndex:10 },
  logo: { padding:"0 24px 28px", borderBottom:"1px solid #1e2a45" },
  logoText: { fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.5px" },
  logoAccent: { color:"#f59e0b" },
  logoSub: { fontSize:11, color:"#64748b", marginTop:2 },
  nav: { flex:1, padding:"16px 12px" },
  navItem: (active) => ({
    display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, cursor:"pointer", marginBottom:4,
    background: active ? "rgba(245,158,11,0.12)" : "transparent",
    color: active ? "#f59e0b" : "#94a3b8",
    fontWeight: active ? 600 : 400, fontSize:14,
    border: active ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent",
  }),
  logoutBtn: { margin:"0 12px 12px", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, cursor:"pointer", color:"#ef4444", fontSize:14, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)" },
  main: { flex:1, marginLeft:240, padding:"32px 36px", overflowY:"auto" },
  pageHeader: { marginBottom:28, display:"flex", justifyContent:"space-between", alignItems:"center" },
  pageTitle: { fontSize:26, fontWeight:700, color:"#fff", letterSpacing:"-0.5px" },
  pageSub: { fontSize:13, color:"#64748b", marginTop:4 },
  statGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 },
  statCard: (accent) => ({ background:"#0d1225", border:`1px solid ${accent}30`, borderRadius:12, padding:"20px 22px", position:"relative", overflow:"hidden" }),
  statLabel: { fontSize:11, color:"#64748b", fontWeight:600, letterSpacing:1, textTransform:"uppercase" },
  statVal: { fontSize:28, fontWeight:700, color:"#fff", margin:"6px 0 2px" },
  statHint: { fontSize:12, color:"#64748b" },
  statAccent: (accent) => ({ position:"absolute", top:16, right:16, width:36, height:36, borderRadius:8, background:`${accent}20`, display:"flex", alignItems:"center", justifyContent:"center", color:accent }),
  card: { background:"#0d1225", border:"1px solid #1e2a45", borderRadius:12, padding:24, marginBottom:24 },
  btn: (v="primary") => ({
    display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600,
    background: v==="primary"?"#f59e0b": v==="danger"?"rgba(239,68,68,0.12)": "rgba(255,255,255,0.05)",
    color: v==="primary"?"#0a0e1a": v==="danger"?"#ef4444":"#e2e8f0",
    outline: v==="danger"?"1px solid rgba(239,68,68,0.2)":"none",
  }),
  table: { width:"100%", borderCollapse:"collapse" },
  th: { padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:"#64748b", letterSpacing:1, textTransform:"uppercase", borderBottom:"1px solid #1e2a45" },
  td: { padding:"12px 14px", fontSize:13, borderBottom:"1px solid #111827", color:"#cbd5e1" },
  badge: (c) => ({
    padding:"3px 8px", borderRadius:20, fontSize:11, fontWeight:600,
    background: c==="green"?"rgba(16,185,129,0.12)": c==="red"?"rgba(239,68,68,0.12)": c==="blue"?"rgba(59,130,246,0.12)": c==="yellow"?"rgba(245,158,11,0.12)":"rgba(100,116,139,0.2)",
    color: c==="green"?"#10b981": c==="red"?"#ef4444": c==="blue"?"#3b82f6": c==="yellow"?"#f59e0b":"#94a3b8",
  }),
  modal: { position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 },
  modalBox: { background:"#0d1225", border:"1px solid #1e2a45", borderRadius:14, padding:28, width:440, maxWidth:"90vw" },
  field: { marginBottom:14 },
  label: { fontSize:12, color:"#64748b", fontWeight:600, marginBottom:6, display:"block" },
  input: { width:"100%", padding:"9px 12px", background:"#111827", border:"1px solid #1e2a45", borderRadius:8, color:"#e2e8f0", fontSize:13, outline:"none", boxSizing:"border-box" },
  select: { width:"100%", padding:"9px 12px", background:"#111827", border:"1px solid #1e2a45", borderRadius:8, color:"#e2e8f0", fontSize:13, outline:"none", boxSizing:"border-box" },
  empty: { textAlign:"center", padding:"40px 0", color:"#64748b", fontSize:13 },
};

function Modal({ title, onClose, onSubmit, children }) {
  return (
    <div style={S.modal} onClick={onClose}>
      <div style={S.modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:17, fontWeight:700, color:"#fff" }}>{title}</div>
          <button style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer" }} onClick={onClose}><CloseIcon /></button>
        </div>
        {children}
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
          <button style={S.btn("ghost")} onClick={onClose}>Cancel</button>
          <button style={S.btn("primary")} onClick={onSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}

function Overview({ stats }) {
  const cards = [
    { label:"Total Users", val:stats.users??"—", hint:"Registered investors", accent:"#3b82f6", icon:<UsersIcon /> },
    { label:"AMC Companies", val:stats.amcs??"—", hint:"Active fund houses", accent:"#10b981", icon:<AmcIcon /> },
    { label:"Mutual Funds", val:stats.funds??"—", hint:"Available schemes", accent:"#f59e0b", icon:<FundIcon /> },
    { label:"Investments", val:stats.investments??"—", hint:"Total transactions", accent:"#a855f7", icon:<InvestIcon /> },
  ];
  return (
    <div>
      <div style={S.pageHeader}>
        <div>
          <div style={S.pageTitle}>Admin Dashboard</div>
          <div style={S.pageSub}>WealthWise management overview</div>
        </div>
      </div>
      <div style={S.statGrid}>
        {cards.map(c => (
          <div key={c.label} style={S.statCard(c.accent)}>
            <div style={S.statAccent(c.accent)}>{c.icon}</div>
            <div style={S.statLabel}>{c.label}</div>
            <div style={S.statVal}>{c.val}</div>
            <div style={S.statHint}>{c.hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/admin/users`, { headers: getHeaders() })
      .then(r => r.json()).then(setUsers).catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (u) => {
    const newStatus = u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await fetch(`${API_BASE}/admin/users/${u.user_id}/status`, {
        method:"PUT", headers: getHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      setUsers(users.map(x => x.user_id === u.user_id ? { ...x, status: newStatus } : x));
    } catch { alert("Failed to update status"); }
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div><div style={S.pageTitle}>Users</div><div style={S.pageSub}>Manage investor accounts</div></div>
      </div>
      <div style={S.card}>
        {loading ? <div style={S.empty}>Loading...</div> : users.length === 0 ? <div style={S.empty}>No users found</div> : (
          <table style={S.table}>
            <thead><tr>{["ID","Name","Email","Phone","Role","Status","Action"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id}>
                  <td style={S.td}>#{u.user_id}</td>
                  <td style={{...S.td,color:"#fff",fontWeight:500}}>{u.name}</td>
                  <td style={S.td}>{u.email}</td>
                  <td style={S.td}>{u.phone||"—"}</td>
                  <td style={S.td}><span style={S.badge(u.role==="ADMIN"?"yellow":"blue")}>{u.role}</span></td>
                  <td style={S.td}><span style={S.badge(u.status==="ACTIVE"?"green":"red")}>{u.status}</span></td>
                  <td style={S.td}>
                    <button style={S.btn(u.status==="ACTIVE"?"danger":"ghost")} onClick={()=>toggleStatus(u)}>
                      {u.status==="ACTIVE"?"Deactivate":"Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AMC() {
  const [amcs, setAmcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");

  const load = () => {
    fetch(`${API_BASE}/admin/amc`, { headers: getHeaders() })
      .then(r => r.json()).then(setAmcs).catch(() => setAmcs([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async () => {
    if (!name.trim()) return alert("AMC name is required");
    try {
      await fetch(`${API_BASE}/admin/amc`, { method:"POST", headers: getHeaders(), body: JSON.stringify({ amc_name: name }) });
      setModal(false); setName(""); load();
    } catch { alert("Failed to add AMC"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this AMC?")) return;
    try {
      await fetch(`${API_BASE}/admin/amc/${id}`, { method:"DELETE", headers: getHeaders() });
      load();
    } catch { alert("Failed to delete"); }
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div><div style={S.pageTitle}>AMC Companies</div><div style={S.pageSub}>Manage fund houses</div></div>
        <button style={S.btn("primary")} onClick={()=>setModal(true)}><PlusIcon /> Add AMC</button>
      </div>
      <div style={S.card}>
        {loading ? <div style={S.empty}>Loading...</div> : amcs.length===0 ? <div style={S.empty}>No AMCs yet.</div> : (
          <table style={S.table}>
            <thead><tr>{["ID","AMC Name","Created At","Action"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {amcs.map(a => (
                <tr key={a.amc_id}>
                  <td style={S.td}>#{a.amc_id}</td>
                  <td style={{...S.td,color:"#fff",fontWeight:500}}>{a.amc_name}</td>
                  <td style={S.td}>{a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}</td>
                  <td style={S.td}><button style={S.btn("danger")} onClick={()=>remove(a.amc_id)}><TrashIcon /> Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <Modal title="Add AMC" onClose={()=>setModal(false)} onSubmit={save}>
          <div style={S.field}>
            <label style={S.label}>AMC Name *</label>
            <input style={S.input} placeholder="e.g. HDFC Mutual Fund" value={name} onChange={e=>setName(e.target.value)} />
          </div>
        </Modal>
      )}
    </div>
  );
}

function MutualFunds() {
  const [funds, setFunds] = useState([]);
  const [amcs, setAmcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ fund_name:"", category:"EQUITY", risk_level:"MEDIUM", current_nav:"", scheme_code:"", amc_id:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const load = () => {
    Promise.all([
      fetch(`${API_BASE}/admin/funds`,{headers:getHeaders()}).then(r=>r.json()),
      fetch(`${API_BASE}/admin/amc`,{headers:getHeaders()}).then(r=>r.json()),
    ]).then(([f,a])=>{ setFunds(f); setAmcs(a); }).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(load, []);

  const save = async () => {
    if (!form.fund_name.trim()||!form.amc_id) return alert("Fund name and AMC are required");
    try {
      await fetch(`${API_BASE}/admin/funds`, {
        method:"POST", headers:getHeaders(),
        body: JSON.stringify({...form, current_nav:parseFloat(form.current_nav)||0, scheme_code:parseInt(form.scheme_code)||0, amc_id:parseInt(form.amc_id)}),
      });
      setModal(false);
      setForm({fund_name:"",category:"EQUITY",risk_level:"MEDIUM",current_nav:"",scheme_code:"",amc_id:""});
      load();
    } catch { alert("Failed to add fund"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this fund?")) return;
    try { await fetch(`${API_BASE}/admin/funds/${id}`,{method:"DELETE",headers:getHeaders()}); load(); }
    catch { alert("Failed to delete"); }
  };

  const catColor = {EQUITY:"blue",DEBT:"green",HYBRID:"yellow"};
  const riskColor = {HIGH:"red",MEDIUM:"yellow",LOW:"green"};

  return (
    <div>
      <div style={S.pageHeader}>
        <div><div style={S.pageTitle}>Mutual Funds</div><div style={S.pageSub}>Manage fund schemes</div></div>
        <button style={S.btn("primary")} onClick={()=>setModal(true)}><PlusIcon /> Add Fund</button>
      </div>
      <div style={S.card}>
        {loading ? <div style={S.empty}>Loading...</div> : funds.length===0 ? <div style={S.empty}>No funds yet.</div> : (
          <table style={S.table}>
            <thead><tr>{["Fund Name","Category","Risk","NAV (₹)","Scheme Code","AMC","Action"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {funds.map(f=>(
                <tr key={f.fund_id}>
                  <td style={{...S.td,color:"#fff",fontWeight:500}}>{f.fund_name}</td>
                  <td style={S.td}><span style={S.badge(catColor[f.category]||"gray")}>{f.category}</span></td>
                  <td style={S.td}><span style={S.badge(riskColor[f.risk_level]||"gray")}>{f.risk_level}</span></td>
                  <td style={{...S.td,color:"#f59e0b",fontWeight:600}}>₹{f.current_nav}</td>
                  <td style={S.td}>{f.scheme_code||"—"}</td>
                  <td style={S.td}>{amcs.find(a=>a.amc_id===f.amc_id)?.amc_name||`AMC #${f.amc_id}`}</td>
                  <td style={S.td}><button style={S.btn("danger")} onClick={()=>remove(f.fund_id)}><TrashIcon /> Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <Modal title="Add Mutual Fund" onClose={()=>setModal(false)} onSubmit={save}>
          <div style={S.field}>
            <label style={S.label}>Fund Name *</label>
            <input style={S.input} placeholder="e.g. HDFC Top 100 Fund" value={form.fund_name} onChange={e=>set("fund_name",e.target.value)} />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={S.field}>
              <label style={S.label}>Category</label>
              <select style={S.select} value={form.category} onChange={e=>set("category",e.target.value)}>
                <option>EQUITY</option><option>DEBT</option><option>HYBRID</option>
              </select>
            </div>
            <div style={S.field}>
              <label style={S.label}>Risk Level</label>
              <select style={S.select} value={form.risk_level} onChange={e=>set("risk_level",e.target.value)}>
                <option>HIGH</option><option>MEDIUM</option><option>LOW</option>
              </select>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={S.field}>
              <label style={S.label}>Current NAV (₹)</label>
              <input style={S.input} type="number" placeholder="245.50" value={form.current_nav} onChange={e=>set("current_nav",e.target.value)} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Scheme Code</label>
              <input style={S.input} type="number" placeholder="100033" value={form.scheme_code} onChange={e=>set("scheme_code",e.target.value)} />
            </div>
          </div>
          <div style={S.field}>
            <label style={S.label}>AMC *</label>
            <select style={S.select} value={form.amc_id} onChange={e=>set("amc_id",e.target.value)}>
              <option value="">Select AMC</option>
              {amcs.map(a=><option key={a.amc_id} value={a.amc_id}>{a.amc_name}</option>)}
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Investments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/admin/investments`, { headers: getHeaders() })
      .then(r => r.json()).then(setData).catch(()=>setData([]))
      .finally(()=>setLoading(false));
  }, []);

  return (
    <div>
      <div style={S.pageHeader}>
        <div><div style={S.pageTitle}>Investments</div><div style={S.pageSub}>All user investment transactions</div></div>
      </div>
      <div style={S.card}>
        {loading ? <div style={S.empty}>Loading...</div> : data.length===0 ? <div style={S.empty}>No investments found</div> : (
          <table style={S.table}>
            <thead><tr>{["ID","User","Fund","Amount","Units","Buy NAV","Type","Date"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {data.map(inv=>(
                <tr key={inv.id}>
                  <td style={S.td}>#{inv.id}</td>
                  <td style={S.td}>#{inv.user_id}</td>
                  <td style={S.td}>#{inv.fund_id}</td>
                  <td style={{...S.td,color:"#10b981",fontWeight:600}}>₹{Number(inv.amount).toLocaleString("en-IN")}</td>
                  <td style={S.td}>{inv.units}</td>
                  <td style={S.td}>₹{inv.buy_nav}</td>
                  <td style={S.td}><span style={S.badge(inv.type==="SIP"?"blue":"yellow")}>{inv.type}</span></td>
                  <td style={S.td}>{inv.investment_date ? new Date(inv.investment_date).toLocaleDateString("en-IN") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [page, setPage] = useState("overview");
  const [stats, setStats] = useState({});

  useEffect(() => {
    const h = getHeaders();
    Promise.allSettled([
      fetch(`${API_BASE}/admin/users`,{headers:h}).then(r=>r.json()),
      fetch(`${API_BASE}/admin/amc`,{headers:h}).then(r=>r.json()),
      fetch(`${API_BASE}/admin/funds`,{headers:h}).then(r=>r.json()),
      fetch(`${API_BASE}/admin/investments`,{headers:h}).then(r=>r.json()),
    ]).then(([u,a,f,i]) => setStats({
      users:  u.status==="fulfilled" ? u.value.length : "—",
      amcs:   a.status==="fulfilled" ? a.value.length : "—",
      funds:  f.status==="fulfilled" ? f.value.length : "—",
      investments: i.status==="fulfilled" ? i.value.length : "—",
    }));
  }, []);

  const navItems = [
    { id:"overview",     label:"Overview",      icon:<DashIcon />   },
    { id:"users",        label:"Users",          icon:<UsersIcon />  },
    { id:"amc",          label:"AMC",            icon:<AmcIcon />    },
    { id:"funds",        label:"Mutual Funds",   icon:<FundIcon />   },
    { id:"investments",  label:"Investments",    icon:<InvestIcon /> },
  ];

  return (
    <div style={S.app}>
      <div style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoText}>Wealth<span style={S.logoAccent}>Wise</span></div>
          <div style={S.logoSub}>ADMIN PANEL</div>
        </div>
        <nav style={S.nav}>
          {navItems.map(item => (
            <div key={item.id} style={S.navItem(page===item.id)} onClick={()=>setPage(item.id)}>
              {item.icon} {item.label}
            </div>
          ))}
        </nav>
        <div style={S.logoutBtn} onClick={()=>{ localStorage.removeItem("adminToken"); window.location.href="/admin-login"; }}>
          <LogoutIcon /> Logout
        </div>
      </div>
      <main style={S.main}>
        {page==="overview"    && <Overview stats={stats} />}
        {page==="users"       && <Users />}
        {page==="amc"         && <AMC />}
        {page==="funds"       && <MutualFunds />}
        {page==="investments" && <Investments />}
      </main>
    </div>
  );
}