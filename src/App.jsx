import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const C = {
  navy:"#0F1F3D", navyMid:"#1A3260", blue:"#2563EB",
  accent:"#F59E0B", success:"#10B981", danger:"#EF4444",
  bg:"#F0F4F8", card:"#FFFFFF", text:"#0F1F3D",
  muted:"#64748B", border:"#E2E8F0",
};

function Btn({onClick, variant="primary", disabled, full, small, children}) {
  const bg = variant==="primary"?C.blue:variant==="danger"?C.danger:variant==="amber"?C.accent:variant==="success"?C.success:"#F1F5F9";
  const col = variant==="secondary"?C.text:variant==="amber"?C.navy:"#fff";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:bg, color:col, border:"none", borderRadius:10,
      padding:small?"6px 12px":"11px 18px",
      fontSize:small?12:14, fontWeight:700, cursor:disabled?"not-allowed":"pointer",
      display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
      width:full?"100%":"auto", opacity:disabled?0.5:1, fontFamily:"inherit",
    }}>{children}</button>
  );
}

function Field({label, value, onChange, type="text", placeholder, maxLength}) {
  return (
    <div style={{marginBottom:14}}>
      {label && <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:5}}>{label}</div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
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
}function Card({children, accent, style:extra}) {
  return (
    <div style={{
      background:C.card, borderRadius:14, padding:16, marginBottom:12,
      boxShadow:"0 1px 4px rgba(15,31,61,0.07)", border:`1px solid ${C.border}`,
      borderLeft:accent?`4px solid ${accent}`:undefined, ...extra,
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
}function AuthScreen({onLogin}) {
  const [mode,setMode]       = useState("login");
  const [email,setEmail]     = useState("");
  const [pin,setPin]         = useState("");
  const [name,setName]       = useState("");
  const [pin2,setPin2]       = useState("");
  const [error,setError]     = useState("");
  const [success,setSuccess] = useState("");
  const [loading,setLoading] = useState(false);

  const doLogin = async () => {
    setLoading(true);
    const { data: all } = await supabase.from("employees").select("*");
    const u = all?.find(u => u.name.toLowerCase()===email.trim().toLowerCase() && u.pin===pin.trim());
    setLoading(false);
    if (!u) { setError("Name oder PIN falsch."); return; }
    if (u.approved === false) { setError("Dein Account wartet auf Freischaltung durch den Chef."); return; }
    onLogin(u);
  };

  const doRegister = async () => {
    if (!name.trim()||!pin.trim()) { setError("Bitte alle Felder ausfüllen."); return; }
    if (pin!==pin2) { setError("PINs stimmen nicht überein."); return; }
    if (pin.length<4) { setError("PIN muss mindestens 4 Ziffern haben."); return; }
    setLoading(true);
    const { error } = await supabase.from("employees").insert({
      name: name.trim(), pin: pin.trim(), role: "employee", approved: false,
    });
    setLoading(false);
    if (error) { setError("Fehler: " + error.message); return; }
    setSuccess("Registrierung erfolgreich! Der Chef muss dich freischalten.");
    setError(""); setMode("login"); setEmail(name.trim()); setPin("");
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
        <div style={{display:"flex",background:C.bg,borderRadius:10,padding:4,marginBottom:22}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setError("");setSuccess("");}} style={{
              flex:1, padding:"8px 0", border:"none", borderRadius:8, fontFamily:"inherit",
              background:mode===m?C.card:"transparent",
              color:mode===m?C.text:C.muted, fontWeight:mode===m?700:500, fontSize:13, cursor:"pointer",
              boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.1)":"none",
            }}>{m==="login"?"Anmelden":"Registrieren"}</button>
          ))}
        </div>
        {success && <div style={{background:"#D1FAE5",color:C.success,borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:600,marginBottom:14}}>{success}</div>}
        {error   && <div style={{background:"#FEE2E2",color:C.danger, borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:600,marginBottom:14}}>{error}</div>}
        {mode==="login" ? (
          <>
            <Field label="Name" placeholder="Dein Name" value={email} onChange={e=>{setEmail(e.target.value);setError("");}}/>
            <Field label="PIN" type="password" placeholder="••••" value={pin} maxLength={6} onChange={e=>{setPin(e.target.value);setError("");}}/>
            <Btn full onClick={doLogin} disabled={loading}>{loading?"Laden...":"Anmelden"}</Btn>
          </>
        ) : (
          <>
            <Field label="Vollständiger Name" placeholder="Max Mustermann" value={name} onChange={e=>{setName(e.target.value);setError("");}}/>
            <Field label="PIN wählen (mind. 4 Ziffern)" type="password" placeholder="••••" value={pin} maxLength={6} onChange={e=>{setPin(e.target.value);setError("");}}/>
            <Field label="PIN wiederholen" type="password" placeholder="••••" value={pin2} maxLength={6} onChange={e=>{setPin2(e.target.value);setError("");}}/>
            <Btn full onClick={doRegister} disabled={loading}>{loading?"Laden...":"Registrieren"}</Btn>
            <div style={{marginTop:14,fontSize:12,color:C.muted,textAlign:"center"}}>
              Nach der Registrierung muss der Chef deinen Account freischalten.
            </div>
          </>
        )}
      </div>
    </div>
  );
}function HandoverSheet({cars, users, currentUser, preselectedCar, onClose, onSave}) {
  const [carId,setCarId] = useState(preselectedCar?.id||"");
  const [toId,setToId]   = useState("");
  const [date,setDate]   = useState(new Date().toISOString().split("T")[0]);
  const [note,setNote]   = useState("");
  const availableCars    = currentUser.role==="admin"?cars:cars.filter(c=>c.driver_id===currentUser.id);
  const currentDriverId  = cars.find(c=>c.id===carId)?.driver_id;
  const currentDriver    = users.find(u=>u.id===currentDriverId);
  return (
    <Sheet onClose={onClose} title="Übergabe eintragen">
      <Dropdown label="Fahrzeug" value={carId} onChange={e=>setCarId(e.target.value)}>
        <option value="">– Fahrzeug wählen –</option>
        {availableCars.map(c=><option key={c.id} value={c.id}>{c.license_plate} – {c.name}</option>)}
      </Dropdown>
      {currentDriver && <div style={{fontSize:13,color:C.muted,marginBottom:14}}>Aktuell bei: <strong>{currentDriver.name}</strong></div>}
      <Dropdown label="Übergabe an" value={toId} onChange={e=>setToId(e.target.value)}>
        <option value="">– Mitarbeiter wählen –</option>
        {users.filter(u=>u.role!=="admin"&&u.approved===true).map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
      </Dropdown>
      <Field label="Datum" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
      <Field label="Notiz (optional)" placeholder="z.B. Urlaub, Werkstatt..." value={note} onChange={e=>setNote(e.target.value)}/>
      <div style={{display:"flex",gap:10}}>
        <Btn variant="secondary" onClick={onClose}>Abbrechen</Btn>
        <Btn disabled={!carId||!toId||!date} onClick={()=>onSave({vehicle_id:carId,employee_id:toId,date,note})}>
          Speichern
        </Btn>
      </div>
    </Sheet>
  );
}

function ReceiptSheet({cars, currentUser, receipts, onClose, onSave}) {
  const myCar = cars.find(c=>c.driver_id===currentUser.id);
  const [carId,setCarId]     = useState(myCar?.id||"");
  const [amount,setAmount]   = useState("");
  const [km,setKm]           = useState("");
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

  const lastKm = carId ? [...receipts]
    .filter(r=>r.vehicle_id===carId&&r.odometer)
    .sort((a,b)=>new Date(b.date)-new Date(a.date))[0]?.odometer : null;

  const kmWarning = km && lastKm && parseInt(km) <= parseInt(lastKm);

  return (
    <Sheet onClose={onClose} title="Tankbeleg hochladen">
      <Dropdown label="Fahrzeug" value={carId} onChange={e=>setCarId(e.target.value)}>
        <option value="">– Fahrzeug wählen –</option>
        {cars.map(c=><option key={c.id} value={c.id}>{c.license_plate} – {c.name}</option>)}
      </Dropdown>
      <Field label="Betrag (Euro)" type="number" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)}/>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:5}}>Kilometerstand (Pflicht)</div>
        <input type="number" value={km} onChange={e=>setKm(e.target.value)} placeholder="z.B. 45000"
          style={{
            width:"100%", border:`1.5px solid ${kmWarning?C.danger:C.border}`, borderRadius:10,
            padding:"11px 14px", fontSize:15, fontFamily:"inherit", color:C.text,
            background:"#F8FAFC", boxSizing:"border-box", outline:"none",
          }}/>
        {lastKm && <div style={{fontSize:12,color:C.muted,marginTop:4}}>Letzter Stand: {parseInt(lastKm).toLocaleString("de-DE")} km</div>}
        {kmWarning && <div style={{fontSize:12,color:C.danger,fontWeight:700,marginTop:4}}>Warnung: KM-Stand niedriger als beim letzten Mal!</div>}
      </div>
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
          : <><span style={{fontSize:32}}>📷</span><span style={{color:C.muted,fontSize:14,fontWeight:500}}>Foto aufnehmen oder auswählen</span></>
        }
        <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handlePhoto}/>
      </label>
      <div style={{display:"flex",gap:10}}>
        <Btn variant="secondary" onClick={onClose}>Abbrechen</Btn>
        <Btn variant="amber" disabled={!carId||!amount||!date||!km} onClick={()=>onSave({vehicle_id:carId,amount,odometer:parseInt(km),date,note,receipt_url:img})}>
          Speichern
        </Btn>
      </div>
    </Sheet>
  );
}function CarSheet({onClose, onSave}) {
  const [plate,setPlate] = useState("");
  const [model,setModel] = useState("");
  return (
    <Sheet onClose={onClose} title="Fahrzeug hinzufügen">
      <Field label="Kennzeichen" placeholder="z.B. B-FM 1234" value={plate} onChange={e=>setPlate(e.target.value.toUpperCase())}/>
      <Field label="Modell" placeholder="z.B. VW Passat" value={model} onChange={e=>setModel(e.target.value)}/>
      <div style={{display:"flex",gap:10}}>
        <Btn variant="secondary" onClick={onClose}>Abbrechen</Btn>
        <Btn disabled={!plate||!model} onClick={()=>onSave({license_plate:plate,name:model})}>Hinzufügen</Btn>
      </div>
    </Sheet>
  );
}

