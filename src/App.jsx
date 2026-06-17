import { useState } from "react";

const C = {
  navy:"#0F1F3D", navyMid:"#1A3260", blue:"#2563EB",
  accent:"#F59E0B", success:"#10B981", danger:"#EF4444",
  bg:"#F0F4F8", card:"#FFFFFF", text:"#0F1F3D",
  muted:"#64748B", border:"#E2E8F0",
};

// ── DEMO DATEN ─────────────────────────────────────────────────────────────────
const INIT_USERS = [
  {id:1, name:"Max Mustermann",  email:"max@firma.de",   role:"driver", pin:"1234", status:"active"},
  {id:2, name:"Anna Schmidt",    email:"anna@firma.de",  role:"driver", pin:"2345", status:"active"},
  {id:3, name:"Tom Bauer",       email:"tom@firma.de",   role:"driver", pin:"3456", status:"active"},
  {id:4, name:"Chef",            email:"chef@firma.de",  role:"admin",  pin:"0000", status:"active"},
  {id:5, name:"Lisa Weber",      email:"lisa@firma.de",  role:"driver", pin:"4567", status:"pending"},
];

const INIT_CARS = [
  {id:1, plate:"B-FM 1234", model:"VW Passat",        color:"#DBEAFE", driverId:1, since:"2025-06-01"},
  {id:2, plate:"B-FM 5678", model:"BMW 3er",           color:"#D1FAE5", driverId:2, since:"2025-05-15"},
  {id:3, plate:"B-FM 9012", model:"Mercedes C-Klasse", color:"#FEF3C7", driverId:3, since:"2025-06-10"},
  {id:4, plate:"B-FM 3456", model:"Audi A4",           color:"#F3E8FF", driverId:null, since:null},
];

const INIT_HANDOVERS = [
  {id:1, carId:1, fromId:null, toId:1, date:"2025-06-01", note:"Erstausgabe"},
  {id:2, carId:2, fromId:null, toId:2, date:"2025-05-15", note:""},
  {id:3, carId:3, fromId:2,   toId:3, date:"2025-06-10", note:"Tausch wegen Urlaub"},
];

const INIT_RECEIPTS = [
  {id:1, carId:1, userId:1, date:"2025-06-12", amount:"62.40", note:"Tanken A9 Raststätte", img:null},
  {id:2, carId:2, userId:2, date:"2025-06-14", amount:"75.80", note:"Tanken Shell München",  img:null},
];

// ── UI KOMPONENTEN ─────────────────────────────────────────────────────────────
function Btn({onClick, variant="primary", disabled, full, small, children}) {
  const bg = variant==="primary"?C.blue : variant==="danger"?C.danger : variant==="amber"?C.accent : variant==="success"?C.success : "#F1F5F9";
  const col = variant==="secondary" ? C.text : variant==="amber" ? C.navy : "#fff";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:bg, color:col, border:"none", borderRadius:10,
      padding: small ? "6px 12px" : "11px 18px",
      fontSize: small ? 12 : 14, fontWeight:700, cursor:disabled?"not-allowed":"pointer",
      display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
      width:full?"100%":"auto", opacity:disabled?0.5:1, fontFamily:"inherit",
      transition:"opacity 0.15s",
    }}>{children}</button>
  );
}

function Field({label, value, onChange, type="text", placeholder, maxLength}) {
  return (
    <div style={{marginBottom:14}}>
      {label && <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:5}}>{label}</div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
        inputMode={type==="number"?"decimal":type==="password"?"numeric":undefined}
        style={{
          width:"100%", border:`1.5px solid ${C.border}`, borderRadius:10,
          padding:"11px 14px", fontSize:15, fontFamily:"inherit", color:C.text,
          background:"#F8FAFC", boxSizing:"border-box", outline:"none",
        }}/>
    </div>
  );
}

