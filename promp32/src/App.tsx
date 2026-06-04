import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import Detail from "@/pages/Detail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Publish from "@/pages/Publish";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/edit/:id" element={<Publish />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
