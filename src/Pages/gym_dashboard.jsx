import { useState, useEffect, useRef } from "react";

const TRAINERS = [
  { id: 1, name: "Arjun Sharma", specialty: "Strength & Powerlifting", exp: "8 yrs", rating: 4.9, fee: 3500, slots: "6AM–10AM", avatar: "AS", color: "#1a6b3c" },
  { id: 2, name: "Priya Mehta", specialty: "Yoga & Flexibility", exp: "6 yrs", rating: 4.8, fee: 2800, slots: "7AM–1PM", avatar: "PM", color: "#7b3f9e" },
  { id: 3, name: "Rohan Verma", specialty: "HIIT & Cardio", exp: "5 yrs", rating: 4.7, fee: 3200, slots: "5AM–11AM", avatar: "RV", color: "#b04b00" },
  { id: 4, name: "Neha Singh", specialty: "Weight Loss & Nutrition", exp: "7 yrs", rating: 4.9, fee: 3800, slots: "8AM–2PM", avatar: "NS", color: "#1a5070" },
  { id: 5, name: "Karan Patel", specialty: "Bodybuilding", exp: "10 yrs", rating: 5.0, fee: 4500, slots: "4AM–10AM", avatar: "KP", color: "#7a1a1a" },
];

const PLANS = {
  gold: { name: "Gold Plan", color: "#b8860b", bg: "#fffbea", months: 6, fee: 3600, perks: ["Unlimited access", "2 guest passes/mo", "Locker included", "Pool access"] },
  platinum: { name: "Platinum Plan", color: "#5c7fa3", bg: "#eef4fb", months: 12, fee: 6000, perks: ["Everything in Gold", "4 guest passes/mo", "Sauna access", "Priority booking", "Free protein shake/day"] },
  basic: { name: "Basic Plan", color: "#4a7c59", bg: "#eef7f1", months: 3, fee: 1800, perks: ["Access 6AM–9PM", "Locker included"] },
};

const USER = {
  name: "Vikram Nair",
  avatar: "VN",
  plan: "gold",
  joinDate: "2025-01-06",
  paidFee: 3600,
  pauseDaysUsed: 3,
  pauseDaysTotal: 7,
  attendance: [1,1,0,1,1,0,0,1,1,1,0,1,1,0,0,1,1,0,1,1,0,0,1,1,0,1,1,0],
  workouts: { strength: 18, cardio: 12, yoga: 5, hiit: 9 },
};

function PieChart({ monthsLeft, totalMonths }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 18;
    ctx.clearRect(0, 0, W, H);
    const used = totalMonths - monthsLeft;
    const usedAngle = (used / totalMonths) * Math.PI * 2;
    const leftAngle = (monthsLeft / totalMonths) * Math.PI * 2;
    const startAngle = -Math.PI / 2;

    // Used slice
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + usedAngle);
    ctx.closePath();
    ctx.fillStyle = "#e0e0d8";
    ctx.fill();

    // Remaining slice
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle + usedAngle, startAngle + usedAngle + leftAngle);
    ctx.closePath();
    ctx.fillStyle = "#c9a227";
    ctx.fill();

    // Inner circle (donut)
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Center text
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(monthsLeft, cx, cy - 8);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#888";
    ctx.fillText("months left", cx, cy + 12);
  }, [monthsLeft, totalMonths]);

  return <canvas ref={canvasRef} width={180} height={180} style={{ display: "block" }} aria-label={`${monthsLeft} of ${totalMonths} months remaining`} />;
}

function AttendanceGrid({ data }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {data.map((d, i) => (
        <div key={i} style={{
          width: 14, height: 14, borderRadius: 3,
          background: d ? "#c9a227" : "#f0ede6",
          title: d ? "Present" : "Absent"
        }} title={d ? "Present" : "Absent"} />
      ))}
    </div>
  );
}