function Dropdown({label, value, onChange, children}) {
  return (
    <div style={{marginBottom:14}}>
      {label && <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:5}}>{label}</div>}
      <select value={value} onChange={onChange} style={{
        width:"100%", border:`1.5px solid ${C.border}`, borderRadius:10,
        padding:"11px 14px", fontSize:15, fontFamily:"inherit", color:C.text,
        background:"#F8FAFC", boxSizing:"border-box", outline:"none", appearance:"none",
      }}>{children}</select>
    </div>
  );
}

function Card({children, accent, style:extra}) {
  return (
    <div style={{
      background:C.card, borderRadius:14, padding:16, marginBottom:12,
      boxShadow:"0 1px 4px rgba(15,31,61,0.07)", border:`1px solid ${C.border}`,
      borderLeft: accent ? `4px solid ${accent}` : undefined,
      ...extra,
    }}>{children}</div>
  );
}

function Sheet({onClose, title, children}) {
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(15,31,61,0.55)",
      zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:C.card, borderRadius:"20px 20px 0 0", padding:"24px 20px 44px",
        width:"100%", maxWidth:480, maxHeight:"88vh", overflowY:"auto",
      }}>
        <div style={{width:40,height:4,background:C.border,borderRadius:99,margin:"0 auto 18px"}}/>
        {title && <div style={{fontWeight:800,fontSize:18,marginBottom:18}}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

function Plate({text}) {
  return <span style={{background:C.navy,color:"#fff",borderRadius:6,padding:"4px 10px",fontSize:13,fontWeight:800,letterSpacing:1}}>{text}</span>;
}

function Tag({children, color=C.success}) {
  return <span style={{background:color+"22",color,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>{children}</span>;
}

function SectionTitle({children}) {
  return <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>{children}</div>;
}

// ── LOGIN / REGISTRIERUNG ──────────────────────────────────────────────────────
function AuthScreen({users, setUsers, onLogin}) {
  const [mode,setMode]       = useState("login"); // login | register
  const [email,setEmail]     = useState("");
  const [pin,setPin]         = useState("");
  const [name,setName]       = useState("");
  const [pin2,setPin2]       = useState("");
  const [error,setError]     = useState("");
  const [success,setSuccess] = useState("");

  const doLogin = () => {
    const u = users.find(u=>u.email===email.trim().toLowerCase()&&u.pin===pin.trim());
    if (!u) { setError("E-Mail oder PIN falsch."); return; }
    if (u.status==="pending") { setError("Dein Account wartet noch auf Freischaltung durch den Chef."); return; }
    onLogin(u);
  };

  const doRegister = () => {
    if (!name.trim()||!email.trim()||!pin.trim()) { setError("Bitte alle Felder ausfüllen."); return; }
    if (pin!==pin2) { setError("PINs stimmen nicht überein."); return; }
    if (pin.length<4) { setError("PIN muss mindestens 4 Ziffern haben."); return; }
    if (users.find(u=>u.email===email.trim().toLowerCase())) { setError("Diese E-Mail ist bereits registriert."); return; }
    const newUser = {id:users.length+1, name:name.trim(), email:email.trim().toLowerCase(), role:"driver", pin:pin.trim(), status:"pending"};
    setUsers(p=>[...p,newUser]);
    setSuccess("Registrierung erfolgreich! Der Chef muss dich zuerst freischalten.");
    setError("");
    setMode("login");
    setEmail(email.trim().toLowerCase());
    setPin("");
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(160deg, ${C.navy} 0%, ${C.navyMid} 55%, #1E3A8A 100%)`,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:4,color:C.accent,marginBottom:6}}>FLEETAPP</div>
        <div style={{fontSize:26,fontWeight:800,color:"#fff",letterSpacing:-1}}>Firmenwagen</div>
        <div style={{fontSize:14,color:"#94A3B8",marginTop:4}}>Verwaltung</div>
      </div>

      <div style={{background:C.card,borderRadius:20,padding:"28px 22px",width:"100%",maxWidth:380,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        {/* Tabs */}
        <div style={{display:"flex",background:C.bg,borderRadius:10,padding:4,marginBottom:22}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setError("");setSuccess("");}} style={{
              flex:1, padding:"8px 0", border:"none", borderRadius:8, fontFamily:"inherit",
              background:mode===m?C.card:"transparent",
              color:mode===m?C.text:C.muted, fontWeight:mode===m?700:500, fontSize:13, cursor:"pointer",
              boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.1)":"none",
            }}>
              {m==="login"?"Anmelden":"Registrieren"}
            </button>
          ))}
        </div>

        {success && <div style={{background:"#D1FAE5",color:C.success,borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:600,marginBottom:14}}>{success}</div>}
        {error   && <div style={{background:"#FEE2E2",color:C.danger, borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:600,marginBottom:14}}>{error}</div>}
  
          </>
        ) : (
          <>
            <Field label="Vollständiger Name" placeholder="Max Mustermann" value={name} onChange={e=>{setName(e.target.value);setError("");}}/>
            <Field label="E-Mail" type="email" placeholder="deine@email.de" value={email} onChange={e=>{setEmail(e.target.value);setError("");}}/>
            <Field label="PIN wählen (mind. 4 Ziffern)" type="password" placeholder="••••" value={pin} maxLength={6} onChange={e=>{setPin(e.target.value);setError("");}}/>
            <Field label="PIN wiederholen" type="password" placeholder="••••" value={pin2} maxLength={6} onChange={e=>{setPin2(e.target.value);setError("");}}/>
            <Btn full onClick={doRegister}>Registrieren</Btn>
            <div style={{marginTop:14,fontSize:12,color:C.muted,textAlign:"center"}}>
              Nach der Registrierung muss der Chef deinen Account freischalten.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── ÜBERGABE SHEET ─────────────────────────────────────────────────────────────
function HandoverSheet({cars, users, currentUser, preselectedCar, onClose, onSave}) {
  const [carId,setCarId] = useState(preselectedCar?.id||"");
  const [toId,setToId]   = useState("");
  const [date,setDate]   = useState(new Date().toISOString().split("T")[0]);
  const [note,setNote]   = useState("");

  const availableCars = currentUser.role==="admin" ? cars : cars.filter(c=>c.driverId===currentUser.id);
  const currentDriverId = cars.find(c=>c.id===parseInt(carId))?.driverId;
  const currentDriver   = users.find(u=>u.id===currentDriverId);

  return (
    <Sheet onClose={onClose} title="Übergabe eintragen">
      <Dropdown label="Fahrzeug" value={carId} onChange={e=>setCarId(e.target.value)}>
        <option value="">– Fahrzeug wählen –</option>
        {availableCars.map(c=><option key={c.id} value={c.id}>{c.plate} – {c.model}</option>)}
      </Dropdown>
      {currentDriver && <div style={{fontSize:13,color:C.muted,marginBottom:14}}>Aktuell bei: <strong>{currentDriver.name}</strong></div>}
      <Dropdown label="Übergabe an" value={toId} onChange={e=>setToId(e.target.value)}>
        <option value="">– Mitarbeiter wählen –</option>
        {users.filter(u=>u.role!=="admin"&&u.status==="active").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
      </Dropdown>
      <Field label="Datum" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
      <Field label="Notiz (optional)" placeholder="z.B. Urlaub, Werkstatt..." value={note} onChange={e=>setNote(e.target.value)}/>
      <div style={{display:"flex",gap:10}}>
        <Btn variant="secondary" onClick={onClose}>Abbrechen</Btn>
        <Btn disabled={!carId||!toId||!date} onClick={()=>onSave({carId:parseInt(carId),fromId:currentDriverId||null,toId:parseInt(toId),date,note})}>
          Speichern
        </Btn>
      </div>
    </Sheet>
  );
}

// ── TANKBELEG SHEET ────────────────────────────────────────────────────────────
function ReceiptSheet({cars, currentUser, onClose, onSave}) {
  const myCar = cars.find(c=>c.driverId===currentUser.id);
  const [carId,setCarId]     = useState(myCar?.id||"");
  const [amount,setAmount]   = useState("");
  const [date,setDate]       = useState(new Date().toISOString().split("T")[0]);
  const [note,setNote]       = useState("");
  const [preview,setPreview] = useState(null);
  const [img,setImg]         = useState(null);

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImg(ev.target.result); setPreview(ev.target.result); };
    reader.readAsDataURL(file);
  };

  return (
    <Sheet onClose={onClose} title="Tankbeleg hochladen">
      <Dropdown label="Fahrzeug" value={carId} onChange={e=>setCarId(e.target.value)}>
        <option value="">– Fahrzeug wählen –</option>
        {cars.map(c=><option key={c.id} value={c.id}>{c.plate} – {c.model}</option>)}
      </Dropdown>
      <Field label="Betrag (Euro)" type="number" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)}/>
      <Field label="Datum" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
      <Field label="Notiz" placeholder="z.B. Shell Autobahn A9" value={note} onChange={e=>setNote(e.target.value)}/>
      <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:8}}>Foto des Belegs</div>
      <label style={{
        display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8,
        border:`2px dashed ${C.border}`, borderRadius:12, padding:20, cursor:"pointer",
        marginBottom:14, background:"#F8FAFC", minHeight:100,
      }}>
        {preview
          ? <img src={preview} style={{width:"100%",borderRadius:8,maxHeight:200,objectFit:"cover"}} alt="Vorschau"/>
          : <>
              <span style={{fontSize:32}}>📷</span>
              <span style={{color:C.muted,fontSize:14,fontWeight:500}}>Foto aufnehmen oder auswählen</span>
            </>
        }
        <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handlePhoto}/>
      </label>
      <div style={{display:"flex",gap:10}}>
        <Btn variant="secondary" onClick={onClose}>Abbrechen</Btn>
        <Btn variant="amber" disabled={!carId||!amount||!date} onClick={()=>onSave({carId:parseInt(carId),amount,date,note,img})}>
          Speichern
        </Btn>
      </div>
    </Sheet>
  );
}

