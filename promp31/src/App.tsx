import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Backpack from "@/pages/Backpack";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/backpack" element={<Backpack />} />
      </Routes>
    </Router>
  );
}
