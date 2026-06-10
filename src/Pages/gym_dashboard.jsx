import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const USER = {
  name: "Vikram Nair",
  avatar: "VN",
  location: "Koramangala, Bengaluru",
};

const GYMS = [
  {
    id: 1,
    name: "Iron Temple Fitness",
    address: "80 Feet Rd, Koramangala 4th Block",
    distance: "0.4 km",
    rating: 4.8,
    reviews: 312,
    tag: "Nearest",
    tagColor: "#1a6b3c",
    amenities: ["Pool", "Sauna", "Parking", "Locker"],
    image: "IT",
    imageColor: "#1a3a2a",
    plans: [
      { id: "day", label: "Day Pass", price: 199, desc: "Single day access" },
      { id: "month", label: "Monthly", price: 1499, desc: "Full month access" },
      { id: "quarter", label: "3 Months", price: 3999, desc: "Best value" },
    ],
  },
  {
    id: 2,
    name: "Cult.fit HSR",
    address: "27th Main, HSR Layout Sector 2",
    distance: "1.2 km",
    rating: 4.6,
    reviews: 508,
    tag: "Popular",
    tagColor: "#b04b00",
    amenities: ["Classes", "Cycling", "Parking", "Cafe"],
    image: "CF",
    imageColor: "#2a1a0a",
    plans: [
      { id: "day", label: "Day Pass", price: 249, desc: "Single day access" },
      { id: "month", label: "Monthly", price: 1799, desc: "Full month access" },
      { id: "quarter", label: "3 Months", price: 4799, desc: "Best value" },
    ],
  },
  {
    id: 3,
    name: "Gold's Gym Indiranagar",
    address: "100 Feet Rd, Indiranagar",
    distance: "2.1 km",
    rating: 4.9,
    reviews: 891,
    tag: "Top Rated",
    tagColor: "#c9a227",
    amenities: ["Pool", "Sauna", "Boxing", "Spa", "Parking"],
    image: "GG",
    imageColor: "#2a200a",
    plans: [
      { id: "day", label: "Day Pass", price: 349, desc: "Single day access" },
      { id: "month", label: "Monthly", price: 2499, desc: "Full month access" },
      { id: "quarter", label: "3 Months", price: 6499, desc: "Best value" },
    ],
  },
  {
    id: 4,
    name: "Snap Fitness BTM",
    address: "BTM Layout 2nd Stage",
    distance: "1.8 km",
    rating: 4.3,
    reviews: 174,
    tag: "24/7 Open",
    tagColor: "#1a5070",
    amenities: ["24/7", "Locker", "Cardio Zone"],
    image: "SF",
    imageColor: "#0a1a2a",
    plans: [
      { id: "day", label: "Day Pass", price: 149, desc: "Single day access" },
      { id: "month", label: "Monthly", price: 999, desc: "Full month access" },
      { id: "quarter", label: "3 Months", price: 2699, desc: "Best value" },
    ],
  },
  {
    id: 5,
    name: "Anytime Fitness JP Nagar",
    address: "JP Nagar 5th Phase",
    distance: "3.0 km",
    rating: 4.5,
    reviews: 263,
    tag: null,
    tagColor: null,
    amenities: ["24/7", "Parking", "Personal Training"],
    image: "AF",
    imageColor: "#1a1a2a",
    plans: [
      { id: "day", label: "Day Pass", price: 179, desc: "Single day access" },
      { id: "month", label: "Monthly", price: 1299, desc: "Full month access" },
      { id: "quarter", label: "3 Months", price: 3499, desc: "Best value" },
    ],
  },
];