function ImgSheet({receipt, onClose}) {
  return (
    <Sheet onClose={onClose} title="Tankbeleg">
      {receipt.receipt_url && <img src={receipt.receipt_url} style={{width:"100%",borderRadius:12,marginBottom:14}} alt="Beleg"/>}
      <div style={{fontWeight:700,fontSize:16}}>{parseFloat(receipt.amount).toFixed(2).replace(".",",")} Euro</div>
      <div style={{fontSize:13,color:C.muted,marginTop:4}}>{receipt.note}</div>
      <div style={{marginTop:16}}><Btn variant="secondary" full onClick={onClose}>Schließen</Btn></div>
    </Sheet>
  );
}

function KmSheet({car, receipts, users, onClose}) {
  const carReceipts = [...receipts.filter(r=>r.vehicle_id===car.id&&r.odometer)]
    .sort((a,b)=>new Date(a.date)-new Date(b.date));
  return (
    <Sheet onClose={onClose} title={`KM-Verlauf: ${car.license_plate}`}>
      {carReceipts.length===0 ? (
        <div style={{textAlign:"center",color:C.muted,padding:"20px 0"}}>Noch keine KM-Daten vorhanden.</div>
      ) : (
        carReceipts.map((r,i)=>{
          const prev = carReceipts[i-1];
          const diff = prev ? parseInt(r.odometer)-parseInt(prev.odometer) : null;
          const warning = diff !== null && diff <= 0;
          const uploader = users.find(u=>u.id===r.employee_id);
          return (
            <div key={r.id} style={{
              borderBottom:`1px solid ${C.border}`, paddingBottom:12, marginBottom:12,
              borderLeft:`3px solid ${warning?C.danger:diff>500?C.success:C.accent}`,
              paddingLeft:12,
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontWeight:800,fontSize:16,color:C.text}}>{parseInt(r.odometer).toLocaleString("de-DE")} km</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>{new Date(r.date).toLocaleDateString("de-DE")} · {uploader?.name}</div>
                  {r.note && <div style={{fontSize:12,color:C.muted}}>{r.note}</div>}
                </div>
                <div style={{textAlign:"right"}}>
                  {diff !== null ? (
                    <div style={{fontWeight:700,fontSize:14,color:warning?C.danger:C.success}}>
                      {warning ? "Warnung!" : `+${diff.toLocaleString("de-DE")} km`}
                    </div>
                  ) : (
                    <div style={{fontSize:12,color:C.muted}}>Start</div>
                  )}
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>{parseFloat(r.amount).toFixed(2).replace(".",",")} Euro</div>
                </div>
              </div>
              {warning && (
                <div style={{background:"#FEE2E2",color:C.danger,borderRadius:8,padding:"6px 10px",fontSize:12,fontWeight:700,marginTop:8}}>
                  KM-Stand niedriger als vorheriger Eintrag!
                </div>
              )}
            </div>
          );
        })
      )}
      <Btn variant="secondary" full onClick={onClose}>Schließen</Btn>
    </Sheet>
  );
}export default function App() {
  const [user,setUser]           = useState(null);
  const [tab,setTab]             = useState("cars");
  const [users,setUsers]         = useState([]);
  const [cars,setCars]           = useState([]);
  const [handovers,setHandovers] = useState([]);
  const [receipts,setReceipts]   = useState([]);
  const [modal,setModal]         = useState(null);
  const [selected,setSelected]   = useState(null);
  const [viewReceipt,setViewReceipt] = useState(null);
  const [kmCar,setKmCar]         = useState(null);
  const [loading,setLoading]     = useState(false);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [{ data: emp }, { data: veh }, { data: han }, { data: rec }] = await Promise.all([
      supabase.from("employees").select("*"),
      supabase.from("vehicles").select("*"),
      supabase.from("handovers").select("*"),
      supabase.from("fuel_receipts").select("*"),
    ]);
    if (emp) setUsers(emp);
    if (veh) setCars(veh);
    if (han) setHandovers(han);
    if (rec) setReceipts(rec);
    setLoading(false);
  };

  if (!user) return <AuthScreen onLogin={setUser}/>;

  const findUser = id => users.find(u=>u.id===id);
  const userCar  = cars.find(c=>c.driver_id===user.id);
  const pending  = users.filter(u=>u.approved===false);

  const approveUser = async id => {
    await supabase.from("employees").update({approved:true}).eq("id",id);
    setUsers(p=>p.map(u=>u.id===id?{...u,approved:true}:u));
  };
  const rejectUser = async id => {
    await supabase.from("employees").delete().eq("id",id);
    setUsers(p=>p.filter(u=>u.id!==id));
  };

  const tabs = [
    {id:"cars",     label:"Fahrzeuge", icon:"🚗"},
    {id:"handover", label:"Übergabe",  icon:"🔄"},
    {id:"receipts", label:"Belege",    icon:"⛽"},
    {id:"profile",  label:"Profil",    icon:"👤"},
  ];

  const myReceipts = receipts.filter(r=>r.employee_id===user.id);

  const getKmWarning = (vehicleId) => {
    const carReceipts = [...receipts.filter(r=>r.vehicle_id===vehicleId&&r.odometer)]
      .sort((a,b)=>new Date(a.date)-new Date(b.date));
    for (let i=1;i<carReceipts.length;i++) {
      if (parseInt(carReceipts[i].odometer)<=parseInt(carReceipts[i-1].odometer)) return true;
    }
    return false;
  };

  return (
    <div style={{fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif",background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
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
              <span style={{background:C.danger,color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:800}}>{pending.length} neu</span>
            )}
            {user.role==="admin" && (
              <span style={{background:C.accent,color:C.navy,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:800}}>CHEF</span>
            )}
          </div>
        </div>
      </div>

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

      <div style={{padding:"16px 16px 100px"}}>
        {loading && <div style={{textAlign:"center",padding:40,color:C.muted}}>Laden...</div>}

        {!loading && tab==="cars" && (
          <>
            {user.role==="admin" && pending.length>0 && (
              <>
                <SectionTitle>Neue Registrierungen ({pending.length})</SectionTitle>
                {pending.map(u=>(
                  <Card key={u.id} accent={C.accent}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:15}}>{u.name}</div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <Btn variant="danger" small onClick={()=>rejectUser(u.id)}>Ablehnen</Btn>
                        <Btn variant="success" small onClick={()=>approveUser(u.id)}>Freischalten</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
            <SectionTitle>Alle Fahrzeuge ({cars.length})</SectionTitle>
            {cars.map(car=>{
              const driver  = findUser(car.driver_id);
              const count   = receipts.filter(r=>r.vehicle_id===car.id).length;
              const hasWarn = user.role==="admin" && getKmWarning(car.id);
              const lastKm  = [...receipts.filter(r=>r.vehicle_id===car.id&&r.odometer)]
                .sort((a,b)=>new Date(b.date)-new Date(a.date))[0]?.odometer;
              return (
                <Card key={car.id} accent={hasWarn?C.danger:"#DBEAFE"}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Plate text={car.license_plate}/>
                    {driver
                      ? <span style={{background:"#DBEAFE",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:C.navyMid}}>👤 {driver.name}</span>
                      : <span style={{background:"#FEE2E2",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:"#991B1B"}}>Frei</span>
                    }
                  </div>
                  <div style={{fontWeight:600,fontSize:14,color:C.text,marginBottom:4}}>{car.name}</div>
                  {lastKm && (
                    <div style={{fontSize:12,color:C.muted,marginBottom:6}}>
                      Letzter KM-Stand: <strong>{parseInt(lastKm).toLocaleString("de-DE")} km</strong>
                      {hasWarn && <span style={{color:C.danger,fontWeight:700,marginLeft:8}}>Auffälligkeit!</span>}
                    </div>
                  )}
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                    <Tag color={C.accent}>{count} Beleg{count!==1?"e":""}</Tag>
                    {user.role==="admin" && (
                      <button onClick={()=>{setKmCar(car);setModal("km");}} style={{
                        background:hasWarn?"#FEE2E2":C.bg, color:hasWarn?C.danger:C.text,
                        border:"none",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",
                      }}>{hasWarn?"⚠️ KM prüfen":"📊 KM-Verlauf"}</button>
                    )}
                    {(user.role==="admin"||car.driver_id===user.id) && (
                      <button onClick={()=>{setSelected(car);setModal("handover");}} style={{
                        background:C.bg,color:C.text,border:"none",borderRadius:8,
                        padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",
                      }}>🔄 Übergabe</button>
                    )}
                    {user.role==="admin" && (
                      <button onClick={async()=>{
                        await supabase.from("vehicles").delete().eq("id",car.id);
                        setCars(p=>p.filter(c=>c.id!==car.id));
                      }} style={{
                        background:"#FEE2E2",color:C.danger,border:"none",borderRadius:8,
                        padding:"5px 10px",fontSize:12,cursor:"pointer",fontFamily:"inherit",
                      }}>🗑</button>
                    )}
                  </div>
                </Card>
              );
            })}
            {user.role==="admin" && <Btn full onClick={()=>setModal("car-add")}>+ Fahrzeug hinzufügen</Btn>}
          </>
        )}

        {!loading && tab==="handover" && (
          <>
            <SectionTitle>Übergabe-Historie</SectionTitle>
            {[...handovers].reverse().map(h=>{
              const car = cars.find(c=>c.id===h.vehicle_id);
              const to  = findUser(h.employee_id);
              if (user.role!=="admin"&&h.employee_id!==user.id) return null;
              return (
                <Card key={h.id}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <Plate text={car?.license_plate}/>
                    <span style={{fontSize:12,color:C.muted}}>{car?.name}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13}}>
                    <span style={{color:C.blue,fontWeight:800}}>→</span>
                    <span style={{background:"#DBEAFE",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:C.navyMid}}>{to?.name}</span>
                  </div>
                  <div style={{fontSize:12,color:C.muted,marginTop:8}}>
                    {new Date(h.date).toLocaleDateString("de-DE")}{h.note?` · ${h.note}`:""}
                  </div>
                </Card>
              );
            })}
            <Btn full onClick={()=>{setSelected(null);setModal("handover");}}>+ Neue Übergabe eintragen</Btn>
          </>
        )}

        {!loading && tab==="receipts" && (
          <>
            {user.role==="admin" ? (
              <>
                <SectionTitle>Alle Belege ({receipts.length})</SectionTitle>
                <button onClick={()=>{
                  const rows = ["Datum,Betrag,KM-Stand,Kennzeichen,Mitarbeiter,Notiz",
                    ...receipts.map(r=>{
                      const car=cars.find(c=>c.id===r.vehicle_id);
                      const u=findUser(r.employee_id);
                      return `${r.date},${r.amount},${r.odometer||""},${car?.license_plate||""},${u?.name||""},${r.note||""}`;
                    })
                  ].join("\n");
                  const blob=new Blob([rows],{type:"text/csv"});
                  const a=document.createElement("a");
                  a.href=URL.createObjectURL(blob);
                  a.download="tankbelege.csv";
                  a.click();
                }} style={{
                  background:C.success+"22",color:C.success,border:`1.5px solid ${C.success}33`,
                  borderRadius:10,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",
                  fontFamily:"inherit",width:"100%",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                }}>Alle Belege als Excel/CSV herunterladen</button>
                {receipts.map(r=>{
                  const car=cars.find(c=>c.id===r.vehicle_id);
                  const uploader=findUser(r.employee_id);
                  const prevReceipt=[...receipts.filter(x=>x.vehicle_id===r.vehicle_id&&x.odometer&&new Date(x.date)<new Date(r.date))]
                    .sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
                  const kmWarn = r.odometer && prevReceipt && parseInt(r.odometer)<=parseInt(prevReceipt.odometer);
                  return (
                    <Card key={r.id} accent={kmWarn?C.danger:undefined}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div>
                          <div style={{fontWeight:800,fontSize:17,color:C.text}}>{parseFloat(r.amount).toFixed(2).replace(".",",")} Euro</div>
                          <div style={{fontSize:12,color:C.muted,marginTop:2}}>{new Date(r.date).toLocaleDateString("de-DE")} · {car?.license_plate}</div>
                          <div style={{fontSize:12,color:C.muted}}>👤 {uploader?.name}</div>
                          {r.odometer && <div style={{fontSize:12,fontWeight:700,color:kmWarn?C.danger:C.muted,marginTop:2}}>{kmWarn?"⚠️ ":""}{parseInt(r.odometer).toLocaleString("de-DE")} km{kmWarn&&" – KM auffällig!"}</div>}
                          {r.note&&<div style={{fontSize:13,color:C.text,marginTop:4}}>{r.note}</div>}
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                          {r.receipt_url
                            ? <img src={r.receipt_url} onClick={()=>{setViewReceipt(r);setModal("img");}} style={{width:60,height:60,borderRadius:10,objectFit:"cover",border:`2px solid ${C.border}`,cursor:"pointer"}} alt="Beleg"/>
                            : <div style={{width:60,height:60,borderRadius:10,background:"#F1F5F9",border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.muted,textAlign:"center",padding:4}}>Kein Foto</div>
                          }
                          <button onClick={async()=>{
                            await supabase.from("fuel_receipts").delete().eq("id",r.id);
                            setReceipts(p=>p.filter(x=>x.id!==r.id));
                          }} style={{background:"#FEE2E2",color:C.danger,border:"none",borderRadius:8,padding:"4px 10px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>🗑</button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </>
            ) : (
              <>
                <SectionTitle>Meine Belege ({myReceipts.length})</SectionTitle>
                {myReceipts.length===0 && <Card><div style={{textAlign:"center",color:C.muted,padding:"20px 0",fontSize:14}}>Noch keine Belege hochgeladen.</div></Card>}
                {myReceipts.map(r=>{
                  const car=cars.find(c=>c.id===r.vehicle_id);
                  return (
                    <Card key={r.id}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div>
                          <div style={{fontWeight:800,fontSize:17}}>{parseFloat(r.amount).toFixed(2).replace(".",",")} Euro</div>
                          <div style={{fontSize:12,color:C.muted,marginTop:2}}>{new Date(r.date).toLocaleDateString("de-DE")} · {car?.license_plate}</div>
                          {r.odometer && <div style={{fontSize:12,color:C.muted,marginTop:2}}>{parseInt(r.odometer).toLocaleString("de-DE")} km</div>}
                          {r.note&&<div style={{fontSize:13,color:C.text,marginTop:4}}>{r.note}</div>}
                        </div>
                        {r.receipt_url
                          ? <img src={r.receipt_url} onClick={()=>{setViewReceipt(r);setModal("img");}} style={{width:60,height:60,borderRadius:10,objectFit:"cover",border:`2px solid ${C.border}`,cursor:"pointer"}} alt="Beleg"/>
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

        {!loading && tab==="profile" && (
          <>
            <Card style={{textAlign:"center",padding:"28px 20px"}}>
              <div style={{
                width:70,height:70,borderRadius:"50%",
                background:`linear-gradient(135deg, ${C.blue}, ${C.navyMid})`,
                margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:28,fontWeight:800,color:"#fff",
              }}>{user.name.charAt(0)}</div>
              <div style={{fontWeight:800,fontSize:20}}>{user.name}</div>
              <div style={{marginTop:12}}>
                <Tag color={user.role==="admin"?C.accent:C.blue}>{user.role==="admin"?"👑 Administrator":"🚗 Fahrer"}</Tag>
              </div>
            </Card>
            {userCar && (
              <Card>
                <SectionTitle>Mein Fahrzeug</SectionTitle>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Plate text={userCar.license_plate}/>
                  <span style={{fontWeight:600}}>{userCar.name}</span>
                </div>
              </Card>
            )}
            {user.role==="admin" && (
              <>
                <Card>
                  <SectionTitle>Übersicht</SectionTitle>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {[
                      {label:"Fahrzeuge",  val:cars.length},
                      {label:"Belegt",     val:cars.filter(c=>c.driver_id).length},
                      {label:"Mitarbeiter",val:users.filter(u=>u.role!=="admin"&&u.approved===true).length},
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
                    <div key={u.id} style={{paddingBottom:12,marginBottom:12,borderBottom:`1px solid ${C.border}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div style={{fontWeight:600,fontSize:14}}>{u.name}</div>
                        <Tag color={u.approved===true?C.success:C.accent}>{u.approved===true?"Aktiv":"Ausstehend"}</Tag>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={async()=>{
                          const newPin = prompt(`Neue PIN fuer ${u.name}:`);
                          if (newPin && newPin.length>=4) {
                            await supabase.from("employees").update({pin:newPin}).eq("id",u.id);
                            setUsers(p=>p.map(x=>x.id===u.id?{...x,pin:newPin}:x));
                            alert(`PIN fuer ${u.name} wurde geaendert.`);
                          } else if (newPin) { alert("PIN muss mindestens 4 Ziffern haben."); }
                        }} style={{background:"#DBEAFE",color:C.blue,border:"none",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>PIN aendern</button>
                        <button onClick={async()=>{
                          if (window.confirm(`${u.name} wirklich loeschen?`)) {
                            await supabase.from("employees").delete().eq("id",u.id);
                            setUsers(p=>p.filter(x=>x.id!==u.id));
                          }
                        }} style={{background:"#FEE2E2",color:C.danger,border:"none",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Loeschen</button>
                      </div>
                    </div>
                  ))}
                </Card>
              </>
            )}
            <Btn full variant="danger" onClick={()=>setUser(null)}>Abmelden</Btn>
          </>
        )}
      </div>

      {modal==="handover" && (
        <HandoverSheet cars={cars} users={users} currentUser={user} preselectedCar={selected}
          onClose={()=>setModal(null)}
          onSave={async h=>{
            const { data } = await supabase.from("handovers").insert(h).select().single();
            if (data) setHandovers(p=>[...p,data]);
            await supabase.from("vehicles").update({driver_id:h.employee_id}).eq("id",h.vehicle_id);
            setCars(p=>p.map(c=>c.id===h.vehicle_id?{...c,driver_id:h.employee_id}:c));
            setModal(null); setTab("handover");
          }}/>
      )}
      {modal==="receipt" && (
        <ReceiptSheet cars={cars} currentUser={user} receipts={receipts} onClose={()=>setModal(null)}
          onSave={async r=>{
            const { data } = await supabase.from("fuel_receipts").insert({...r,employee_id:user.id}).select().single();
            if (data) setReceipts(p=>[...p,data]);
            setModal(null);
          }}/>
      )}
      {modal==="car-add" && (
        <CarSheet onClose={()=>setModal(null)}
          onSave={async c=>{
            const { data } = await supabase.from("vehicles").insert(c).select().single();
            if (data) setCars(p=>[...p,data]);
            setModal(null);
          }}/>
      )}
      {modal==="img" && viewReceipt && <ImgSheet receipt={viewReceipt} onClose={()=>setModal(null)}/>}
      {modal==="km" && kmCar && <KmSheet car={kmCar} receipts={receipts} users={users} onClose={()=>setModal(null)}/>}
    </div>
  );
}