import { BrowserRouter, Route, Routes } from "react-router-dom";
import GymDashboard from "./Pages/gym_dashboard";
import Login from "./Pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<GymDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