const TRAINERS = [
  { id: 1, name: "Arjun Sharma", specialty: "Strength & Powerlifting", exp: "8 yrs", rating: 4.9, reviews: 142, feeHome: 800, feeGym: 600, slots: ["6:00 AM", "7:00 AM", "8:00 AM"], avatar: "AS", color: "#1a6b3c", at: "Home & Gym", certified: "NSCA-CPT" },
  { id: 2, name: "Priya Mehta", specialty: "Yoga & Flexibility", exp: "6 yrs", rating: 4.8, reviews: 98, feeHome: 700, feeGym: 500, slots: ["7:00 AM", "9:00 AM", "6:00 PM"], avatar: "PM", color: "#7b3f9e", at: "Home & Gym", certified: "RYT-500" },
  { id: 3, name: "Rohan Verma", specialty: "HIIT & Cardio", exp: "5 yrs", rating: 4.7, reviews: 87, feeHome: 750, feeGym: 550, slots: ["5:30 AM", "6:30 AM", "7:30 PM"], avatar: "RV", color: "#b04b00", at: "Home & Gym", certified: "ACE-CPT" },
  { id: 4, name: "Neha Singh", specialty: "Weight Loss & Nutrition", exp: "7 yrs", rating: 4.9, reviews: 211, feeHome: 900, feeGym: 700, slots: ["8:00 AM", "10:00 AM", "5:00 PM"], avatar: "NS", color: "#1a5070", at: "Home & Gym", certified: "ISSA-CFT" },
  { id: 5, name: "Karan Patel", specialty: "Bodybuilding", exp: "10 yrs", rating: 5.0, reviews: 305, feeHome: 1200, feeGym: 900, slots: ["4:30 AM", "5:30 AM", "6:30 AM"], avatar: "KP", color: "#7a1a1a", at: "Home & Gym", certified: "NASM-CPT" },
  { id: 6, name: "Divya Rao", specialty: "Zumba & Dance Fitness", exp: "4 yrs", rating: 4.6, reviews: 76, feeHome: 650, feeGym: 450, slots: ["9:00 AM", "11:00 AM", "7:00 PM"], avatar: "DR", color: "#5a1a5a", at: "Home & Gym", certified: "ZIN Member" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function Stars({ rating }) {
  return (
    <span style={{ color: "#c9a227", fontSize: 13 }}>
      {"★".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? "½" : ""}
      <span style={{ color: "#ddd" }}>{"★".repeat(5 - Math.ceil(rating))}</span>
    </span>
  );
}

function AmenityPill({ label }) {
  return (
    <span style={{
      fontSize: 11, fontFamily: "sans-serif", padding: "3px 10px",
      borderRadius: 99, background: "#f0ede6", color: "#666",
      border: "0.5px solid #e8e4dc"
    }}>{label}</span>
  );
}

function Notif({ notif }) {
  if (!notif) return null;
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 999,
      background: notif.type === "success" ? "#1a3a2a" : "#3a1a0a",
      color: "#fff", borderRadius: 12, padding: "14px 20px",
      fontSize: 14, fontFamily: "sans-serif",
      display: "flex", alignItems: "center", gap: 10,
      animation: "slideIn 0.3s ease"
    }}>
      <i className={`ti ${notif.type === "success" ? "ti-circle-check" : "ti-alert-circle"}`} style={{ fontSize: 18 }} />
      {notif.msg}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function GymDashboard() {
  const [tab, setTab] = useState("gyms");
  const [selectedGym, setSelectedGym] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [gymPayStep, setGymPayStep] = useState(null);
  const [bookedGyms, setBookedGyms] = useState([]);

  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerMode, setTrainerMode] = useState("home"); // "home" | "gym"
  const [trainerSlot, setTrainerSlot] = useState({});
  const [trainerPayStep, setTrainerPayStep] = useState(null);
  const [bookedTrainers, setBookedTrainers] = useState([]);

  const [searchQ, setSearchQ] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const [notif, setNotif] = useState(null);
  const [filterAmenity, setFilterAmenity] = useState("All");

  const showNotif = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3500);
  };

  const filteredGyms = GYMS
    .filter(g => g.name.toLowerCase().includes(searchQ.toLowerCase()) || g.address.toLowerCase().includes(searchQ.toLowerCase()))
    .filter(g => filterAmenity === "All" || g.amenities.includes(filterAmenity))
    .sort((a, b) => {
      if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") return a.plans[0].price - b.plans[0].price;
      return 0;
    });

  const confirmGymBooking = () => {
    const plan = selectedPlan[selectedGym.id];
    if (!plan) return showNotif("Please select a plan first", "error");
    setBookedGyms(prev => [...prev.filter(b => b.gymId !== selectedGym.id), { gymId: selectedGym.id, gymName: selectedGym.name, plan }]);
    setGymPayStep("success");
    showNotif(`${selectedGym.name} booked successfully!`);
    setTimeout(() => { setGymPayStep(null); setSelectedGym(null); }, 1800);
  };

  const confirmTrainerBooking = () => {
    const slot = trainerSlot[selectedTrainer.id];
    if (!slot) return showNotif("Please select a time slot", "error");
    setBookedTrainers(prev => [...prev.filter(b => b.trainerId !== selectedTrainer.id), {
      trainerId: selectedTrainer.id, trainerName: selectedTrainer.name,
      mode: trainerMode, slot, fee: trainerMode === "home" ? selectedTrainer.feeHome : selectedTrainer.feeGym
    }]);
    setTrainerPayStep("success");
    showNotif(`${selectedTrainer.name} booked for ${trainerMode === "home" ? "home session" : "gym session"}!`);
    setTimeout(() => { setTrainerPayStep(null); setSelectedTrainer(null); }, 1800);
  };

  const tabs = [
    { id: "gyms", icon: "ti-building", label: "Gyms Nearby" },
    { id: "trainers", icon: "ti-user-star", label: "Trainers" },
    { id: "bookings", icon: "ti-calendar-check", label: "My Bookings" },
    { id: "profile", icon: "ti-user", label: "Profile" },
  ];

  const allAmenities = ["All", ...new Set(GYMS.flatMap(g => g.amenities))];

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#faf8f3", minHeight: "100vh", color: "#1a1a1a", display: "flex" }}>
      <h2 className="sr-only">Gym Booking Dashboard</h2>
      <Notif notif={notif} />

      {/* SIDEBAR */}
      <div style={{
        width: 230, background: "#141412", color: "#fff",
        display: "flex", flexDirection: "column", padding: "0 0 24px",
        position: "sticky", top: 0, height: "100vh", flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 20px", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.06em", color: "#c9a227" }}>
            <i className="ti ti-bolt" style={{ marginRight: 8 }} aria-hidden="true" />GYMFIND
          </div>
          <div style={{ fontSize: 10, color: "#666", marginTop: 3, fontFamily: "sans-serif", letterSpacing: "0.14em" }}>BOOK · TRAIN · ACHIEVE</div>
        </div>

        {/* User */}
        <div style={{ padding: "18px 24px 16px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: "#c9a227",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13, fontFamily: "sans-serif", color: "#1a1a00", flexShrink: 0
            }}>{USER.avatar}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#f0ede6" }}>{USER.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <i className="ti ti-map-pin" style={{ fontSize: 11, color: "#888" }} aria-hidden="true" />
                <span style={{ fontSize: 11, color: "#666", fontFamily: "sans-serif" }}>Koramangala</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%",
              padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              background: tab === t.id ? "rgba(201,162,39,0.12)" : "transparent",
              color: tab === t.id ? "#c9a227" : "#888",
              fontSize: 14, fontFamily: "sans-serif", transition: "all 0.2s",
              borderLeft: tab === t.id ? "2px solid #c9a227" : "2px solid transparent",
              marginBottom: 2
            }}>
              <i className={`ti ${t.icon}`} style={{ fontSize: 17 }} aria-hidden="true" />
              {t.label}
              {t.id === "bookings" && (bookedGyms.length + bookedTrainers.length) > 0 && (
                <span style={{
                  marginLeft: "auto", background: "#c9a227", color: "#141412",
                  borderRadius: 99, fontSize: 10, fontWeight: 700, fontFamily: "sans-serif",
                  padding: "2px 7px"
                }}>{bookedGyms.length + bookedTrainers.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Location pill */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ background: "rgba(201,162,39,0.08)", borderRadius: 10, padding: "12px 14px", border: "0.5px solid rgba(201,162,39,0.2)" }}>
            <div style={{ fontSize: 10, color: "#666", fontFamily: "sans-serif", letterSpacing: "0.1em", marginBottom: 4 }}>YOUR LOCATION</div>
            <div style={{ fontSize: 13, color: "#c9a227", fontFamily: "sans-serif" }}>{USER.location}</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto", minWidth: 0 }}>

        {/* ═══════════════ GYMS NEARBY TAB ═══════════════ */}
        {tab === "gyms" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 26, fontWeight: 700 }}>Gyms Near You</div>
              <div style={{ fontSize: 14, color: "#888", fontFamily: "sans-serif", marginTop: 4 }}>
                Showing gyms within 5 km of {USER.location}
              </div>
            </div>

            {/* Search + filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                <i className="ti ti-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 16 }} aria-hidden="true" />
                <input
                  type="text" placeholder="Search gym or area…" value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px 10px 38px", borderRadius: 10, border: "0.5px solid #e8e4dc", background: "#fff", fontFamily: "sans-serif", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: "0.5px solid #e8e4dc", background: "#fff", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
                <option value="distance">Sort: Nearest</option>
                <option value="rating">Sort: Top Rated</option>
                <option value="price">Sort: Lowest Price</option>
              </select>
            </div>

            {/* Amenity filter chips */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {allAmenities.map(a => (
                <button key={a} onClick={() => setFilterAmenity(a)} style={{
                  padding: "6px 14px", borderRadius: 99, border: "0.5px solid",
                  borderColor: filterAmenity === a ? "#c9a227" : "#e8e4dc",
                  background: filterAmenity === a ? "#fffbea" : "#fff",
                  color: filterAmenity === a ? "#c9a227" : "#666",
                  fontFamily: "sans-serif", fontSize: 12, cursor: "pointer"
                }}>{a}</button>
              ))}
            </div>

            {/* Gym cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filteredGyms.map(gym => {
                const isBooked = bookedGyms.find(b => b.gymId === gym.id);
                const chosen = selectedPlan[gym.id];
                return (
                  <div key={gym.id} style={{
                    background: "#fff", borderRadius: 16, border: selectedGym?.id === gym.id ? "1.5px solid #c9a227" : "0.5px solid #e8e4dc",
                    overflow: "hidden", transition: "border 0.2s"
                  }}>
                    {/* Card header */}
                    <div style={{ display: "flex", gap: 0 }}>
                      {/* Color block */}
                      <div style={{ width: 80, background: gym.imageColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 26, fontWeight: 800, color: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }}>{gym.image}</span>
                      </div>

                      <div style={{ flex: 1, padding: "18px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                              <div style={{ fontSize: 17, fontWeight: 700 }}>{gym.name}</div>
                              {gym.tag && (
                                <span style={{
                                  fontSize: 10, fontFamily: "sans-serif", fontWeight: 700,
                                  padding: "2px 10px", borderRadius: 99,
                                  background: gym.tagColor + "18", color: gym.tagColor,
                                  border: `0.5px solid ${gym.tagColor}44`
                                }}>{gym.tag}</span>
                              )}
                              {isBooked && (
                                <span style={{
                                  fontSize: 10, fontFamily: "sans-serif", fontWeight: 700,
                                  padding: "2px 10px", borderRadius: 99,
                                  background: "#eef7f1", color: "#1a6b3c", border: "0.5px solid #1a6b3c44"
                                }}>BOOKED</span>
                              )}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                              <i className="ti ti-map-pin" style={{ fontSize: 13, color: "#aaa" }} aria-hidden="true" />
                              <span style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif" }}>{gym.address}</span>
                            </div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 13, fontFamily: "sans-serif", color: "#1a6b3c", fontWeight: 600 }}>{gym.distance}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, justifyContent: "flex-end" }}>
                              <Stars rating={gym.rating} />
                              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "sans-serif" }}>{gym.rating}</span>
                            </div>
                            <div style={{ fontSize: 11, color: "#aaa", fontFamily: "sans-serif" }}>{gym.reviews} reviews</div>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                          {gym.amenities.map(a => <AmenityPill key={a} label={a} />)}
                        </div>

                        {/* Plan pills */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          {gym.plans.map(p => (
                            <button key={p.id} onClick={() => setSelectedPlan(prev => ({ ...prev, [gym.id]: p }))} style={{
                              padding: "8px 16px", borderRadius: 10, cursor: "pointer",
                              border: chosen?.id === p.id ? "1.5px solid #c9a227" : "0.5px solid #e8e4dc",
                              background: chosen?.id === p.id ? "#fffbea" : "#faf8f3",
                              fontFamily: "sans-serif", transition: "all 0.15s"
                            }}>
                              <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>{p.label}</div>
                              <div style={{ fontSize: 15, fontWeight: 700, color: chosen?.id === p.id ? "#c9a227" : "#1a1a1a" }}>₹{p.price}</div>
                            </button>
                          ))}

                          <button onClick={() => {
                            if (!selectedPlan[gym.id]) return showNotif("Select a plan first", "error");
                            setSelectedGym(gym);
                            setGymPayStep("confirm");
                          }} style={{
                            marginLeft: "auto", padding: "10px 22px", borderRadius: 10, border: "none",
                            background: isBooked ? "#e8f5ef" : "#c9a227", color: isBooked ? "#1a6b3c" : "#fff",
                            fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer"
                          }}>
                            {isBooked ? "Rebook" : "Book Now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════ TRAINERS TAB ═══════════════ */}
        {tab === "trainers" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 26, fontWeight: 700 }}>Personal Trainers</div>
              <div style={{ fontSize: 14, color: "#888", fontFamily: "sans-serif", marginTop: 4 }}>
                Available for home sessions and gym sessions
              </div>
            </div>

            {/* Home vs Gym toggle */}
            <div style={{ display: "inline-flex", background: "#f0ede6", borderRadius: 10, padding: 4, marginBottom: 24 }}>
              {[["home", "ti-home", "At Home"], ["gym", "ti-building", "At Gym"]].map(([mode, icon, label]) => (
                <button key={mode} onClick={() => setTrainerMode(mode)} style={{
                  padding: "9px 22px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: trainerMode === mode ? "#fff" : "transparent",
                  color: trainerMode === mode ? "#1a1a1a" : "#888",
                  fontFamily: "sans-serif", fontSize: 13, fontWeight: trainerMode === mode ? 600 : 400,
                  display: "flex", alignItems: "center", gap: 6,
                  boxShadow: trainerMode === mode ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.2s"
                }}>
                  <i className={`ti ${icon}`} style={{ fontSize: 15 }} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            {trainerMode === "home" && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
                background: "#eef7f1", border: "0.5px solid #1a6b3c44", borderRadius: 10, padding: "12px 16px"
              }}>
                <i className="ti ti-circle-check" style={{ color: "#1a6b3c", fontSize: 18 }} aria-hidden="true" />
                <span style={{ fontSize: 13, fontFamily: "sans-serif", color: "#1a6b3c" }}>
                  All trainers are available for home visits anywhere in Bengaluru. Equipment provided.
                </span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {TRAINERS.map(t => {
                const isBooked = bookedTrainers.find(b => b.trainerId === t.id);
                const fee = trainerMode === "home" ? t.feeHome : t.feeGym;
                return (
                  <div key={t.id} style={{
                    background: "#fff", borderRadius: 16, padding: "20px",
                    border: selectedTrainer?.id === t.id ? "1.5px solid #c9a227" : "0.5px solid #e8e4dc",
                    cursor: "pointer", transition: "border 0.15s"
                  }} onClick={() => setSelectedTrainer(selectedTrainer?.id === t.id ? null : t)}>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: "50%", background: t.color,
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: 16, fontFamily: "sans-serif", flexShrink: 0
                      }}>{t.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 600 }}>{t.name}</div>
                            <div style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif", marginTop: 2 }}>{t.specialty}</div>
                          </div>
                          {isBooked && (
                            <span style={{ fontSize: 10, fontFamily: "sans-serif", fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#eef7f1", color: "#1a6b3c" }}>BOOKED</span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 10, marginTop: 6, alignItems: "center" }}>
                          <Stars rating={t.rating} />
                          <span style={{ fontSize: 12, fontFamily: "sans-serif", color: "#888" }}>{t.rating} ({t.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                      {[t.exp + " exp", t.certified, trainerMode === "home" ? "Home visits" : "Gym sessions"].map(tag => (
                        <span key={tag} style={{ fontSize: 11, fontFamily: "sans-serif", padding: "3px 10px", borderRadius: 99, background: "#f5f2ec", color: "#666" }}>{tag}</span>
                      ))}
                    </div>

                    <div style={{ borderTop: "0.5px solid #f5f2ec", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#aaa", fontFamily: "sans-serif" }}>{trainerMode === "home" ? "Home visit" : "Gym session"}</div>
                        <div style={{ fontSize: 20, fontWeight: 700 }}>₹{fee}<span style={{ fontSize: 12, color: "#aaa", fontWeight: 400 }}>/session</span></div>
                      </div>
                      {selectedTrainer?.id === t.id && (
                        <div style={{ fontSize: 12, color: "#c9a227", fontFamily: "sans-serif" }}>
                          <i className="ti ti-check" style={{ marginRight: 4 }} />Selected
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Booking panel */}
            {selectedTrainer && (
              <div style={{
                marginTop: 24, background: "#fff", borderRadius: 16, padding: "24px",
                border: "0.5px solid #e8e4dc"
              }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                  Book {selectedTrainer.name}
                  <span style={{ fontSize: 13, color: "#888", fontWeight: 400, marginLeft: 8, fontFamily: "sans-serif" }}>
                    {trainerMode === "home" ? "· Home Visit" : "· Gym Session"}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginBottom: 18 }}>
                  Select a time slot for your session
                </div>

                <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                  {selectedTrainer.slots.map(slot => (
                    <button key={slot} onClick={() => setTrainerSlot(prev => ({ ...prev, [selectedTrainer.id]: slot }))} style={{
                      padding: "9px 18px", borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13,
                      border: trainerSlot[selectedTrainer.id] === slot ? "1.5px solid #c9a227" : "0.5px solid #e8e4dc",
                      background: trainerSlot[selectedTrainer.id] === slot ? "#fffbea" : "#faf8f3",
                      color: trainerSlot[selectedTrainer.id] === slot ? "#c9a227" : "#555",
                    }}>
                      <i className="ti ti-clock" style={{ marginRight: 6, fontSize: 14 }} aria-hidden="true" />{slot}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    ₹{trainerMode === "home" ? selectedTrainer.feeHome : selectedTrainer.feeGym}
                    <span style={{ fontSize: 13, color: "#aaa", fontWeight: 400, fontFamily: "sans-serif" }}>/session</span>
                  </div>
                  {trainerPayStep === "success" ? (
                    <div style={{ color: "#1a6b3c", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600 }}>
                      <i className="ti ti-circle-check" style={{ marginRight: 6 }} />Booked!
                    </div>
                  ) : trainerPayStep === "confirm" ? (
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => setTrainerPayStep(null)} style={{ padding: "10px 18px", borderRadius: 8, border: "0.5px solid #e8e4dc", background: "transparent", color: "#666", fontFamily: "sans-serif", cursor: "pointer", fontSize: 13 }}>Cancel</button>
                      <button onClick={confirmTrainerBooking} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#1a6b3c", color: "#fff", fontFamily: "sans-serif", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                        Confirm & Pay ₹{trainerMode === "home" ? selectedTrainer.feeHome : selectedTrainer.feeGym}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setTrainerPayStep("confirm")} style={{
                      padding: "12px 28px", borderRadius: 10, border: "none",
                      background: "#c9a227", color: "#fff", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer"
                    }}>Book Session</button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ MY BOOKINGS TAB ═══════════════ */}
        {tab === "bookings" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 26, fontWeight: 700 }}>My Bookings</div>
              <div style={{ fontSize: 14, color: "#888", fontFamily: "sans-serif", marginTop: 4 }}>
                All your gym and trainer bookings
              </div>
            </div>

            {bookedGyms.length === 0 && bookedTrainers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <i className="ti ti-calendar-off" style={{ fontSize: 48, color: "#ddd", display: "block", marginBottom: 16 }} aria-hidden="true" />
                <div style={{ fontSize: 18, fontWeight: 600, color: "#aaa", fontFamily: "sans-serif" }}>No bookings yet</div>
                <div style={{ fontSize: 14, color: "#ccc", fontFamily: "sans-serif", marginTop: 6 }}>Browse gyms or trainers to get started</div>
                <button onClick={() => setTab("gyms")} style={{
                  marginTop: 20, padding: "12px 28px", borderRadius: 10, border: "0.5px solid #c9a227",
                  background: "transparent", color: "#c9a227", fontFamily: "sans-serif", cursor: "pointer", fontSize: 14
                }}>Explore Gyms →</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {bookedGyms.map(b => {
                  const gym = GYMS.find(g => g.id === b.gymId);
                  return (
                    <div key={b.gymId} style={{
                      background: "#fff", borderRadius: 14, padding: "20px",
                      border: "0.5px solid #e8e4dc", display: "flex", alignItems: "center", gap: 18
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 12, background: gym.imageColor,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif", flexShrink: 0
                      }}>{gym.image}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{b.gymName}</div>
                        <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginTop: 2 }}>
                          {b.plan.label} · ₹{b.plan.price}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontFamily: "sans-serif", padding: "4px 12px", borderRadius: 99, background: "#eef7f1", color: "#1a6b3c", fontWeight: 600 }}>ACTIVE</span>
                        <button onClick={() => setBookedGyms(prev => prev.filter(x => x.gymId !== b.gymId))} style={{
                          padding: "7px 14px", borderRadius: 8, border: "0.5px solid #fde8e8", background: "#fef6f6",
                          color: "#c44", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer"
                        }}>Cancel</button>
                      </div>
                    </div>
                  );
                })}

                {bookedTrainers.map(b => {
                  const trainer = TRAINERS.find(t => t.id === b.trainerId);
                  return (
                    <div key={b.trainerId} style={{
                      background: "#fff", borderRadius: 14, padding: "20px",
                      border: "0.5px solid #e8e4dc", display: "flex", alignItems: "center", gap: 18
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: "50%", background: trainer.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "sans-serif", flexShrink: 0
                      }}>{trainer.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{b.trainerName}</div>
                        <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginTop: 2 }}>
                          {b.mode === "home" ? "Home visit" : "Gym session"} · {b.slot} · ₹{b.fee}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontFamily: "sans-serif", padding: "4px 12px", borderRadius: 99, background: "#eef7f1", color: "#1a6b3c", fontWeight: 600 }}>CONFIRMED</span>
                        <button onClick={() => setBookedTrainers(prev => prev.filter(x => x.trainerId !== b.trainerId))} style={{
                          padding: "7px 14px", borderRadius: 8, border: "0.5px solid #fde8e8", background: "#fef6f6",
                          color: "#c44", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer"
                        }}>Cancel</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ PROFILE TAB ═══════════════ */}
        {tab === "profile" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 26, fontWeight: 700 }}>My Profile</div>
              <div style={{ fontSize: 14, color: "#888", fontFamily: "sans-serif", marginTop: 4 }}>Your account and preferences</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Account card */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "28px", border: "0.5px solid #e8e4dc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%", background: "#c9a227",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 22, fontFamily: "sans-serif", color: "#1a1a00"
                  }}>{USER.avatar}</div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{USER.name}</div>
                    <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginTop: 2 }}>Member since Jan 2025</div>
                  </div>
                </div>
                {[["Email", "vikram.nair@email.com", "ti-mail"], ["Phone", "+91 98765 43210", "ti-phone"], ["Location", USER.location, "ti-map-pin"]].map(([label, val, icon]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "0.5px solid #f5f2ec" }}>
                    <i className={`ti ${icon}`} style={{ color: "#aaa", fontSize: 18, flexShrink: 0 }} aria-hidden="true" />
                    <div>
                      <div style={{ fontSize: 11, color: "#aaa", fontFamily: "sans-serif" }}>{label}</div>
                      <div style={{ fontSize: 14, fontFamily: "sans-serif", color: "#333", marginTop: 2 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Gyms Booked", value: bookedGyms.length, icon: "ti-building", color: "#c9a227" },
                  { label: "Trainers Booked", value: bookedTrainers.length, icon: "ti-user-star", color: "#1a6b3c" },
                  { label: "Total Spent", value: `₹${[...bookedGyms.map(b => b.plan.price), ...bookedTrainers.map(b => b.fee)].reduce((a, b) => a + b, 0).toLocaleString()}`, icon: "ti-receipt", color: "#1a5070" },
                  { label: "Gyms Nearby", value: GYMS.length, icon: "ti-map-pin", color: "#b04b00" },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 14, padding: "18px 20px",
                    border: "0.5px solid #e8e4dc", display: "flex", alignItems: "center", gap: 16
                  }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10, background: s.color + "15",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <i className={`ti ${s.icon}`} style={{ color: s.color, fontSize: 20 }} aria-hidden="true" />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "#aaa", fontFamily: "sans-serif" }}>{s.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── GYM BOOKING MODAL ── */}
      {selectedGym && gymPayStep === "confirm" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: 420, maxWidth: "90vw" }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Confirm Booking</div>
            <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginBottom: 24 }}>Review your booking details</div>

            <div style={{ background: "#faf8f3", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{selectedGym.name}</div>
              <div style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif", marginBottom: 12 }}>{selectedGym.address}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#aaa", fontFamily: "sans-serif" }}>Plan</div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{selectedPlan[selectedGym.id]?.label}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "#aaa", fontFamily: "sans-serif" }}>Amount</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#c9a227" }}>₹{selectedPlan[selectedGym.id]?.price}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setGymPayStep(null); setSelectedGym(null); }} style={{
                flex: 1, padding: "12px", borderRadius: 10, border: "0.5px solid #e8e4dc",
                background: "transparent", color: "#666", fontFamily: "sans-serif", cursor: "pointer", fontSize: 14
              }}>Cancel</button>
              <button onClick={confirmGymBooking} style={{
                flex: 2, padding: "12px", borderRadius: 10, border: "none",
                background: "#c9a227", color: "#fff", fontFamily: "sans-serif", cursor: "pointer", fontSize: 14, fontWeight: 600
              }}>Pay ₹{selectedPlan[selectedGym.id]?.price} & Confirm</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}