// ── AUTO HINZUFÜGEN ────────────────────────────────────────────────────────────
function CarSheet({onClose, onSave}) {
  const [plate,setPlate] = useState("");
  const [model,setModel] = useState("");
  const colors = ["#DBEAFE","#D1FAE5","#FEF3C7","#F3E8FF","#FFE4E6","#E0F2FE"];
  const [color,setColor] = useState(colors[0]);
  return (
    <Sheet onClose={onClose} title="Fahrzeug hinzufügen">
      <Field label="Kennzeichen" placeholder="z.B. B-FM 1234" value={plate} onChange={e=>setPlate(e.target.value.toUpperCase())}/>
      <Field label="Modell" placeholder="z.B. VW Passat" value={model} onChange={e=>setModel(e.target.value)}/>
      <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:8}}>Kartenfarbe</div>
      <div style={{display:"flex",gap:10,marginBottom:18}}>
        {colors.map(c=>(
          <div key={c} onClick={()=>setColor(c)} style={{width:32,height:32,borderRadius:8,background:c,cursor:"pointer",border:`3px solid ${color===c?C.blue:"transparent"}`}}/>
        ))}
      </div>
      <div style={{display:"flex",gap:10}}>
        <Btn variant="secondary" onClick={onClose}>Abbrechen</Btn>
        <Btn disabled={!plate||!model} onClick={()=>onSave({plate,model,color})}>Hinzufügen</Btn>
      </div>
    </Sheet>
  );
}