function WorkoutBar({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
        <span style={{ color: "#555" }}>{label}</span>
        <span style={{ fontWeight: 600, color: "#333" }}>{value}</span>
      </div>
      <div style={{ background: "#f0ede6", borderRadius: 99, height: 7 }}>
        <div style={{ height: 7, borderRadius: 99, background: color, width: `${(value / max) * 100}%`, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

export default function GymDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [trainerDropdown, setTrainerDropdown] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [allocatedTrainer, setAllocatedTrainer] = useState(null);
  const [paymentStep, setPaymentStep] = useState(null); // null | "confirm" | "success"
  const [notification, setNotification] = useState(null);
  const [pauseModal, setPauseModal] = useState(false);
  const [pauseDays, setPauseDays] = useState(1);

  const plan = PLANS[USER.plan];
  const joinDate = new Date(USER.joinDate);
  const endDate = new Date(joinDate);
  endDate.setMonth(endDate.getMonth() + plan.months);
  const today = new Date();
  const msLeft = endDate - today;
  const monthsLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24 * 30)));
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
  const pauseRemaining = USER.pauseDaysTotal - USER.pauseDaysUsed;

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAllocate = () => {
    setAllocatedTrainer(selectedTrainer);
    setPaymentStep("success");
    showNotif(`${selectedTrainer.name} has been assigned to you!`);
    setTimeout(() => setPaymentStep(null), 2000);
  };

  const tabs = [
    { id: "dashboard", icon: "ti-layout-dashboard", label: "Dashboard" },
    { id: "trainer", icon: "ti-user-star", label: "Trainer" },
    { id: "activity", icon: "ti-chart-bar", label: "Activity" },
    { id: "settings", icon: "ti-settings", label: "Settings" },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#faf8f3", minHeight: "100vh", color: "#1a1a1a" }}>
      <h2 className="sr-only">Gym Management Dashboard for Vikram Nair</h2>

      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          background: notification.type === "success" ? "#1a6b3c" : "#b04b00",
          color: "#fff", borderRadius: 10, padding: "12px 20px",
          fontSize: 14, fontFamily: "sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          animation: "fadeIn 0.3s ease"
        }}>
          <i className="ti ti-check" style={{ marginRight: 8 }} />{notification.msg}
        </div>
      )}

      {/* Sidebar */}
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div style={{
          width: 220, background: "#1a1a18", color: "#fff", display: "flex", flexDirection: "column",
          padding: "0 0 24px", position: "sticky", top: 0, height: "100vh", flexShrink: 0
        }}>
          {/* Logo */}
          <div style={{ padding: "28px 24px 20px", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: "#c9a227" }}>
              <i className="ti ti-bolt" style={{ marginRight: 8, fontSize: 18 }} />IRONEDGE
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2, fontFamily: "sans-serif", letterSpacing: "0.12em" }}>FITNESS STUDIO</div>
          </div>

          {/* User */}
          <div style={{ padding: "20px 24px", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#c9a227", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 14, fontFamily: "sans-serif"
              }}>{USER.avatar}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f5f5f0" }}>{USER.name}</div>
                <div style={{ fontSize: 11, color: "#888", fontFamily: "sans-serif" }}>{plan.name}</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "16px 12px" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                background: tab === t.id ? "rgba(201,162,39,0.15)" : "transparent",
                color: tab === t.id ? "#c9a227" : "#aaa",
                fontSize: 14, fontFamily: "sans-serif", transition: "all 0.2s",
                borderLeft: tab === t.id ? "2px solid #c9a227" : "2px solid transparent",
                marginBottom: 4
              }}>
                <i className={`ti ${t.icon}`} style={{ fontSize: 18 }} />
                {t.label}
              </button>
            ))}
          </nav>

          <div style={{ padding: "0 16px" }}>
            <div style={{
              background: "rgba(201,162,39,0.1)", borderRadius: 10, padding: "14px",
              border: "0.5px solid rgba(201,162,39,0.25)"
            }}>
              <div style={{ fontSize: 11, color: "#888", fontFamily: "sans-serif", marginBottom: 6 }}>SUBSCRIPTION ENDS</div>
              <div style={{ fontSize: 13, color: "#c9a227", fontFamily: "sans-serif" }}>
                {endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 4, fontFamily: "sans-serif" }}>{daysLeft} days remaining</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>

          {/* =================== DASHBOARD TAB =================== */}
          {tab === "dashboard" && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>Good morning, Vikram 👋</div>
                <div style={{ fontSize: 14, color: "#888", fontFamily: "sans-serif", marginTop: 4 }}>
                  {today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>

              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Current Plan", value: plan.name, icon: "ti-crown", color: "#c9a227", sub: "Active" },
                  { label: "Fee Paid", value: `₹${USER.paidFee.toLocaleString()}`, icon: "ti-receipt", color: "#1a6b3c", sub: "This cycle" },
                  { label: "Months Left", value: monthsLeft, icon: "ti-calendar", color: "#1a5070", sub: `of ${plan.months} months` },
                  { label: "Pause Days Left", value: pauseRemaining, icon: "ti-player-pause", color: "#7b3f9e", sub: `${USER.pauseDaysUsed} used` },
                ].map((c, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 14, padding: "18px 16px",
                    border: "0.5px solid #e8e4dc", cursor: "default"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.label}</div>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: c.color + "18", display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <i className={`ti ${c.icon}`} style={{ color: c.color, fontSize: 16 }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>{c.value}</div>
                    <div style={{ fontSize: 12, color: "#aaa", fontFamily: "sans-serif", marginTop: 4 }}>{c.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
                {/* Pie chart */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "0.5px solid #e8e4dc" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Subscription Status</div>
                  <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginBottom: 20 }}>Time remaining in current plan</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <PieChart monthsLeft={monthsLeft} totalMonths={plan.months} />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: "#c9a227" }} />
                        <span style={{ fontSize: 13, fontFamily: "sans-serif", color: "#555" }}>Remaining ({monthsLeft} mo)</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: "#e0e0d8" }} />
                        <span style={{ fontSize: 13, fontFamily: "sans-serif", color: "#555" }}>Used ({plan.months - monthsLeft} mo)</span>
                      </div>
                      {monthsLeft <= 2 && (
                        <div style={{
                          background: "#fff7e6", border: "0.5px solid #f5c842", borderRadius: 8,
                          padding: "10px 14px", fontSize: 12, fontFamily: "sans-serif", color: "#7a5000"
                        }}>
                          <i className="ti ti-alert-triangle" style={{ marginRight: 6 }} />
                          Renew soon!
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setTab("settings")} style={{
                    marginTop: 16, width: "100%", padding: "10px", borderRadius: 8,
                    border: "0.5px solid #c9a227", background: "transparent", color: "#c9a227",
                    fontFamily: "sans-serif", fontSize: 13, cursor: "pointer"
                  }}>Renew Plan ↗</button>
                </div>

                {/* Plan details */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "0.5px solid #e8e4dc" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>Your Plan</div>
                      <div style={{
                        display: "inline-block", marginTop: 6, padding: "3px 12px", borderRadius: 99,
                        background: plan.bg, color: plan.color, fontSize: 12, fontFamily: "sans-serif", fontWeight: 600
                      }}>{plan.name}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>₹{plan.fee.toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>/ {plan.months} months</div>
                    </div>
                  </div>
                  <div style={{ borderTop: "0.5px solid #f0ede6", paddingTop: 16 }}>
                    <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginBottom: 10 }}>PLAN PERKS</div>
                    {plan.perks.map((p, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <i className="ti ti-circle-check" style={{ color: "#1a6b3c", fontSize: 16 }} />
                        <span style={{ fontSize: 14, fontFamily: "sans-serif", color: "#444" }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  {/* Pause days */}
                  <div style={{
                    marginTop: 16, background: "#f8f6f0", borderRadius: 10, padding: "14px",
                    border: "0.5px solid #e8e4dc"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontFamily: "sans-serif", color: "#555" }}>Pause Days</span>
                      <span style={{ fontSize: 13, fontFamily: "sans-serif", fontWeight: 600 }}>{USER.pauseDaysUsed}/{USER.pauseDaysTotal} used</span>
                    </div>
                    <div style={{ background: "#e8e4dc", borderRadius: 99, height: 6 }}>
                      <div style={{ height: 6, borderRadius: 99, background: "#7b3f9e", width: `${(USER.pauseDaysUsed / USER.pauseDaysTotal) * 100}%` }} />
                    </div>
                    <button onClick={() => setPauseModal(true)} style={{
                      marginTop: 12, width: "100%", padding: "8px", borderRadius: 8,
                      border: "0.5px solid #7b3f9e", background: "transparent", color: "#7b3f9e",
                      fontFamily: "sans-serif", fontSize: 12, cursor: "pointer"
                    }}>Request Pause Day</button>
                  </div>
                </div>
              </div>

              {/* Attendance + Trainer */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "0.5px solid #e8e4dc" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Attendance (last 28 days)</div>
                  <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginBottom: 16 }}>
                    {USER.attendance.filter(Boolean).length} days present
                  </div>
                  <AttendanceGrid data={USER.attendance} />
                  <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                    {[["#c9a227", "Present"], ["#f0ede6", "Absent"]].map(([col, lab]) => (
                      <div key={lab} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "sans-serif", color: "#888" }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: col }} />
                        {lab}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "0.5px solid #e8e4dc" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Personal Trainer</div>
                  {allocatedTrainer ? (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: "50%",
                          background: allocatedTrainer.color, color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: 16, fontFamily: "sans-serif"
                        }}>{allocatedTrainer.avatar}</div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 600 }}>{allocatedTrainer.name}</div>
                          <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif", marginTop: 2 }}>{allocatedTrainer.specialty}</div>
                          <div style={{ fontSize: 11, color: "#c9a227", fontFamily: "sans-serif", marginTop: 4 }}>★ {allocatedTrainer.rating} · {allocatedTrainer.slots}</div>
                        </div>
                      </div>
                      <button onClick={() => { setAllocatedTrainer(null); setTab("trainer"); }} style={{
                        marginTop: 16, width: "100%", padding: "8px", borderRadius: 8,
                        border: "0.5px solid #e8e4dc", background: "transparent", color: "#888",
                        fontFamily: "sans-serif", fontSize: 12, cursor: "pointer"
                      }}>Change trainer</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 13, color: "#aaa", fontFamily: "sans-serif", marginTop: 8, marginBottom: 16 }}>No trainer assigned yet</div>
                      <button onClick={() => setTab("trainer")} style={{
                        padding: "10px 20px", borderRadius: 8,
                        border: "0.5px solid #c9a227", background: "#c9a22710", color: "#c9a227",
                        fontFamily: "sans-serif", fontSize: 13, cursor: "pointer"
                      }}>Assign a Trainer ↗</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =================== TRAINER TAB =================== */}
          {tab === "trainer" && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>Personal Trainers</div>
                <div style={{ fontSize: 14, color: "#888", fontFamily: "sans-serif", marginTop: 4 }}>Choose and book your personal coach</div>
              </div>

              {/* Quick select dropdown */}
              <div style={{ marginBottom: 24, position: "relative", maxWidth: 380 }}>
                <div style={{ fontSize: 13, color: "#666", fontFamily: "sans-serif", marginBottom: 8 }}>Quick select from dropdown</div>
                <button onClick={() => setTrainerDropdown(!trainerDropdown)} style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10, border: "0.5px solid #c9a227",
                  background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer", fontFamily: "sans-serif", fontSize: 14, color: selectedTrainer ? "#1a1a1a" : "#aaa"
                }}>
                  {selectedTrainer ? selectedTrainer.name : "Select a personal trainer…"}
                  <i className={`ti ti-chevron-${trainerDropdown ? "up" : "down"}`} style={{ fontSize: 16 }} />
                </button>
                {trainerDropdown && (
                  <div style={{
                    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
                    background: "#fff", borderRadius: 10, border: "0.5px solid #e8e4dc",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)", overflow: "hidden", marginTop: 4
                  }}>
                    {TRAINERS.map(t => (
                      <div key={t.id} onClick={() => { setSelectedTrainer(t); setTrainerDropdown(false); }} style={{
                        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
                        cursor: "pointer", borderBottom: "0.5px solid #f5f2ec",
                        background: selectedTrainer?.id === t.id ? "#fffbea" : "#fff",
                        transition: "background 0.15s"
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = "#faf8f3"}
                        onMouseLeave={e => e.currentTarget.style.background = selectedTrainer?.id === t.id ? "#fffbea" : "#fff"}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%", background: t.color,
                          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0
                        }}>{t.avatar}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>{t.specialty} · ★{t.rating}</div>
                        </div>
                        <div style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: "#c9a227", fontFamily: "sans-serif" }}>₹{t.fee}/mo</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trainer cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {TRAINERS.map(t => (
                  <div key={t.id} onClick={() => setSelectedTrainer(selectedTrainer?.id === t.id ? null : t)} style={{
                    background: "#fff", borderRadius: 14, padding: "20px",
                    border: selectedTrainer?.id === t.id ? "1.5px solid #c9a227" : "0.5px solid #e8e4dc",
                    cursor: "pointer", transition: "all 0.2s",
                    boxShadow: selectedTrainer?.id === t.id ? "0 0 0 3px rgba(201,162,39,0.1)" : "none"
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: "50%", background: t.color,
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: 16, fontFamily: "sans-serif", flexShrink: 0
                      }}>{t.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif", marginTop: 2 }}>{t.specialty}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                          <span style={{ fontSize: 11, fontFamily: "sans-serif", color: "#c9a227" }}>★ {t.rating}</span>
                          <span style={{ fontSize: 11, fontFamily: "sans-serif", color: "#aaa" }}>·</span>
                          <span style={{ fontSize: 11, fontFamily: "sans-serif", color: "#888" }}>{t.exp} exp</span>
                        </div>
                      </div>
                      {allocatedTrainer?.id === t.id && (
                        <div style={{
                          fontSize: 10, fontFamily: "sans-serif", background: "#eef7f1",
                          color: "#1a6b3c", borderRadius: 99, padding: "3px 8px", fontWeight: 600
                        }}>ASSIGNED</div>
                      )}
                    </div>
                    <div style={{ borderTop: "0.5px solid #f5f2ec", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>
                        <i className="ti ti-clock" style={{ marginRight: 4 }} />{t.slots}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>₹{t.fee}<span style={{ fontSize: 11, color: "#aaa", fontWeight: 400 }}>/mo</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Book button */}
              {selectedTrainer && (
                <div style={{
                  marginTop: 24, background: "#fff", borderRadius: 14, padding: "24px",
                  border: "0.5px solid #e8e4dc", display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Book {selectedTrainer.name}</div>
                    <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginTop: 4 }}>
                      {selectedTrainer.specialty} · ₹{selectedTrainer.fee}/month
                    </div>
                  </div>
                  {paymentStep === "success" ? (
                    <div style={{ color: "#1a6b3c", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600 }}>
                      <i className="ti ti-check" style={{ marginRight: 6 }} />Trainer Assigned!
                    </div>
                  ) : paymentStep === "confirm" ? (
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => setPaymentStep(null)} style={{
                        padding: "10px 18px", borderRadius: 8, border: "0.5px solid #e8e4dc",
                        background: "transparent", color: "#666", fontFamily: "sans-serif", cursor: "pointer", fontSize: 13
                      }}>Cancel</button>
                      <button onClick={handleAllocate} style={{
                        padding: "10px 24px", borderRadius: 8, border: "none",
                        background: "#1a6b3c", color: "#fff", fontFamily: "sans-serif", cursor: "pointer", fontSize: 13, fontWeight: 600
                      }}>Confirm & Pay ₹{selectedTrainer.fee} ↗</button>
                    </div>
                  ) : (
                    <button onClick={() => setPaymentStep("confirm")} style={{
                      padding: "12px 28px", borderRadius: 8, border: "none",
                      background: "#c9a227", color: "#fff", fontFamily: "sans-serif", cursor: "pointer", fontSize: 14, fontWeight: 600
                    }}>Book & Pay ₹{selectedTrainer.fee}/mo</button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================== ACTIVITY TAB =================== */}
          {tab === "activity" && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>My Activity</div>
                <div style={{ fontSize: 14, color: "#888", fontFamily: "sans-serif", marginTop: 4 }}>Workout history & performance metrics</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Workout breakdown */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "0.5px solid #e8e4dc" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Workout Breakdown</div>
                  <WorkoutBar label="Strength Training" value={USER.workouts.strength} max={30} color="#c9a227" />
                  <WorkoutBar label="Cardio" value={USER.workouts.cardio} max={30} color="#1a6b3c" />
                  <WorkoutBar label="HIIT" value={USER.workouts.hiit} max={30} color="#b04b00" />
                  <WorkoutBar label="Yoga" value={USER.workouts.yoga} max={30} color="#7b3f9e" />
                  <div style={{ marginTop: 16, padding: "12px 16px", background: "#faf8f3", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontFamily: "sans-serif", color: "#666" }}>Total sessions this month</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{Object.values(USER.workouts).reduce((a, b) => a + b, 0)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "0.5px solid #e8e4dc" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>This Month's Stats</div>
                  {[
                    { label: "Days Present", value: "19", icon: "ti-calendar-check", color: "#1a6b3c" },
                    { label: "Calories Burned", value: "14,320", icon: "ti-flame", color: "#b04b00" },
                    { label: "Active Hours", value: "38.5 hrs", icon: "ti-clock", color: "#1a5070" },
                    { label: "Current Streak", value: "7 days 🔥", icon: "ti-bolt", color: "#c9a227" },
                  ].map((s, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 0", borderBottom: i < 3 ? "0.5px solid #f5f2ec" : "none"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <i className={`ti ${s.icon}`} style={{ color: s.color, fontSize: 18 }} />
                        <span style={{ fontSize: 14, fontFamily: "sans-serif", color: "#555" }}>{s.label}</span>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full attendance */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "0.5px solid #e8e4dc" }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Attendance Heatmap</div>
                <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginBottom: 16 }}>
                  {USER.attendance.filter(Boolean).length} out of {USER.attendance.length} days this month
                </div>
                <AttendanceGrid data={USER.attendance} />
              </div>
            </div>
          )}

          {/* =================== SETTINGS TAB =================== */}
          {tab === "settings" && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>Settings & Plans</div>
                <div style={{ fontSize: 14, color: "#888", fontFamily: "sans-serif", marginTop: 4 }}>Manage your membership and preferences</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
                {Object.entries(PLANS).map(([key, p]) => (
                  <div key={key} style={{
                    background: "#fff", borderRadius: 14, padding: "22px",
                    border: USER.plan === key ? `2px solid ${p.color}` : "0.5px solid #e8e4dc",
                    position: "relative"
                  }}>
                    {USER.plan === key && (
                      <div style={{
                        position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                        background: p.color, color: "#fff", fontSize: 10, fontFamily: "sans-serif",
                        padding: "3px 12px", borderRadius: 99, fontWeight: 600
                      }}>CURRENT</div>
                    )}
                    <div style={{ fontSize: 16, fontWeight: 700, color: p.color, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>₹{p.fee.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: "#aaa", fontFamily: "sans-serif", marginBottom: 16 }}>per {p.months} months</div>
                    <div style={{ borderTop: "0.5px solid #f0ede6", paddingTop: 14 }}>
                      {p.perks.map((perk, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                          <i className="ti ti-check" style={{ color: p.color, fontSize: 14, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, fontFamily: "sans-serif", color: "#555" }}>{perk}</span>
                        </div>
                      ))}
                    </div>
                    {USER.plan !== key && (
                      <button onClick={() => showNotif(`Switched to ${p.name}!`)} style={{
                        marginTop: 14, width: "100%", padding: "9px", borderRadius: 8,
                        border: `0.5px solid ${p.color}`, background: "transparent",
                        color: p.color, fontFamily: "sans-serif", fontSize: 12, cursor: "pointer"
                      }}>Switch Plan</button>
                    )}
                  </div>
                ))}
              </div>

              {/* Profile section */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "0.5px solid #e8e4dc" }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Profile Information</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    ["Full Name", USER.name],
                    ["Member Since", new Date(USER.joinDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })],
                    ["Email", "vikram.nair@email.com"],
                    ["Phone", "+91 98765 43210"],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                      <div style={{ fontSize: 14, fontFamily: "sans-serif", color: "#333", padding: "10px 12px", background: "#faf8f3", borderRadius: 8 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pause Modal */}
      {pauseModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 360, maxWidth: "90vw" }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Request Pause Days</div>
            <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginBottom: 20 }}>
              You have {pauseRemaining} pause days remaining
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontFamily: "sans-serif", color: "#555", marginBottom: 8 }}>Number of days</div>
              <input type="range" min={1} max={pauseRemaining} value={pauseDays}
                onChange={e => setPauseDays(+e.target.value)} style={{ width: "100%" }} />
              <div style={{ textAlign: "center", fontSize: 28, fontWeight: 700, marginTop: 8 }}>{pauseDays}</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPauseModal(false)} style={{
                flex: 1, padding: "11px", borderRadius: 8, border: "0.5px solid #e8e4dc",
                background: "transparent", color: "#666", fontFamily: "sans-serif", cursor: "pointer"
              }}>Cancel</button>
              <button onClick={() => { setPauseModal(false); showNotif(`${pauseDays} pause day(s) requested successfully`); }} style={{
                flex: 1, padding: "11px", borderRadius: 8, border: "none",
                background: "#7b3f9e", color: "#fff", fontFamily: "sans-serif", cursor: "pointer", fontWeight: 600
              }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
      `}</style>
    </div>
  );
}