// ── BILD ANSICHT ───────────────────────────────────────────────────────────────
function ImgSheet({receipt, onClose}) {
  return (
    <Sheet onClose={onClose} title="Tankbeleg">
      {receipt.img && <img src={receipt.img} style={{width:"100%",borderRadius:12,marginBottom:14}} alt="Beleg"/>}
      <div style={{fontWeight:700,fontSize:16}}>{parseFloat(receipt.amount).toFixed(2).replace(".",",")} Euro</div>
      <div style={{fontSize:13,color:C.muted,marginTop:4}}>{receipt.note}</div>
      <div style={{marginTop:16}}>
        <Btn variant="secondary" full onClick={onClose}>Schließen</Btn>
      </div>
    </Sheet>
  );
}

// ── HAUPT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [users,setUsers]         = useState(INIT_USERS);
  const [user,setUser]           = useState(null);
  const [tab,setTab]             = useState("cars");
  const [cars,setCars]           = useState(INIT_CARS);
  const [handovers,setHandovers] = useState(INIT_HANDOVERS);
  const [receipts,setReceipts]   = useState(INIT_RECEIPTS);
  const [modal,setModal]         = useState(null);
  const [selected,setSelected]   = useState(null);
  const [viewReceipt,setViewReceipt] = useState(null);

  if (!user) return <AuthScreen users={users} setUsers={setUsers} onLogin={setUser}/>;

  const findUser = id => users.find(u=>u.id===id);
  const userCar  = cars.find(c=>c.driverId===user.id);
  const pending  = users.filter(u=>u.status==="pending");

  const approveUser = id => setUsers(p=>p.map(u=>u.id===id?{...u,status:"active"}:u));
  const rejectUser  = id => setUsers(p=>p.filter(u=>u.id!==id));

  const tabs = [
    {id:"cars",     label:"Fahrzeuge", icon:"🚗"},
    {id:"handover", label:"Übergabe",  icon:"🔄"},
    {id:"receipts", label:"Belege",    icon:"⛽"},
    {id:"profile",  label:"Profil",    icon:"👤"},
  ];

  const myReceipts = receipts.filter(r=>r.userId===user.id);

  return (
    <div style={{fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif",background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative"}}>

      {/* HEADER */}
      <div style={{
        background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`,
        color:"#fff", padding:"18px 20px 14px", position:"sticky", top:0, zIndex:100,
        boxShadow:"0 2px 12px rgba(15,31,61,0.3)",
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:3,color:C.accent,textTransform:"uppercase"}}>FleetApp</div>
            <div style={{fontSize:20,fontWeight:800,marginTop:2,letterSpacing:-0.5}}>
              {tab==="cars"?"Fahrzeuge":tab==="handover"?"Übergaben":tab==="receipts"?"Tankbelege":"Profil"}
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {user.role==="admin"&&pending.length>0 && (
              <span style={{background:C.danger,color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:800}}>
                {pending.length} neu
              </span>
            )}
            {user.role==="admin" && (
              <span style={{background:C.accent,color:C.navy,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:800}}>CHEF</span>
            )}
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav style={{display:"flex",background:C.card,borderBottom:`1px solid ${C.border}`,position:"sticky",top:68,zIndex:99}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1, padding:"10px 4px 8px", border:"none", background:"transparent",
            fontSize:10, fontWeight:tab===t.id?700:500,
            color:tab===t.id?C.blue:C.muted,
            borderBottom:tab===t.id?`3px solid ${C.blue}`:"3px solid transparent",
            cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2,
            fontFamily:"inherit",
          }}>
            <span style={{fontSize:18}}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <div style={{padding:"16px 16px 100px"}}>

        {/* ── FAHRZEUGE ── */}
        {tab==="cars" && (
          <>
            {/* Freischaltungen für Chef */}
            {user.role==="admin" && pending.length>0 && (
              <>
                <SectionTitle>Neue Registrierungen ({pending.length})</SectionTitle>
                {pending.map(u=>(
                  <Card key={u.id} accent={C.accent}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:15}}>{u.name}</div>
                        <div style={{fontSize:12,color:C.muted,marginTop:2}}>{u.email}</div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <Btn variant="danger" small onClick={()=>rejectUser(u.id)}>✕</Btn>
                        <Btn variant="success" small onClick={()=>approveUser(u.id)}>✓ Freischalten</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
                <div style={{height:4}}/>
              </>
            )}

            <SectionTitle>Alle Fahrzeuge ({cars.length})</SectionTitle>
            {cars.map(car=>{
              const driver = findUser(car.driverId);
              const count  = receipts.filter(r=>r.carId===car.id).length;
              const canHandover = user.role==="admin" || car.driverId===user.id;
              return (
                <Card key={car.id} accent={car.color}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Plate text={car.plate}/>
                    {driver
                      ? <span style={{background:car.color,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:C.navyMid}}>👤 {driver.name}</span>
                      : <span style={{background:"#FEE2E2",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:"#991B1B"}}>🔑 Frei</span>
                    }
                  </div>
                  <div style={{fontWeight:600,fontSize:14,color:C.text,marginBottom:4}}>{car.model}</div>
                  {car.since && <div style={{fontSize:12,color:C.muted,marginBottom:8}}>🕐 Seit {new Date(car.since).toLocaleDateString("de-DE")}</div>}
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                    <Tag color={C.accent}>⛽ {count} Beleg{count!==1?"e":""}</Tag>
                    {canHandover && (
                      <button onClick={()=>{setSelected(car);setModal("handover");}} style={{
                        background:"#F1F5F9",color:C.text,border:"none",borderRadius:8,
                        padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",
                      }}>🔄 Übergabe</button>
                    )}
                    {user.role==="admin" && (
                      <button onClick={()=>setCars(p=>p.filter(c=>c.id!==car.id))} style={{
                        background:"#FEE2E2",color:C.danger,border:"none",borderRadius:8,
                        padding:"5px 10px",fontSize:12,cursor:"pointer",fontFamily:"inherit",
                      }}>🗑</button>
                    )}
                  </div>
                </Card>
              );
            })}
            {user.role==="admin" && (
              <Btn full onClick={()=>setModal("car-add")}>+ Fahrzeug hinzufügen</Btn>
            )}
          </>
        )}

        {/* ── ÜBERGABEN ── */}
        {tab==="handover" && (
          <>
            <SectionTitle>Übergabe-Historie</SectionTitle>
            {[...handovers].reverse().map(h=>{
              const car  = cars.find(c=>c.id===h.carId);
              const from = h.fromId ? findUser(h.fromId) : null;
              const to   = findUser(h.toId);
              // Fahrer sieht nur seine eigenen Übergaben
              if (user.role!=="admin" && h.fromId!==user.id && h.toId!==user.id) return null;
              return (
                <Card key={h.id}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <Plate text={car?.plate}/>
                    <span style={{fontSize:12,color:C.muted}}>{car?.model}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,flexWrap:"wrap"}}>
                    <span style={{background:"#F1F5F9",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:C.muted}}>
                      {from?from.name:"Erstausgabe"}
                    </span>
                    <span style={{color:C.blue,fontWeight:800}}>→</span>
                    <span style={{background:"#DBEAFE",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:C.navyMid}}>
                      {to?.name}
                    </span>
                  </div>
                  <div style={{fontSize:12,color:C.muted,marginTop:8}}>
                    📅 {new Date(h.date).toLocaleDateString("de-DE")}{h.note?` · ${h.note}`:""}
                  </div>
                </Card>
              );
            })}
            <Btn full onClick={()=>{setSelected(null);setModal("handover");}}>+ Neue Übergabe eintragen</Btn>
          </>
        )}

        {/* ── TANKBELEGE ── */}
        {tab==="receipts" && (
          <>
            {user.role==="admin" ? (
              <>
                <SectionTitle>Alle Belege ({receipts.length})</SectionTitle>
                {/* CSV Export für Chef */}
                <button onClick={()=>{
                  const rows = ["Datum,Betrag,Kennzeichen,Mitarbeiter,Notiz",
                    ...receipts.map(r=>{
                      const car=cars.find(c=>c.id===r.carId);
                      const u=findUser(r.userId);
                      return `${r.date},${r.amount},${car?.plate||""},${u?.name||""},${r.note||""}`;
                    })
                  ].join("\n");
                  const blob = new Blob([rows],{type:"text/csv"});
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = "tankbelege.csv";
                  a.click();
                }} style={{
                  background:C.success+"22",color:C.success,border:`1.5px solid ${C.success}33`,
                  borderRadius:10,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",
                  fontFamily:"inherit",width:"100%",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                }}>
                  ⬇️ Alle Belege als Excel/CSV herunterladen
                </button>
                {receipts.map(r=>{
                  const car=cars.find(c=>c.id===r.carId);
                  const uploader=findUser(r.userId);
                  return (
                    <Card key={r.id}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div>
                          <div style={{fontWeight:800,fontSize:17,color:C.text}}>{parseFloat(r.amount).toFixed(2).replace(".",",")} €</div>
                          <div style={{fontSize:12,color:C.muted,marginTop:2}}>{new Date(r.date).toLocaleDateString("de-DE")} · {car?.plate}</div>
                          <div style={{fontSize:12,color:C.muted}}>👤 {uploader?.name}</div>
                          {r.note&&<div style={{fontSize:13,color:C.text,marginTop:5}}>{r.note}</div>}
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                          {r.img
                            ? <img src={r.img} onClick={()=>{setViewReceipt(r);setModal("img");}}
                                style={{width:60,height:60,borderRadius:10,objectFit:"cover",border:`2px solid ${C.border}`,cursor:"pointer"}} alt="Beleg"/>
                            : <div style={{width:60,height:60,borderRadius:10,background:"#F1F5F9",border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.muted,textAlign:"center",padding:4}}>Kein Foto</div>
                          }
                          <button onClick={()=>setReceipts(p=>p.filter(x=>x.id!==r.id))} style={{
                            background:"#FEE2E2",color:C.danger,border:"none",borderRadius:8,
                            padding:"4px 10px",fontSize:12,cursor:"pointer",fontFamily:"inherit",
                          }}>🗑</button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </>
            ) : (
              <>
                <SectionTitle>Meine Belege ({myReceipts.length})</SectionTitle>
                {myReceipts.length===0 && (
                  <Card>
                    <div style={{textAlign:"center",color:C.muted,padding:"20px 0",fontSize:14}}>
                      Noch keine Belege hochgeladen.
                    </div>
                  </Card>
                )}
                {myReceipts.map(r=>{
                  const car=cars.find(c=>c.id===r.carId);
                  return (
                    <Card key={r.id}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div>
                          <div style={{fontWeight:800,fontSize:17}}>{parseFloat(r.amount).toFixed(2).replace(".",",")} €</div>
                          <div style={{fontSize:12,color:C.muted,marginTop:2}}>{new Date(r.date).toLocaleDateString("de-DE")} · {car?.plate}</div>
                          {r.note&&<div style={{fontSize:13,color:C.text,marginTop:5}}>{r.note}</div>}
                        </div>
                        {r.img
                          ? <img src={r.img} onClick={()=>{setViewReceipt(r);setModal("img");}}
                              style={{width:60,height:60,borderRadius:10,objectFit:"cover",border:`2px solid ${C.border}`,cursor:"pointer"}} alt="Beleg"/>
                          : <div style={{width:60,height:60,borderRadius:10,background:"#F1F5F9",border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.muted,textAlign:"center",padding:4}}>Kein Foto</div>
                        }
                      </div>
                    </Card>
                  );
                })}
              </>
            )}
            <Btn full variant="amber" onClick={()=>setModal("receipt")}>📷 Tankbeleg hochladen</Btn>
          </>
        )}

        {/* ── PROFIL ── */}
        {tab==="profile" && (
          <>
            <Card style={{textAlign:"center",padding:"28px 20px"}}>
              <div style={{
                width:70,height:70,borderRadius:"50%",
                background:`linear-gradient(135deg, ${C.blue}, ${C.navyMid})`,
                margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:28,fontWeight:800,color:"#fff",
              }}>{user.name.charAt(0)}</div>
              <div style={{fontWeight:800,fontSize:20}}>{user.name}</div>
              <div style={{color:C.muted,fontSize:13,marginTop:2}}>{user.email}</div>
              <div style={{marginTop:12}}>
                <Tag color={user.role==="admin"?C.accent:C.blue}>
                  {user.role==="admin"?"👑 Administrator":"🚗 Fahrer"}
                </Tag>
              </div>
            </Card>

            {userCar && (
              <Card>
                <SectionTitle>Mein Fahrzeug</SectionTitle>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Plate text={userCar.plate}/>
                  <span style={{fontWeight:600}}>{userCar.model}</span>
                </div>
                {userCar.since&&<div style={{fontSize:12,color:C.muted,marginTop:8}}>Zugewiesen seit {new Date(userCar.since).toLocaleDateString("de-DE")}</div>}
              </Card>
            )}

            {user.role==="admin" && (
              <>
                <Card>
                  <SectionTitle>Übersicht</SectionTitle>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {[
                      {label:"Fahrzeuge",  val:cars.length},
                      {label:"Belegt",     val:cars.filter(c=>c.driverId).length},
                      {label:"Mitarbeiter",val:users.filter(u=>u.role!=="admin"&&u.status==="active").length},
                      {label:"Belege",     val:receipts.length},
                    ].map(s=>(
                      <div key={s.label} style={{background:C.bg,borderRadius:12,padding:"14px 12px",textAlign:"center"}}>
                        <div style={{fontSize:26,fontWeight:800,color:C.navy}}>{s.val}</div>
                        <div style={{fontSize:12,color:C.muted,marginTop:2}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <SectionTitle>Alle Mitarbeiter</SectionTitle>
                  {users.filter(u=>u.role!=="admin").map(u=>(
                    <div key={u.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:10,marginBottom:10,borderBottom:`1px solid ${C.border}`}}>
                      <div>
                        <div style={{fontWeight:600,fontSize:14}}>{u.name}</div>
                        <div style={{fontSize:12,color:C.muted}}>{u.email}</div>
                      </div>
                      <Tag color={u.status==="active"?C.success:C.accent}>
                        {u.status==="active"?"Aktiv":"Ausstehend"}
                      </Tag>
                    </div>
                  ))}
                </Card>
              </>
            )}

            <Btn full variant="danger" onClick={()=>setUser(null)}>Abmelden</Btn>
          </>
        )}
      </div>

      {/* MODALS */}
      {modal==="handover" && (
        <HandoverSheet cars={cars} users={users} currentUser={user} preselectedCar={selected}
          onClose={()=>setModal(null)}
          onSave={h=>{
            setHandovers(p=>[...p,{...h,id:p.length+1}]);
            setCars(p=>p.map(c=>c.id===h.carId?{...c,driverId:h.toId,since:h.date}:c));
            setModal(null); setTab("handover");
          }}/>
      )}
      {modal==="receipt" && (
        <ReceiptSheet cars={cars} currentUser={user} onClose={()=>setModal(null)}
          onSave={r=>{
            setReceipts(p=>[...p,{...r,id:p.length+1,userId:user.id}]);
            setModal(null);
          }}/>
      )}
      {modal==="car-add" && (
        <CarSheet onClose={()=>setModal(null)}
          onSave={c=>{
            setCars(p=>[...p,{...c,id:p.length+1,driverId:null,since:null}]);
            setModal(null);
          }}/>
      )}
      {modal==="img" && viewReceipt && (
        <ImgSheet receipt={viewReceipt} onClose={()=>setModal(null)}/>
      )}
    </div>
  );
}
